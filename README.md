[![Build Status](https://travis-ci.org/hbouvier/mirv.png)](https://travis-ci.org/hbouvier/mirv)
[![Coverage Status](https://coveralls.io/repos/hbouvier/mirv/badge.png)](https://coveralls.io/r/hbouvier/mirv)
[![dependency Status](https://david-dm.org/hbouvier/mirv/status.png?theme=shields.io)](https://david-dm.org/hbouvier/mirv#info=dependencies)
[![devDependency Status](https://david-dm.org/hbouvier/mirv/dev-status.png?theme=shields.io)](https://david-dm.org/hbouvier/mirv#info=devDependencies)
[![NPM version](https://badge.fury.io/js/mirv.png)](http://badge.fury.io/js/mirv)

# Multiple Independently Request Vassal (MIRV)


```bash
$ npm install -g istanbul
```


## Use it as a module

npm --save install mirv

```main.js
'use strict';

const mirv    = require('./lib'),
      express = require('express'),
      fs      = require('fs');

function routes(app, config, logger) {
  const pkg = JSON.parse(fs.readFileSync('package.json'));
  app.use(express.static('.'));
  app.get('/health', (req, res) => {
    res.json({ok:true}).end();
  });
  app.get('/version', (req, res) => {
    res.json({version:pkg.version}).end();
  });
}

const do_not_log_routes = ['/health'];
mirv.supervisor(mirv.rest(routes, do_not_log_routes));
```

