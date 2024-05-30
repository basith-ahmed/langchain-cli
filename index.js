#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const { init } = require('./commands/init');
const { analyze } = require('./commands/analyze');
const { add } = require('./commands/add');
const { fix } = require('./commands/fix');

program
  .version('0.1.0')
  .description('AI Coding Assistant CLI');

program
  .command('init')
  .description('Initialize the project')
  .action(init);

program
  .command('analyze')
  .description('Analyze the project files')
  .action(analyze);

program
  .command('add <featureDescription>')
  .description('Add a new feature to the project')
  .action(add);

program
  .command('fix')
  .description('Fix errors in the project files')
  .action(fix);

program.parse(process.argv);
