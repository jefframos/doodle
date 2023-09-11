// copydir.js

const fs = require('fs-extra');

const copydir = (mSource, mDest) => new Promise((resolve, reject) => {
	fs.copy(mSource, mDest, (err) => {
		if(err) {
			reject(err);
		} else {
			resolve();
		}
	});
});

module.exports = copydir;