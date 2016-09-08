/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a module component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Form',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component, module or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    default: true,
    message: 'Do you want an actions/constants/reducer tupel for this module?',
  }, {
    type: 'confirm',
    name: 'wantSagas',
    default: true,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
  }, {
    type: 'confirm',
    name: 'wantMessages',
    default: true,
    message: 'Do you want i18n messages (i.e. will this component use text)?',
  }],
  actions: data => {
    // Generate index.js and index.test.js
    const actions = [{
      type: 'add',
      path: '../../app/modules/{{properCase name}}/{{ camelCase name }}.js',
      templateFile: './module/index.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/modules/{{properCase name}}/tests/index.test.js',
      templateFile: './module/test.js.hbs',
      abortOnFail: true,
    }];

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/{{ camelCase name }}Messages.js',
        templateFile: './module/messages.js.hbs',
        abortOnFail: true,
      });
    }

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/{{ camelCase name }}Actions.js',
        templateFile: './module/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/tests/actions.test.js',
        templateFile: './module/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/{{ camelCase name }}Constants.js',
        templateFile: './module/constants.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/{{ camelCase name }}Reducer.js',
        templateFile: './module/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/tests/reducer.test.js',
        templateFile: './module/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSagas) {
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/{{ camelCase name }}Sagas.js',
        templateFile: './module/sagas.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/modules/{{properCase name}}/tests/sagas.test.js',
        templateFile: './module/sagas.test.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
