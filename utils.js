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

async function pattern(pattern){
  const files = await execute(`find -name ${pattern} `);
  console.log('files matching', files);
  return files.split('\n').map( fileName => ({ fileName }));
}

async function matchingFiles(files = []){

  const separatedFiles = []
  async function process(index = 0){
    if (files.length <= 0) return separatedFiles;

    const { fileName, contentType } = files[index];
    console.log('In action', fileName, fileName.includes('*'))
    if (fileName.includes('*')){
      const matching = await pattern(fileName);
      const final = contentType ? matching.map(file => Object.assign(file, { contentType })) : matching;
      separatedFiles.push(...final);
    } else {
      separatedFiles.push({ fileName, contentType });
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