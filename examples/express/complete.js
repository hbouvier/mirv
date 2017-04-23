/* eslint import/no-duplicates: off */
import * as express from 'express';
import createApplication from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import socketIO from 'socket.io';
import bunyan from 'bunyan-middleware';
import compression from 'compression';
import tooBusy from 'express-toobusy';
import * as mirv from 'mirv';

mirv.engineSatisfies('7.2');

function middleware({ app, config, logger }) {
  app.use(tooBusy());
  app.use(compression());
  app.use(bodyParser.json());
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

function routes({ io, app, config }) {
  app.get('/healthz', (req, res) => {
    res.json({ ok:true }).end();
  });

  app.get('/version', (req, res) => {
    res.json({ version: config.version }).end();
  });

  io.on('connection', (socket) => {
    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('echo', (data) => {
      socket.emit('echo', data);
    });
  });
}

function listener({ server, logger, config }) {
  server.listen(
    config.port,
    () => logger.info(`[child:${config.id}] listening on port ${config.port}!`)
  );
}

const config = {
  name: 'mirv',
  level: 'INFO',
  port: 3000 || process.env.PORT,
  webRoot: process.argv[2] || '.',
  environment: process.env.NODE_ENV || 'dev',
  version: JSON.parse(fs.readFileSync(`${path.resolve(__dirname)}/package.json`)).version
};

const app = createApplication();
const server = http.createServer(app);
const io = socketIO(server);
const worker = mirv.server({
  server,
  io,
  app,
  application: [middleware, routes, listener],
  config
});

mirv.supervisor({ worker, config });
