var fs = require('fs');
var request = require('request');
var unzip = require('unzip');
var path = require('path');
var workspace = require('./workspace.js');

function getZip(username, repo, cb) {
	repo = repo || 'dotfiles';
	var repoUrl = 'https://github.com/' + username + '/' + repo;
	var zipUrl = repoUrl + '/archive/master.zip';
	request(repoUrl, function(err, res, body) {
		if (err) {
			cb('There was a problem contacting the server; Check your netowrk connection.');
		} else if (res.statusCode === 404) {
			cb('The dotfiles repository "' + username + '/' + repo + '" does not exist.');
		} else {
			workspace.setupTemp(function(err, tmpPath) {
				if (err) cb(err);
				else {
					request(zipUrl).pipe(fs.createWriteStream(path.join(tmpPath, username + '_dotfiles.zip')))
						.on('close', function() {
							cb(undefined, path.join(tmpPath, username + '_dotfiles.zip'));
						});
				}
			});
		}
	});
}

function unpackZip(filepath, cb) {
	var dirpath = filepath.substring(0, filepath.length - 4);
	fs.mkdir(dirpath, function(err) {
		if (err) cb(err);
		else {
			fs.createReadStream(filepath).pipe(unzip.Extract({
				path: dirpath
			})).on('close', function() {
				cb();
			});
		}
	});
}

module.exports = {
	getZip: getZip,
	unpackZip: unpackZip
};