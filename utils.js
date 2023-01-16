const { exec } = require( 'child_process');
const path = require('path');

function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, output, stderr) => {
      if (error || stderr) return reject(error || stderr);
      resolve(output);
    });
  });
}

/**
 * Find all files matching pattern within a specific folder or in root
 * @param pattern {String} - Pattern to match
 * @param path {String} - Folder inside repo to find matches
 * @param contentType {String} - Global content type of all folder matching
 * @returns {Promise<{fileName: *, contentType: *}[]>}
 */
async function pattern(pattern, path, contentType){
  const files = await execute(`find ${path || ''} -name "${pattern}" `);
  return files.split('\n').map( fileName => ({ fileName, contentType }));
}

/**
 * Fin all matching files with or without patterns and organizes into an array with info
 * @param files {Array} - Input for GitHub Action call
 * @returns {Promise<unknown>}
 */
async function matchingFiles(files = []){

  const separatedFiles = []
  async function process(index = 0){
    if (files.length <= 0) return separatedFiles;

    const { fileName, contentType = '', sourcePath, finalPath } = files[index];

    if (fileName.includes('*')){
      const matching = await pattern(fileName, sourcePath, contentType);
      separatedFiles.push(...matching);
    } else {
      separatedFiles.push({ fileName: path.join(sourcePath || '', fileName), contentType, finalPath });
    }
    return (index < files.length - 1) && process(index + 1);
  }

  return new Promise(async (resolve, reject) => {
    try {
      await process();
      resolve(separatedFiles);
    } catch(error) {
      reject(error);
    }

  });

}

module.exports = {
  matchingFiles
}