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
const finalPath = core.getInput('r2-path');
const fileInfo = core.getInput('file-info');


try {
  const files = JSON.parse(fileInfo);
  if (!Array.isArray(files)) core.setFailed('File info must be an array');

  const filesToUpload = await matchingFiles(files);
  console.log(filesToUpload);

} catch(error) {
  core.setFailed(error.message);
}
