const sharp = require('sharp');
const fs = require('fs');

// Output directory for the split images
const outputDirectory = 'output/';

// Number of rows and columns to split the image
const numRows = 4;
const numCols = 4;



function convertAndExportAllSource() {
    const filesInTheFolder = getFiles('source/')

    let max = 151

    filesInTheFolder.forEach(element => {
        if(max > 0 && removeExtension(getFilename(element)).length <= 3){
            doSharp(element);
            max --
        }
    });


}
function doSharp(path) {
    sharp(path)
        .metadata()
        .then((metadata) => {
            const imageWidth = metadata.width;
            const imageHeight = metadata.height;

            const cellWidth = Math.floor(imageWidth / numCols);
            const cellHeight = Math.floor(imageHeight / numRows);

            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    const x = col * cellWidth;
                    const y = row * cellHeight;
                    const name = removeExtension(getFilename(path));
                    sharp(path)
                        .extract({ left: x, top: y, width: cellWidth, height: cellHeight })
                        .toFile(`${outputDirectory}${name}_${row}_${col}.png`, (err) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`Split image ${row}_${col} saved successfully.`);
                            }
                        });
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
}


function removeExtension(file) {
    return file.replace(/\.[^/.]+$/, "")
}
function getFilename(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
}
function getFiles(dir, files = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir)
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`
        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFiles(name, files)
        } else {
            // If it is a file, push the full path to the files array
            files.push(name)
        }
    }
    return files
}

convertAndExportAllSource()