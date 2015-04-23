Key/value configuration management
--

Setty is a small node configuration util, which help better manage key/value settings across different environments.
Depends on [nconf](https://github.com/flatiron/nconf).

## Installation

Installing the module
```
npm install setty --save-dev
```

## Usage exampple:

```
var setty = require('setty');
var path = require('path');

setty.load({
      profileEnv: 'SETTY_PROFILE',
      profile: '.config', // Default value
      configFileName: 'config.json', // Default value
      settingsDir: path.join(__dirname, 'settings')
    });
    
//Reading settings
var connection = setty.get('connection');

//Reading nested settings
var connection = setty.get('facebook:token');

```

Profile can be specified in config file (.config by default) or via environment variable SETTY_PROFILE (name can be changed).


Example settings folder structure:

```
settings
 andrew
  config.json
 production
  config.json
 tests
  client
   config.json
  server
   config.json
 config.json
 .config
 .config-test

```

## Running tests

```
npm test
```
