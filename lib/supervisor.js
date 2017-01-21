/* eslint no-console: 0 */
'use strict';
const cluster       = require('cluster'),
      bunyan        = require('bunyan'),
      Strategy      = require('./strategy'),
      nb_cpu        = require('os').cpus().length,
      defaultConfig = {
        name:        'mirv',
        level:       'INFO',
        strategy:    Strategy.terminate,
        environment: process.env.NODE_ENV || 'production'
      };

module.exports = function (worker, _config) {
  var config = Object.assign({}, defaultConfig, _config || {});
  const logger = bunyan.createLogger({
                   name:  config.name,
                   level: config.level
                 });

  function bootstrap(config) {
    /* istanbul ignore else */
    if (config.environment === 'test') {
      worker(Object.assign({id: 1}, config), logger);
    } else if (cluster.isMaster) {
      supervisor(config);
    } else { 
      worker(Object.assign({id: cluster.worker.id}, config), logger);
    }
    return config;
  }

  /* istanbul ignore next */
  function supervisor(config) {
    const nb_workers = config.nb_workers || nb_cpu;
    logger.info(`[master] Starting ${nb_workers} worker thread(s) on ${nb_cpu} available CPU(s).`);
    for (let i = 0; i < nb_workers; i++) {
      cluster.fork();
    }

    cluster.on('exit', (child, code, signal) => {
      switch(config.strategy) {
        case Strategy.restart:
          logger.error(`[master] ${child.process.pid} died >>> restarting in 5 seconds.`);
          setTimeout( () => cluster.fork(), 5000);
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

  return bootstrap(config);
};
