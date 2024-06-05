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
    if (
      file.endsWith('.js') || 
      file.endsWith('.ts') || 
      file.endsWith('.jsx') || 
      file.endsWith('.tsx') || 
      file.endsWith('.prisma') || 
      file.endsWith('.html') || 
      file.endsWith('.css') || 
      file.endsWith('.scss') || 
      file.endsWith('.json') || 
      file.endsWith('.md') || 
      file.endsWith('.php')
      ) {
      const content = await fs.readFile(file, 'utf-8');

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Write a brief description about the components, functions, and elements, etc in the following file content so we can later use just this descriptions to get the complete idea of what is going on in the file:\n\n${content}`,
        max_tokens: 250,
      });

      descriptions[file] = response.data.choices[0].text.trim();
    }
  }

  //Write descriptions to a file
   const outputPath = path.join(process.cwd(), 'fileDescriptions.json');
  try {
    //Ensure the file exists - creates new file if it doesn't already exist.
    await fs.ensureFile(outputPath);
    //Write JSON content to the file
    await fs.writeJson(outputPath, descriptions, { spaces: 2 });
    console.log('Analysis complete. Descriptions saved in fileDescriptions.json');
  } catch (error) {
    console.error('Error writing descriptions to file:', error);
  }
}

module.exports = { analyze };
