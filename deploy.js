const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');



const getCurrentTag = () => new Promise((resolve, reject) => {
  exec('git describe --abbrev=0 --tags', (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve(stdout.replace('\n', ''));
  });
});

const openPackage = () => new Promise((resolve, reject) => {
  fs.readFile('./package.json', 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(JSON.parse(data));
  });
});

const savePackage = (content) => new Promise((resolve, reject) => {
  fs.writeFile('./package.json', JSON.stringify(content, null, 2), (err) => {
    if (err) {
      return reject(err);
    }

    resolve();
  });
});


const commit = (version) => new Promise((resolve, reject) => {
  exec(`git add . && git commit -m "Auto updating version" && git tag ${version} -f && git push && git push --tags`, (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve();
  });
});


async function deploy() {
  const currentTag = await getCurrentTag();
  const packageJson = await openPackage();

  console.log('currrent tag version: ', currentTag);
  console.log('currrent package.json version: ', packageJson.version);

  if (currentTag !== packageJson.version) {
    console.log('Different versions, updating package.json');
    packageJson.version = currentTag;
    await savePackage(packageJson);
    await commit(currentTag);

    console.log('Success!');
  }
}

deploy();

