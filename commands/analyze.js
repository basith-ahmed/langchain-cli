const fs = require('fs-extra');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

//Setup OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function analyze() {
  console.log('Analyzing project files...');
  const descriptions = {};

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

  //Describe each file
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
      const content = await fs.readFile(file, 'utf-8');

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Describe the components, functions, and elements in the following file content:\n\n${content}`,
        max_tokens: 150,
      });

      descriptions[file] = response.data.choices[0].text.trim();
    }
  }

  //Write descriptions to a file
  const outputPath = path.join(process.cwd(), 'fileDescriptions.json');
  await fs.writeJson(outputPath, descriptions, { spaces: 2 });

  console.log('Analysis complete. Descriptions saved in fileDescriptions.json');
}

module.exports = { analyze };
