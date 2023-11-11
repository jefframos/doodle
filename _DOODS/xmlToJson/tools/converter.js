const fs = require('fs');
const xml2js = require('xml2js');

const outputFolder = 'output/'



function convertAndExportAllSource() {
    const filesInTheFolder = getFiles('source/')

    let allString = '';
    let totalData = filesInTheFolder.length;
    let count = 151
    let allDataExport = {
        pokedex: []
    }
    filesInTheFolder.forEach(element => {
        convertToJson(element, (jsonString, jsonTrimString) => {
            if (count >= 0) {
            }
            allDataExport.pokedex.push(JSON.parse(jsonString)["pokedex"]["pokemon"][0])
            allString += jsonTrimString
            totalData--
            count--
            if (totalData <= 0) {
                //console.log(allDataExport.pokedex.length, allDataExport.pokedex[0].attribute.number)
                allDataExport.pokedex.sort((a, b) =>
                    a.attribute.number - b.attribute.number
                )

                //console.log(allDataExport.pokedex.length, allDataExport.pokedex[0].attribute.number)

                saveData(JSON.stringify(allDataExport.pokedex.slice(0, 151), null, 0), outputFolder + 'allData.json')
            }
        })
    });


}
function saveData(string, path) {
    fs.writeFile(path, string, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Saved ' + path);
    });
}
function convertToJson(source, completeCallback) {
    fs.readFile(source, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        // Convert XML to JSON
        xml2js.parseString(data, { attrkey: 'attribute', charkey: 'key', trim: true }, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            const filename = removeExtension(getFilename(source)) + '.json'

            const jsonString = JSON.stringify(result, null, 4);
            const jsonTrimString = JSON.stringify(result, null, 0);
            // Export JSON to a file
            fs.writeFile(outputFolder + filename, jsonString, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // console.log('JSON data has been saved to ' + outputFolder + filename);

                completeCallback(jsonString, jsonTrimString);
            });
        });
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

convertAndExportAllSource();