/* eslint no-param-reassign: "off" */
/* eslint new-cap: "off" */
/* eslint no-console: "off" */

import * as restify from 'restify';
import * as os from 'os';
import restifyBunyanLogger from 'restify-bunyan-logger';
import * as path from 'path';
import * as fs from 'fs';
import * as mirv from 'mirv';

mirv.engineSatisfies('7.2');

function middleware({ server, logger }) {
  server.log = logger;
  server.use(restify.fullResponse())
        .use(restify.queryParser())
        .use(restify.bodyParser({
          maxBodySize: 0,
          mapParams: false,
          mapFiles: false,
          overrideParams: false,
          keepExtensions: false,
          uploadDir: os.tmpdir(),
          multiples: true,
          hash: 'sha1',
        }));
  server.on('after', restifyBunyanLogger({
    // Do not log /healthz
    skip: req => req.method === 'GET' && req.route && req.route.path === '/healthz',
    custom: (req, res, route, err, log) => {
      // Add the length of the request to the log,
      // this will not work when using gzip.
      log.res.length = res.get('Content-Length');
      // Don't forget to return!
      return log;
    },
  }));
}

function routes({ server, logger }) {
  server.get('/healthz', (req, res, next) => {
    res.send(204);
    return next();
  });
  server.get('/version', (req, res, next) => {
    res.send(200, { version: config.version });
    return next();
  });
  server.put('/echo/:value', (req, res, next) => {
    logger.info('headers:', req.headers);
    logger.info('params:', req.params);
    logger.info('body:', req.body);
    res.send(200, { value: req.params.value });
    return next();
  });
}

function listener({ server, logger, config }) {
  server.listen(config.port, () => {
    logger.info(`[child:${config.id}] {server.name} listening at ${server.url} on port ${config.port}`);
  });
}

const config = {
  webRoot: process.argv[2] || '.',
  version: JSON.parse(fs.readFileSync(`${path.resolve(__dirname)}/package.json`)).version
};

const server = restify.createServer();
const worker = mirv.server({ server, application: [middleware, routes, listener], config });

mirv.supervisor({ worker, config });
