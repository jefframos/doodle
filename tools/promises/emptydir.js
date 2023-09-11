// emptydir.js
const fs = require('fs-extra');

const emptyDir = (mPath) => new Promise((resolve, reject) => {
	fs.emptyDir(mPath, (err) => {
		if(err) {
			reject(err);
		} else {
			// console.log(`Empty dir : ${mPath}`.yellow);
			// resolve(mPath);
			resolve();
		}
	});
});


module.exports = emptyDir;