var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    rimraf = require('rimraf');

var WORKSPACE_NAME = '.dotfiler',
    TEMP_FOLDER = 'tmp',
    LOCAL_FOLDER = 'local',
    CONFIG_FILE = 'config.json';

function userHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function assertWorkspace(cb) {
    var workspacePath = path.join(userHome(), WORKSPACE_NAME);
    fs.exists(workspacePath, function(exists) {
        if (exists) {
            fs.stat(workspacePath, function(err, stats) {
                if (err) cb(err);
                else if (!stats.isDirectory()) cb('Dotfiler workspace directory is not a directory');
                else {
                    cb();
                }
            });
        } else {
            fs.mkdir(workspacePath, function(err) {
                if (err) cb(err);
                else {
                    fs.writeFile(path.join(workspacePath, CONFIG_FILE), JSON.stringify({}), function(err) {
                        if (err) cb(err);
                        else cb();
                    });
                }
            });
        }
    });
}

function setupTemp(cb) {
    assertWorkspace(function(err) {
        if (err) cb(err);
        else {
            var tmpPath = path.join(userHome(), WORKSPACE_NAME, TEMP_FOLDER);
            if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
            fs.mkdir(tmpPath, function(err) {
                if (err) cb(err);
                else {
                    cb(undefined, tmpPath);
                }
            });
        }
    });
}

function writeConfig(config, cb) {
    assertWorkspace(function(err) {
        if (err) cb(err);
        else {
            var configPath = path.join(userHome(), WORKSPACE_NAME, CONFIG_FILE);
            fs.writeFile(configPath, JSON.stringify(config), function(err) {
                if (err) cb(err);
                else cb();
            });
        }
    });
}

function _moveFile(filename) {
    var from = path.join(userHome(), filename),
        to = path.join(userHome(), WORKSPACE_NAME, LOCAL_FOLDER, filename);

    return function(cb) {
        fs.readFile(from, function(err, data) {
            if (err) cb(err);
            else fs.writeFile(to, data, function(err) {
                if (err) cb(err);
                else fs.unlink(from, cb)
            });
        });
    };
};

function backupLocal(files, cb) {
    var funcs = [];
    for (var i = 0; i < files.length; i++) {
        funcs.push(_moveFile(files[i]));
    }

    assertWorkspace(function(err) {
        if (err) cb(err);
        else {
            var localPath = path.join(userHome(), WORKSPACE_NAME, LOCAL_FOLDER);
            if (!fs.existsSync(localPath)) fs.mkdirSync(localPath);
            async.parallel(funcs, function(err) {
                if (err) cb(err);
                else {
                    cb();
                }
            });
        }
    });
}

module.exports = {
    setupTemp: setupTemp,
    writeConfig: writeConfig,
    backupLocal: backupLocal
};