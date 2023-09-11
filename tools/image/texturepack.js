// texturepack.js
const fs = require('fs-extra');
const path = require('path');
const execFile = require('child_process').execFile;
const colors = require('../utils/colors');
const lowResScale = 0.75;

const texturepack = function (mFolderPath, mId, mDestPath, mCb, scale = 1) {
	const tpsId = mId;
	const srcPath = mFolderPath;
	const outpath = mDestPath;
	const name = outpath + '/' + tpsId + '{v}';
	console.log('texturepack'.rainbow, scale);
	const variant = ['1:'];//, `${lowResScale}:_mip::2048:2048`];
	// const variant = [`${lowResScale}:1::2048:2048`];
	const opts = [
		'--data', name + '.json',
		'--format', 'pixijs',
		'--sheet', name + '.png',
		mFolderPath,
		'--multipack',
		'--scale', scale > 1 ? 1 / scale : 1,
		'--scale-mode', 'Smooth',
		'--padding', 4,

	];
	variant.forEach((v) => {
		//opts.push('--variant', v);
	});

	fs.readdir(mFolderPath, (err, files) => {
		files = files.filter((f) => {
			return f.indexOf('DS_Store') === -1;
		});

		if (files.length == 0) {
			mCb();
			return;
		}

		fs.ensureDir(path.resolve(mDestPath), () => {
			execFile('TexturePacker', opts, function (error, stdout, stderr) {
				if (error) {
					{
						console.log(error, stdout, stderr)
						throw error;
					}
				} else {
					console.log(`${tpsId} texture packing complete`.green);
					if (mCb) {
						mCb();
					}
				}
			});
		});
	});
}


module.exports = texturepack;