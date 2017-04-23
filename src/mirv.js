/* eslint import/no-duplicates: off */
import * as express from 'express';
import createApplication from 'express';
import bunyan from 'bunyan-middleware';
import * as mirv from './lib';

mirv.engineSatisfies('6.0');

function middleware({ app, config, logger }) {
  app.use(express.static(config.webRoot));
  if (config.environment !== 'test') {
    app.use(bunyan({
      headerName: 'X-Request-Id',
      propertyName: 'reqId',
      logName: 'req_id',
      obscureHeaders: [],
      logger,
    }));
  }
}

function listener({ app, logger, config }) {
  app.listen(
    config.port,
    () => logger.info(`[child:${config.id}] listening on port ${config.port}!`)
  );
}

const config = {
  name: 'mirv',
  level: 'INFO',
  port: 3000 || process.env.PORT,
  webRoot: process.argv[2] || '.',
  environment: process.env.NODE_ENV || 'dev'
};

const app = createApplication();
const worker = mirv.server({
  app,
  application: [middleware, listener],
  config
});

mirv.supervisor({ worker, config });
