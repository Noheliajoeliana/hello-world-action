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

async function uploadFiles(filesToUpload, client){

  const responses = [];

  for await (let {fileName, contentType, finalPath} of filesToUpload) {

    if (!fileName) continue;

    contentType = contentType || mime.lookup(fileName);

    const stream = fs.createReadStream(fileName);
    stream.on('error', (error) => {
      core.error(`Stream: ${fileName} failed with error: ${error.message}`);
      throw error;
    });

    const baseName = path.basename(fileName);
    const finalDestination = parentFolder ? path.join(parentFolder, finalPath || baseName) : baseName;

    const data = {
      Body: stream,
      Key: finalDestination,
      Bucket: bucket,
      ContentType: contentType
    };

    const response = await client.putObject(data);
    responses.push(response);
  }
  return responses;
}

(async function execution(){
  try {
    const files = JSON.parse(fileInfo);
    if (!Array.isArray(files)) return core.setFailed('File info must be an array');

    const client = new S3({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    const filesToUpload = await matchingFiles(files);

    await uploadFiles(filesToUpload, client).then(response => {
      core.info(`Success! ${response}`)
      core.setOutput('data', response);
    });

  } catch(error) {
    core.error(error);
    core.setFailed('FAILING HERE. CHECKING OUTPUT');
  }
})();