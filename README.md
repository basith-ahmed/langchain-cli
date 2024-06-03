> [!WARNING]  
> This product is currently under development and is publicly accessible for open-source purposes only. Please exercise caution and run it locally only if you are familiar with OpenAI APIs and JS.

# LangChain CLI

LangChain CLI is a command-line tool that helps software developers analyze, enhance, and fix their code using artificial intelligence. This tool leverages the OpenAI API to provide intelligent suggestions and solutions for various programming tasks.

## Table of Contents

- [Installation](#installation)
- [Initialization](#initialization)
- [Analyzing Project Files](#analyzing-project-files)
- [Adding a New Feature](#adding-a-new-feature)
- [Fixing Errors](#fixing-errors)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and use the LangChain CLI locally, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/basith-ahmed/langchain-cli.git
   ```

2. Navigate to the project directory:

   ```bash
   cd langchain-cli
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up your OpenAI API key as an environment variable:

   ```.env
   OPENAI_API_KEY='YOUR-OPENAI-API-KEY'
   ```

## Initialization

Before using the LangChain CLI, you need to initialize the project:

```bash
npm run langchain-cli init
```

This command analyzes all files in the repository and creates descriptions for each file. The file descriptions are stored in `fileDescriptions.json` for later use.

## Analyzing Project Files

To analyze the project files and update the file descriptions, run:

```bash
npm run langchain-cli analyze
```

This command scans all files in the repository, extracts relevant information, and updates the `fileDescriptions.json` file.

## Adding a New Feature

To add a new feature to your project, use the following command:

```bash
npm run langchain-cli add 'description of the feature'
```

This command analyzes the feature description, identifies the most relevant file in the project, generates the code for the new feature, and inserts it into the identified file.

## Fixing Errors

To scan and fix errors in project files, run:

```bash
npm run langchain-cli fix
```

This command iterates through all files in the repository, identifies errors, and attempts to fix them using AI-powered suggestions.

| Action                   | Command                                   | Description                             |
|--------------------------|-------------------------------------------|-----------------------------------------|
| Initialization           | `npm run langchain-cli init`       | Analyzes and describes project files.  |
| Analyzing Project Files  | `npm run langchain-cli analyze`    | Updates file descriptions.             |
| Adding a New Feature     | `npm run langchain-cli add 'description of the feature'` | Adds a new feature to the project. |
| Fixing Errors            | `npm run langchain-cli fix`        | Fixes errors in project files.         |

## Usage Examples

- **Initializing the Project:**
  
  ```bash
  npm run langchain-cli init
  ```

- **Analyzing Project Files:**
  
  ```bash
  npm run langchain-cli analyze
  ```

- **Adding a New Feature:**
  
  ```bash
  npm run langchain-cli add 'add a green button to the nav bar'
  ```

- **Fixing Errors:**
  
  ```bash
  npm run langchain-cli fix
  ```

## Contributing

Contributions to the LangChain CLI are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Your message here"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
