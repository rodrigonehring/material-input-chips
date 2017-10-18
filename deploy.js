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

const getCurrentBranch = () => new Promise((resolve, reject) => {
  exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
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


const commit = (branch, version) => new Promise((resolve, reject) => {
  exec(`git add . && git commit -m "Auto updating version" && git tag ${version} -f && git push origin ${branch} && git push --tags -f`, (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve();
  });
});


async function deploy() {
  const currentTag = await getCurrentTag();
  const currentBranch = await getCurrentBranch();
  const packageJson = await openPackage();

  console.log('current branch: ', currentBranch);
  console.log('current tag version: ', currentTag);
  console.log('current package.json version: ', packageJson.version);

  if (currentTag !== packageJson.version) {
    console.log('Different versions, updating package.json');
    packageJson.version = currentTag;
    await savePackage(packageJson);
    await commit(currentBranch, currentTag);

    console.log('Success!');
  }
}

deploy();

