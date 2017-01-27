/* eslint no-console: 0 */
'use strict';
const express     = require('express'),
      compression = require('compression'),
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
    return function(req, res, next) {
      if (exceptions.indexOf(req.originalUrl) === -1) {
        return bunyan_middleware(req, res, next);
      } else {
        return next();
      }
    }
  }

  /* istanbul ignore next */
  return function (_config, logger) {
    const app         = express(),
          config      = Object.assign({port: process.env.PORT || 3000}, _config);
    
    app.use(require('express-toobusy')());
    app.use(compression());
    app.use(bodyParser.json());

    if (config.environment === 'dev') {
      app.use(log_middleware(logger, routes_to_filter));
    }
    
    routes(app, config, logger);
    if (config.environment !== 'test') {
      app.listen(config.port, () => {
        logger.info(`[child:${config.id}] listening on port ${config.port}!`);
      });
    }
  };
};
