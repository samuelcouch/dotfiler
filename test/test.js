var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf');

var workspaceUtil = require('../utils/workspace.js'),
    createUtil = require('../utils/create.js');

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
    describe('workspace', function() {
        describe('setupTemp', function() {
            it('should create the workspace directory', function(done) {
                rimraf(path.join(userHome(), WORKSPACE_NAME), function() {
                    workspaceUtil.setupTemp(function(err) {
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
                rimraf(path.join(userHome(), WORKSPACE_NAME), function() {
                    workspaceUtil.setupTemp(function(err) {
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
                rimraf(path.join(userHome(), WORKSPACE_NAME), function() {
                    workspaceUtil.writeConfig(config, function(err) {
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
                rimraf(path.join(userHome(), WORKSPACE_NAME), function() {
                    workspaceUtil.writeConfig(config, function(err) {
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

        describe('backupLocal', function() {
            it('should move the dotfiles', function(done) {
                fs.writeFileSync(path.join(userHome(), 'dotfilertestfile1'), '1');
                fs.writeFileSync(path.join(userHome(), 'dotfilertestfile2'), '2');
                fs.writeFileSync(path.join(userHome(), 'dotfilertestfile3'), '3');

                workspaceUtil.backupLocal(['dotfilertestfile1', 'dotfilertestfile2', 'dotfilertestfile3'], function(err) {
                    if (err) done(err);
                    else {
                        var opts = {
                            encoding: 'utf8'
                        };

                        fs.readFileSync(path.join(userHome(), WORKSPACE_NAME, LOCAL_FOLDER, 'dotfilertestfile1'), opts).should.equal('1');
                        fs.readFileSync(path.join(userHome(), WORKSPACE_NAME, LOCAL_FOLDER, 'dotfilertestfile2'), opts).should.equal('2');
                        fs.readFileSync(path.join(userHome(), WORKSPACE_NAME, LOCAL_FOLDER, 'dotfilertestfile3'), opts).should.equal('3');
                        done();
                    }
                });
            });
        });

        describe('restoreLocal', function() {
            it('should move the dotfiles', function(done) {

                workspaceUtil.restoreLocal(['dotfilertestfile1', 'dotfilertestfile2', 'dotfilertestfile3'], function(err) {
                    if (err) done(err);
                    else {
                        var opts = {
                            encoding: 'utf8'
                        };

                        fs.readFileSync(path.join(userHome(), 'dotfilertestfile1'), opts).should.equal('1');
                        fs.readFileSync(path.join(userHome(), 'dotfilertestfile2'), opts).should.equal('2');
                        fs.readFileSync(path.join(userHome(), 'dotfilertestfile3'), opts).should.equal('3');
                        done();
                    }
                });
            });
        });
    });

    describe('create', function() {
        describe('getZip', function() {
            it('should download repo zip', function(done) {
                this.timeout(1000);
                createUtil.getZip('skeswa', 'dotfiles', function(err, zipPath) {
                    if (err) done(err);
                    else {
                        should(zipPath).equal(path.join(userHome(), WORKSPACE_NAME, TEMP_FOLDER, 'skeswa_dotfiles.zip'));
                        fs.existsSync(zipPath).should.be.true;
                        done();
                    }
                });
            });
        });

        describe('unpackZip', function() {
            it('should decompress repo zip', function(done) {
                this.timeout(1000);
                createUtil.getZip('skeswa', 'dotfiles', function(err, zipPath) {
                    if (err) done(err);
                    else {
                        createUtil.unpackZip(zipPath, function(err) {
                            if (err) done(err);
                            fs.existsSync(zipPath.substring(0, zipPath.length - 4)).should.be.true;
                            done();
                        });
                    }
                });
            });
        });
    });

    after(function() {
        rimraf.sync(path.join(userHome(), WORKSPACE_NAME));
        fs.unlinkSync(path.join(userHome(), 'dotfilertestfile1'));
        fs.unlinkSync(path.join(userHome(), 'dotfilertestfile2'));
        fs.unlinkSync(path.join(userHome(), 'dotfilertestfile3'));
    });
});