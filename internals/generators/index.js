/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');
const moduleGenerator = require('./module/index.js');
const routeGenerator = require('./route/index.js');
const languageGenerator = require('./language/index.js');

module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.setGenerator('module', moduleGenerator);
  plop.setGenerator('route', routeGenerator);
  plop.setGenerator('language', languageGenerator);
  plop.addHelper('directory', (comp) => {
    try {
      fs.accessSync(`app/containers/${comp}`, fs.F_OK);
      return `containers/${comp}`;
    } catch (e) {
      try {
        fs.accessSync(`app/modules/${comp}`, fs.F_OK);
        return `modules/${comp}`;
      } catch (ee) {
        return `components/${comp}`;
      }
    }
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
