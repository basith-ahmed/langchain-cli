const fs = require('fs-extra');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

//Setup OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function fix() {
  console.log('Scanning and fixing project files...');

  //Get all files in the current directory and subdirectories
  async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
  }

  const files = await getFiles(process.cwd());

  //Scan and fix each file
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
      const fileContent = await fs.readFile(file, 'utf-8');

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `You are a coding assistant. The user wants to scan the following file for errors and fix them:\n\n${fileContent}\n\nPlease provide the fixed version of the file content.`,
        max_tokens: 500,
      });

      const fixedContent = response.data.choices[0].text.trim();

      try {
        await fs.writeFile(file, fixedContent, 'utf-8');
        console.log(`Fixed errors in file: ${file}`);
      } catch (error) {
        console.error(`Error writing file: ${error.message}`);
      }
    }
  }

  console.log('All files scanned and fixed where necessary.');
}

module.exports = { fix };
