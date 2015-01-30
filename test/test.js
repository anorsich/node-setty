var assert = require('assert');
var setty = require('../lib/index');
var path = require('path');

describe('Setty', function() {
  it('should load and merge user and default settings', function(){

    setty.load({
      profile: '.config',
      configFileName: 'config.json',
      settingsDir: path.join(__dirname, 'settings')
    });

    assert.equal(setty.get('connection'), "Andrew's connection");
  });

  it('throw an error if settingsDir is not specified or does not exists', function(){
    assert.throws(setty.load);
  });

  it('throw an error if profile does not exists', function(){
    assert.throws(setty.load.bind(null, {profile: '.not-exists'}));
  });

  it('throw an error if root config file does not exists', function(){
    assert.throws(setty.load.bind(null, {configFileName: 'not-exists.json'}));
  });
});