/* eslint import/no-duplicates: off */
import * as express from 'express';
import createApplication from 'express';
import * as bodyParser from 'body-parser';
import * as mirv from './lib';

mirv.engineSatisfies('7.2');

function middleware({ app, config }) {
  app.use(bodyParser.json());
  app.use(express.static(config.webRoot));
}

function listener({ app, logger, config }) {
  app.listen(
    config.port,
    () => logger.info(`[child:${config.id}] listening on port ${config.port}!`)
  );
}

const config = {
  webRoot: process.argv[2] || '.'
};

const app = createApplication();
const worker = mirv.server({ app, application: [middleware, listener], config });

mirv.supervisor({ worker, config });
