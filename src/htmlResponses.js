const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const getPage = (page, request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page);
  response.end();
};

const getIndex = (request, response) => getPage(index, request, response);
const getPage2 = (request, response) => getPage(page2, request, response);
const getPage3 = (request, response) => getPage(page3, request, response);

module.exports.getIndex = getIndex;
module.exports.getPage2 = getPage2;
module.exports.getPage3 = getPage3;
