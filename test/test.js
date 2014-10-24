var should = require('should'),
    fs = require('fs'),
    path = require('path');

var util = require('../util.js');

var WORKSPACE_NAME = '.dotfiler',
    TEMP_FOLDER = 'tmp',
    LOCAL_FOLDER = 'local',
    CONFIG_FILE = 'config.json';

function userHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

describe('command', function() {
    describe('use', function() {});

    describe('revert', function() {});

    describe('status', function() {});
});

describe('util', function() {
    describe('setupTemp', function() {
        it('should create the workspace directory', function(done) {
            fs.rmdir(path.join(userHome(), WORKSPACE_NAME), function() {
                util.setupTemp(function(err) {
                    if (err) done(err);
                    else {
                        fs.exists(path.join(userHome(), WORKSPACE_NAME), function(exists) {
                            should(exists).be.true;
                            done();
                        });
                    }
                });
            });
        });

        it('should create the temp directory', function(done) {
            fs.rmdir(path.join(userHome(), WORKSPACE_NAME), function() {
                util.setupTemp(function(err) {
                    if (err) done(err);
                    else {
                        fs.exists(path.join(userHome(), WORKSPACE_NAME, TEMP_FOLDER), function(exists) {
                            should(exists).be.true;
                            done();
                        });
                    }
                });
            });
        });
    });

    describe('writeConfig', function() {
        var config = {
            a: 1,
            b: 2,
            c: 3
        };

        it('should create the workspace directory', function(done) {
            fs.rmdir(path.join(userHome(), WORKSPACE_NAME), function() {
                util.writeConfig(config, function(err) {
                    if (err) done(err);
                    else {
                        fs.exists(path.join(userHome(), WORKSPACE_NAME), function(exists) {
                            should(exists).be.true;
                            done();
                        });
                    }
                });
            });
        });

        it('should write the config file', function(done) {
            fs.rmdir(path.join(userHome(), WORKSPACE_NAME), function() {
                util.writeConfig(config, function(err) {
                    if (err) done(err);
                    else {
                        fs.readFile(path.join(userHome(), WORKSPACE_NAME, CONFIG_FILE), {
                            encoding: 'utf8'
                        }, function(err, data) {
                            if (err) done(err);
                            else {
                                data.should.equal(JSON.stringify(config));
                                done();
                            }
                        });
                    }
                });
            });
        });
    });
});