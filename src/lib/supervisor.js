import * as os from 'os';
import cluster from 'cluster';
import * as bunyan from 'bunyan';
import { range } from './instance';
import { Strategy } from './strategy';

// console.log('Strategy:', Strategy);

const nbCPUs = process.env.CPUS || os.cpus().length;
const defaultConfig = {
  name: 'mirv',
  level: 'INFO',
  port: process.env.PORT || 3000,
  strategy: Strategy.terminate,
  environment: process.env.NODE_ENV || 'dev',
};

export function supervisor({ worker, config }) {
  const configuration = Object.assign({}, defaultConfig, config || {});
  const logger = bunyan.createLogger({
    name: configuration.name,
    level: configuration.level,
  });

  function bootstrap(bootstrapConfig) {
    /* istanbul ignore else */
    if (bootstrapConfig.environment === 'test') {
      worker({ config: Object.assign({}, { id: 1 }, bootstrapConfig), logger });
    } else if (cluster.isMaster) {
      supervisorImpl(bootstrapConfig);
    } else {
      worker({ config: Object.assign({}, { id: cluster.worker.id }, bootstrapConfig), logger });
    }
    return bootstrapConfig;
  }

  /* istanbul ignore next */
  function supervisorImpl(supervisorConfig) {
    const nbWorkers = supervisorConfig.nbWorkers || nbCPUs;
    logger.info(`[master] Starting ${nbWorkers} worker thread(s) on ${nbCPUs} available CPU(s).`);
    range(nbWorkers).forEach(() => cluster.fork());

    cluster.on('exit', (child, code, signal) => {
      switch (supervisorConfig.strategy) {
        case Strategy.restart:
          logger.error(`[master] ${child.process.pid} died (signal: ${signal} >>> restarting in 5 seconds.`);
          setTimeout(() => cluster.fork(), 5000);
          break;

        case Strategy.terminate:
        default:
          logger.error(`[master] ${child.process.pid} died >>> TERMINATING ALL CHILDREN.`);
          process.exit(-1);
          break;
      }
    });

    cluster.on('error', (child, error) => {
      logger.error(`[master] child: ${child.process.pid} UNHANDLED ERROR >>> error:${error}`);
    });
  }

  return bootstrap(configuration);
}

export default supervisor;