
//Big thanks to Digital Ocean for the following tutorial:
//https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module
//https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
// https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
//https://www.codegrepper.com/code-examples/javascript/access-control-allow-origin+nodeJs


const http = require("http");
const host = 'localhost';
const port = 8081;


const reqListener = function (req, res) {
  if (req.method == "POST") {
    req.on('data', chunk => {
        console.log(`Data chunk available: ${chunk}`);
      });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(`Your request has been recieved. Thank You.`);
  }
  else {
    res.end(`<div id="warning" class="warningtext">Warning:: Only HTTP POST requests accepted. Try again. </div>`)
  }
};


//html listener
/*const reqListener = function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(`<div id="warning" class="warningtext"> This is a warning message from the application (!!) </div>`);
}; */




//json listener
/*
const reqListener = function (req, res) { //handles requests?
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"message" :"this is a JSON response"}`);
}
*/


//basic listener
/*const reqListener = function (req, res) { //handles requests?
  res.writeHead(200);
  res.end("My first server!");
}*/


const server = http.createServer(reqListener);
server.listen(port, host, () => { //binds our server to network address and port (registers port with system OS).
  console.log(`Server is running on http:// ${host}:${port}`)
});
