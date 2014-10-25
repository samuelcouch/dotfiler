var fs = require('fs');
var request = require('request');
var unzip = require('unzip');
var path = require('path');
var utils = require('./util.js');

function getDotfiles(username, repo){
	repo = repo || "dotfiles";
	var repo_url = 'https://github.com/'+username+'/'+repo;
	var zip_url = repo_url+'/archive/master.zip';
	request(repo_url, function (err, res, body){
		if(!err && res.statusCode != 404){
			utils.setupTemp(function(err, tmpPath){
			    if(!err){
			    	request(zip_url)
			    	.pipe(fs.createWriteStream(path.join(tmpPath, username+'_dotfiles.zip')))
			    	.on('close', function(){
			    		console.log('Zip acquires, captain!');
			    	});
			    }
			});
		}
		else
			console.log("Github doesn't like that...");
	});

}

module.exports = {
	getDotfiles: getDotfiles
};