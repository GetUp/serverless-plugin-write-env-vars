'use strict';

var _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    Class = require('class.extend');

module.exports = Class.extend({

   init: function(serverless, opts) {
      this._serverless = serverless;
      this._opts = opts;

      this.hooks = {
         'before:deploy:function:deploy': this.writeEnvironmentFile.bind(this),
         'before:deploy:createDeploymentArtifacts': this.writeEnvironmentFile.bind(this),
      };
   },

   getEnvFilePath: function() {
      return path.join(this._serverless.config.servicePath, '.env');
   },

   writeEnvironmentFile: function() {
      var filePath = this.getEnvFilePath(),
          str;

      str = _.reduce(this._serverless.service.custom.writeEnvVars, function(memo, val, key) {
         return memo + key + '=' + val + '\n';
      }, '');

      return Q.ninvoke(fs, 'writeFile', filePath, str.trim())
         .then(function() {
            this._serverless.cli.log('Wrote .env file to ' + filePath);
         }.bind(this));
   },

});
