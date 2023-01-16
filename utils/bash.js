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

async function filesMatching(pattern, path){
  const files = await execute(`find ${path} -name ${path} `);
  return files.split('\n');
}

module.exports = {
  filesMatching
}