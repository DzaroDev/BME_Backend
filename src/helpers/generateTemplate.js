const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const generateTemplate = (pathToTemplate, compileVariables) => {
  if (!pathToTemplate || !compileVariables) return '';
  const filePath = path.join(__dirname, pathToTemplate);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  return template(compileVariables);
}

module.exports = generateTemplate;
