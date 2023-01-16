const core = require('@actions/core');
const { matchingFiles } = require('./utils');

const fileInfo = core.getInput('file-info');


try {
  const files = JSON.parse(fileInfo);
  if (!Array.isArray(files)) core.setFailed('File info must be an array');

  const filesToUpload = await matchingFiles(files);
  console.log(filesToUpload);

} catch(error) {
  core.setFailed(error.message);
}
