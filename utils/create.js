var fs = require('fs');
var request = require('request');
var unzip = require('unzip');

function get_dotfiles(username, repo){
	repo = repo || "dotfiles";
	var zip_url = 'https://github.com/'+username+'/'+repo+'/archive/master.zip';
	request(zip_url)
	  .pipe(fs.createWriteStream(username+'_dotfiles.zip'))
	  .on('close', function () {
	  		console.log('Zip acquired! Time to unpack!');
	});
}

