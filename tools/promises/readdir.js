// readdir.js

const fs = require('fs-extra');

const readdir = (mPath) => new Promise((resolve, reject) => {
	fs.readdir(mPath, (err, files) => {
		if(err) {
			reject(err);
		} else {
			files = files.filter((fileName) => {
				return fileName.indexOf('DS_Store') === -1;
			});

			resolve(files);
		}
	});
});


module.exports = readdir;