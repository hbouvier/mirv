import createApplication from 'express';
import * as mirv from './lib';

function application({ app, config, logger }) {
  app.get('/healthz', (req, res) => {
    res.json({ ok:true }).end();
  });

  app.listen(
    config.port,
    () => logger.info(`[child:${config.id}] listening on port ${config.port}!`)
  );
}

const app = createApplication();
const worker = mirv.server({ app, application });

mirv.supervisor({ worker });
