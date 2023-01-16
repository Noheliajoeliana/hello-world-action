const fs = require('fs');
const core = require('@actions/core');
const { S3 } = require('@aws-sdk/client-s3');
const { filesMatching } = require('./utils/bash');

const ACCOUNT_ID = core.getInput('account-id');
const ACCESS_KEY_ID = core.getInput('access-key-id');
const SECRET_ACCESS_KEY = core.getInput('secret-access-key');
const BUCKET = core.getInput('r2-bucket');
const FINAL_PATH = core.getInput('r2-path');
const FILEINFO = core.getInput('fileinfo');

// if (!Array.isArray(FILEINFO)) core.setFailed('File info must be an array');

try {
  const client = new S3({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
    }
  });

  console.log(FILEINFO);
  console.log(Array.isArray(FILEINFO));
  // const file = fs.createReadStream(FILENAME);
  // file.on('error', (error) => {
  //   core.setFailed(error.message);
  // });
  //
  // const destination = FINAL_PATH || FILENAME;
  // const data = {
  //   Body: file,
  //   Key: destination,
  //   Bucket: BUCKET,
  // };
  // if (CONTENT_TYPE) data.ContentType = CONTENT_TYPE;
  //
  // client.putObject(data).then(response => {
  //   console.log('Success! ', response);
  //   core.setOutput('data', response)
  // });
} catch(error) {
  core.setFailed(error.message);
}
