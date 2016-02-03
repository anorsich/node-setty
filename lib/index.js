var _ = require('underscore');
var nconf = require('nconf');
var util = require('util');
var path = require('path');
var fs = require('fs');

var setty = new Setty();
exports = module.exports = setty;

function Setty(){
  this.config = null;
}

Setty.prototype.configure = function(cfg){
  _.defaults(cfg, {
    profile: '.config',
    //Setty will check this environment variable before failing if profile file is not found
    profileEnv: 'SETTY_PROFILE',
    configFileName: 'config.json',
    settingsDir: null,
    globalSettingsDir: null
  });
  this.config = cfg;

  if (!fs.existsSync(cfg.settingsDir)) {
    throw new Error('Make sure that settings directory exists.');
  }

  if (cfg.globalSettingsDir) {
    if (!fs.existsSync(cfg.globalSettingsDir)) {
      throw new Error('Global settings directory does not exist.');
    }
  }

  cfg.rootConfigPath = path.join(cfg.settingsDir, cfg.configFileName);
  cfg.profileFilePath = path.join(cfg.settingsDir, cfg.profile);

  if (!fs.existsSync(cfg.rootConfigPath)) {
    throw new Error(['Make sure that root config "', cfg.configFileName, '" exists in the following dir: ', cfg.settingsDir].join(''));
  }

  var envProfilePath = process.env[cfg.profileEnv];

  if (!fs.existsSync(cfg.profileFilePath) && !envProfilePath) {
    throw new Error(['Make sure that profile file "', cfg.profile, '" exists in the following dir: ', cfg.settingsDir + ' or specified in the environment variable: ' + cfg.profileEnv].join(''));
  }

  cfg.profilePath = envProfilePath || fs.readFileSync(cfg.profileFilePath, 'utf8').trim();
  cfg.userConfigPath =  path.join(cfg.settingsDir, cfg.profilePath, cfg.configFileName);

  if (!fs.existsSync(cfg.userConfigPath)) {
    var err = util.format('User config file does not exists at "%s". ' +
      'Make sure that profile file "%s" point to the user config. ', cfg.userConfigPath, cfg.profile);

    throw new Error(err);
  }

  if (cfg.globalSettingsDir){
    cfg.globalConfigPath = path.join(cfg.globalSettingsDir, cfg.profilePath, cfg.configFileName);

    if (!fs.existsSync(cfg.globalConfigPath)) {
       var err = util.format('Global user config file does not exists at "%s". ' +
      'Make sure that profile file "%s" point to the user config. ', cfg.globalConfigPath, cfg.profile);

      throw new Error(err);
    }
  }
  
  nconf.clear();
};

Setty.prototype.load = function(cfg){
  this.configure(cfg);

  //Load environment variables
  //https://github.com/flatiron/nconf#env
  nconf.env();
  if (this.config.globalConfigPath) {
    nconf.file('global', this.config.globalConfigPath);
  }
  nconf.file('default', this.config.rootConfigPath);
  nconf.file('user', this.config.userConfigPath);
};

Setty.prototype.get = function(name){
  return nconf.get(name);
};

