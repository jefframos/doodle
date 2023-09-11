const fs = require('fs-extra');
const path = require('path');
const colors = require('./utils/colors');
const checkExtension = require('./utils/checkExtension')
const isDirectory = require('./utils/isDirectory')
const paths = require('./paths');
const getSettings = require('./image/get-settings');
const imgRootPath = path.resolve(paths.source.image);
const tinify = require('tinify');
const readdir = require('./promises/readdir');

tinify.key = 'NRky76G9KCK0MbZyUUJE5f2U5k2jXYwh';


let folderToTiny = [];
let filesToExclude = [];
let filesToTiny = [];


const checkDir = (mPath, mCb) => {
  // console.log(`Checking dir : ${mPath}`.blue);
  readdir(mPath)
  .then((files)=> {
    const dirs = files.filter( f => {
      return isDirectory(path.resolve(mPath, f));
    });

    let count = dirs.length;
    if(count == 0) {
      if(mCb) {
        mCb();
      }
      return;
    }

    const cb = () => {
      count --;


      if(count == 0) {
        // console.log(`All done : ${mPath}`.green);
        if(mCb) {
          mCb();  
        }
      }
    }

    dirs.forEach( dirName => {
      const settings = getSettings(dirName);
      if(settings.noTinypng) {
        cb();
        return;
      }

      if(settings.texturePack) {
        if(!settings.noTinypng) {
          folderToTiny.push(path.resolve(mPath, dirName));
        }

        cb();
        return;
      }

      const _path = path.resolve(mPath, dirName);
      folderToTiny.push(_path);
      checkDir(_path, cb);
    });
    
  })
  .catch(err => {
    console.log('error reading path:', mPath);
    console.log(`Error:${err}`.red);
  });

}


const getAllFilesToTiny = () => {

  const folders = folderToTiny.map( f => {
    f = f.replace(/{.*}/g, '');
    const relativePath = path.relative(paths.source.path, f);
    f = path.resolve(paths.destination.path, relativePath);

    return f;
  });


  let count = folders.length;
  folders.forEach( folderPath => {
    readdir(folderPath)
    .then((files)=> {
      let imgs = files.filter( f => {
        return !isDirectory(path.resolve(folderPath, f));
      });

      imgs = imgs.map(f => {
        return path.resolve(folderPath, f);
      });

      filesToTiny = filesToTiny.concat(imgs);

      count--;
      if(count == 0) {
        tiny();
      }
    })
  });
}


checkDir(imgRootPath, getAllFilesToTiny);

const tiny = () => {
  var i = filesToTiny.length;
  filesToTiny = filesToTiny.filter((item)=>{
    let passExtension = item.indexOf('.png') > 0 || item.indexOf('.jpg') > 0;
    return filesToExclude.indexOf(item) === -1 && passExtension && item.indexOf('.DS_Store') === -1;
  });
  console.log(`${filesToTiny.length} images to optimize`);

  for (var i = 0; i < filesToTiny.length; i++) {
    const _path = path.relative(paths.destination.path, filesToTiny[i]);
    console.log(`Tiny png : ${_path}`.green);
    tinify.fromFile(filesToTiny[i]).toFile(filesToTiny[i]);
  }
}