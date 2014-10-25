var fs = require('fs');
var request = require('request');
var unzip = require('unzip');

function get_dotfiles(username, repo){
	repo = repo || "dotfiles";
	var repo_url = 'https://github.com/'+username+'/'+repo;
	var zip_url = repo_url+'/archive/master.zip';
	request(repo_url, function (err, res, body){
		if(!err && res.statusCode != 404){
			request(zip_url)
				.pipe(fs.createWriteStream(username+'_dotfiles.zip'))
				.on('close', function () {
				  	console.log('Zip acquired, captain!');
				});
		}
		else
			console.log("Github doesn't like that...");
	});

}

module.exports = {
	get_dotfiles: get_dotfiles
};
