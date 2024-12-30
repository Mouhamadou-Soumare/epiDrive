module.exports = function (plop) {
  plop.setGenerator('test', {
    description: 'Generate a test file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component or module name:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/tests/{{name}}.test.ts',
        templateFile: 'plop-templates/test-template.hbs',
      },
    ],
  });
};
