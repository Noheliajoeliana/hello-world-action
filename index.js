const path = require('path');
const fs = require('fs');
const core = require('@actions/core');
const { S3 } = require('@aws-sdk/client-s3');
const { matchingFiles } = require('./utils');
const mime = require('mime-types');

const accountId = core.getInput('account-id');
const accessKeyId = core.getInput('access-key-id');
const secretAccessKey = core.getInput('secret-access-key');
const bucket = core.getInput('r2-bucket');
const parentFolder = core.getInput('r2-parent-folder');
const fileInfo = core.getInput('file-info');

(async function execution(){
  try {
    const files = JSON.parse(fileInfo);
    if (!Array.isArray(files)) core.setFailed('File info must be an array');

    const client = new S3({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    const filesToUpload = await matchingFiles(files);

    console.log('ALL FILES', filesToUpload);
    function uploadFiles(){

      const responses = [];
      async function uploadOne(index = 0){
        let { fileName, contentType, finalPath } = filesToUpload[index];
        console.log('INDEX: ', index)

        if (!fileName) return (index < files.length - 1) && uploadOne(index + 1);

        contentType = contentType || mime.lookup(fileName);

        const stream = fs.createReadStream(fileName);
        stream.on('error', (error) => {
          console.log(`Stream: ${fileName} failed with error: ${error.message}`);
        });

        const baseName = path.basename(fileName);
        const finalDestination = parentFolder ? path.join(parentFolder, finalPath || baseName) : baseName;

        const data = {
          Body: stream,
          Key: finalDestination,
          Bucket: bucket,
          ContentType: contentType
        };

        console.log('DATA: ', index, ' .', data);

        // const response = await client.putObject(data);
        // responses.push(response);

        console.log(index, files.length, (index < files.length - 1));

        return (index < files.length - 1) && uploadOne(index + 1);
      }

      return new Promise(async (resolve, reject) => {
        try {
          await(uploadOne());
          resolve(responses);
        } catch(error) {
          reject(error)
        }
      });

    }

    uploadFiles().then(response => {
      console.log('Success! ', response);
      core.setOutput('data', response)
    })

  } catch(error) {
    core.setFailed(error.message);
  }
})();