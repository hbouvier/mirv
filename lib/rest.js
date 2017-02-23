/* eslint no-console: 0 */
'use strict';
const http        = require('http'),
      express     = require('express'),
      app         = express(),
      server      = http.createServer(app),
      io          = require('socket.io')(server),
      compression = require('compression'),
      instance    = require('./instance'),
      bodyParser  = require('body-parser'),
      bunyan      = require('bunyan-middleware');

module.exports = function (routes, routes_to_filter) {
  
  /* istanbul ignore next */
  function log_middleware(logger, _exceptions) {
    const exceptions = _exceptions || [];

    const bunyan_middleware = bunyan({
        headerName: 'X-Request-Id'
      , propertyName: 'reqId'
      , logName: 'req_id'
      , obscureHeaders: []
      , logger: logger
      }
    );
    return (req, res, next) => {
      if (exceptions.indexOf(req.originalUrl) === -1) {
        return bunyan_middleware(req, res, next);
      } else {
        return next();
      }
    }
  }

  /* istanbul ignore next */
  return function (_config, logger) {
    const config      = Object.assign({port: process.env.PORT || 3000}, _config);
    
    app.use(require('express-toobusy')());
    app.use(compression());
    app.use(bodyParser.json());
    if (process.env['NODE_ENV'] !== 'test') {
      app.use(log_middleware(logger, routes_to_filter));
    }

    const vector_of_routes = instance.of(routes) == 'array' ? routes : [routes];
    vector_of_routes.forEach( r => r(app, config, logger, io));
    if (process.env['NODE_ENV'] !== 'test') {
      server.listen(config.port, () => {
        logger.info(`[child:${config.id}] listening on port ${config.port}!`);
      });
    }
    return app;
  };
};
