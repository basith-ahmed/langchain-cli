const fs = require('fs-extra');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

//Setup OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function add(featureDescription) {
  console.log(`Adding feature: ${featureDescription}`);

  //Load the file descriptions
  const descriptionsPath = path.join(process.cwd(), 'file_descriptions.json');
  let descriptions;
  try {
    descriptions = await fs.readJson(descriptionsPath);
  } catch (error) {
    console.error(`Error reading file descriptions: ${error.message}`);
    return;
  }

  //Find the most relevant file
  let mostRelevantFile = '';
  let highestRelevanceScore = 0;

  for (const [file, description] of Object.entries(descriptions)) {
    const relevanceScore = await getRelevanceScore(description, featureDescription);
    if (relevanceScore > highestRelevanceScore) {
      highestRelevanceScore = relevanceScore;
      mostRelevantFile = file;
    }
  }

  if (!mostRelevantFile) {
    console.error('No relevant file found.');
    return;
  }

  console.log(`Most relevant file found: ${mostRelevantFile}`);

  //Read the content of the most relevant file
  let fileContent;
  try {
    fileContent = await fs.readFile(mostRelevantFile, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return;
  }

  //Generate the code for the new feature using OpenAI
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `You are an expert in React and JavaScript. The user wants to add the following feature to the file:\n\n${fileContent}\n\nFeature: ${featureDescription}\n\nGenerate the necessary code for this feature and return the entire updated file with necessary changes.`,
    max_tokens: 150,
  });

  const generatedCode = response.data.choices[0].text.trim();

  //Insert the generated code into the most relevant file
  const updatedContent = insertGeneratedCode(fileContent, generatedCode);

  //Write the updated content back to the file
  try {
    await fs.writeFile(mostRelevantFile, updatedContent, 'utf-8');
    console.log('Feature added successfully.');
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
  }
}

//Function to calculate relevance score based on description and feature description
async function getRelevanceScore(description, featureDescription) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `On a scale of 1 to 10, how relevant is the following file description to the feature description?\n\nFile Description: ${description}\n\nFeature Description: ${featureDescription}`,
    max_tokens: 1,
  });

  return parseInt(response.data.choices[0].text.trim(), 10);
}

//Function to insert the generated code into the file content
function insertGeneratedCode(fileContent, generatedCode) {
  //Simple implementation: append the generated code at the end
  return `${fileContent}\n\n// Added by LangChain CLI\n${generatedCode}`;
}

module.exports = { add };
