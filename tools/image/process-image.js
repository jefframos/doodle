// image-test.js

const path = require('path');
const fs = require('fs-extra');
const im = require('imagemagick');

const paths = require('../paths');
const folderNameCheck = require('../utils/folderNameCheck.js');
const isDirectory = require('../utils/isDirectory');
const checkExtension = require('../utils/checkExtension');
const cloneObject = require('../utils/clone-object');
const colors = require('../utils/colors');

const texturepack = require('./texturepack');
const resizeImage = require('./resize-image');
const getFolderSettings = require('./get-folder-settings');
const getOutputFolderName = require('./get-output-name');
const getTexturePackList = require('./get-texturepack-list');

const imgRootPath = path.resolve(paths.source.image);

const lowResScale = 0.5;

let MANIFESTS = {
	default: []
}


const defaultSettings = {
	manifest: false,
	manifestFile: 'default',
	tps: false
}

const getDirContent = function (mPath, mCallback) {
	fs.readdir(mPath, (err, files) => {
		files = files.filter((fileName) => {
			return fileName.indexOf('DS_Store') == -1;
		});

		const dir = files.filter((fileName) => {
			const filePath = path.resolve(mPath, fileName);
			return isDirectory(filePath);
		});

		files = files.filter((fileName) => {
			const filePath = path.resolve(mPath, fileName);
			return !isDirectory(filePath);
		});

		mCallback(err, { files, dir });
	});
}

const convertImage = function (mPath, mDestFolder, mFileName, mCallback) {
	const pathHigh = path.resolve(mDestFolder, mFileName);
	const pathLow = path.resolve(mDestFolder, mFileName.split('.').join('_mip.'));

	console.log('convertImage'.rainbow);

	fs.ensureDir(mDestFolder, (folderPath) => {
		im.identify(mPath, (err, features) => {
			if (err) {
				console.log(err);
			} else {
				let count = 0;


				const onDone = () => {
					count++;

					if (count == 2 && mCallback) {
						mCallback();
					}
				}

				resizeImage(mPath, pathHigh, features.width, onDone);
				resizeImage(mPath, pathLow, features.width * lowResScale, onDone);
			}
		});
	});
}

const processFolder = function (mPath, mSettings, mCallback) {



	getDirContent(mPath, (err, sources) => {
		//	get folder settings
		const settings = getFolderSettings(mPath, imgRootPath);

		if (settings.manifest) {
			settings.manifestFile = settings.outputFolderName;
			MANIFESTS[settings.outputFolderName] = [];
		}
		settings.multipack = true;
		if (settings.tps === undefined) {
			settings.tps = mSettings.tps;
		}
		if (settings.manifest === undefined) {
			settings.manifest = mSettings.manifest;
			settings.manifestFile = mSettings.manifestFile;
		}

		let outputPath = path.resolve(paths.destination.image);

		let bracketsIndex = settings.outputFolderName.indexOf('{')
		let bracketsEnd = settings.outputFolderName.indexOf('}')

		if (bracketsIndex >= 0) {
			settings.outputFolderName = settings.outputFolderName.replace(settings.outputFolderName.substring(bracketsIndex, bracketsEnd + 1), "");
		}


		bracketsIndex = settings.relativePath.indexOf('{')
		bracketsEnd = settings.relativePath.indexOf('}')

		if (bracketsIndex >= 0) {
			settings.relativePath = settings.relativePath.replace(settings.relativePath.substring(bracketsIndex, bracketsEnd + 1), "");
		}

		outputPath = path.resolve(outputPath, settings.relativePath);

		const { files, dir } = sources;

		if (settings.tps) {
			console.log(`Generate texture pack : ${settings.path}`.grey);


			let scale = 1;

			let scalePosition = settings.outputFolderName.indexOf('_s')
			if (scalePosition >= 0) {
				console.log(settings.outputFolderName.red)
				console.log(settings.outputFolderName[scalePosition + 2].red)

				scale = 0.5//settings.outputFolderName[scalePosition + 2]
			}
			texturepack(settings.path, settings.outputFolderName, outputPath, () => {

				getTexturePackList(outputPath, (mList) => {
					mList.full.forEach((fileName) => {
						MANIFESTS[settings.manifestFile].push('image/' + settings.relativePath + '/' + fileName);
					});

					if (settings.outputFolderName.indexOf('{n}') >= 0) {
						let tempFile = settings.outputFolderName.replace('{n}', '');
						for (let index = 0; index < 20; index++) {
							let file = 'image/' + tempFile + index + '/' + tempFile + index + '.json'


							const element = file;
							let s = element.replace('image/', '/')

							if (fs.existsSync(path.resolve(paths.destination.image) + s)) {
								MANIFESTS[settings.manifestFile].push(file);
							} else {
								break
							}

						}
					}

					mCallback();

				});

			}, scale);

		} else {
			// 	loop through sub folders
			let finishCount = dir.length + files.length;

			const onDone = function () {
				finishCount--;
				if (finishCount == 0) {
					mCallback();
				}
			}

			dir.forEach((mFolderName) => {
				const subPath = path.resolve(mPath, mFolderName);
				processFolder(subPath, settings, onDone);
			});

			files.forEach((fileName) => {
				if (checkExtension(fileName, ['png', 'jpg', 'gif'])) {
					const filePath = path.resolve(settings.path, fileName);
					const _outputPath = path.resolve(outputPath, fileName);
					console.log('convertImage');
					convertImage(filePath, outputPath, fileName, onDone);

					MANIFESTS[settings.manifestFile].push('image/' + settings.relativePath + '/' + fileName);
				} else {
					onDone();
				}

			});
		}

	});

}

module.exports = function (mCallback) {
	const _output = path.resolve(paths.destination.image);

	fs.emptyDir(_output, (err) => {
		folderNameCheck(imgRootPath, (mHasDupe) => {

			if (!mHasDupe) {
				MANIFESTS = {
					default: []
				}

				console.log(MANIFESTS);
				// return;
				const settings = cloneObject(defaultSettings);
				processFolder(imgRootPath, settings, () => {

					const json = JSON.stringify(MANIFESTS, null, 4);
					const outputJsonPath = path.resolve(paths.manifest, 'manifest.json');

					fs.writeFile(outputJsonPath, json, 'utf8', () => {
						console.log('Manifest json file created --' + outputJsonPath);

						if (mCallback) {
							mCallback();
						}
					});
				});
			} else {
				console.log('Has dupe Folder names !');
			}

		});
	});

}
