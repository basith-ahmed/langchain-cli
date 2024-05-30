const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

async function init() {
  console.log('Initializing project...');

  //Assuming the analyze command creates a fileDescriptions.json
  const filePath = path.join(process.cwd(), 'fileDescriptions.json');
  if (await fs.pathExists(filePath)) {
    console.log('Project already initialized.');
  } else {
    await analyze();
  }

  console.log('Project initialized.');
}

module.exports = { init };
