
//Big thanks to Digital Ocean for the following tutorial:
//https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module
//https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
// https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
//https://www.codegrepper.com/code-examples/javascript/access-control-allow-origin+nodeJs


const http = require("http");
const fs = require("fs");
const host = 'localhost';
const port = 8081;
const path = "./data/userdata.json";

function genUserFile(path,seedPhrase) {
  let tempStr = `{"username":"User", "sentlastmsg":"false", "currOffset": 0, "seedPhrase":"`
  tempStr+=seedPhrase+`","conv":[]}`
  let jsonObj = JSON.parse(tempStr); //Needed??

  fs.writeFile(path, tempStr, err => { if (err) { console.log(err)}});
  return jsonObj;
}


function parsePost(chunk) {
  const parsedStr = chunk.toString()
  let storeParams = [parsedStr.split("&")[0].split("=")[1],parsedStr.split("&")[1].split("=")[1]];

  //It looks like we have to do all the parse work and logic here - cant get arguments into global scope.
  //Assume the seedPhrase is correct (error checked by UI).

  //Check to see if user file exists. If not, generate it.
  if (!fs.existsSync(path)) {
    genUserFile(path,storeParams[0]); //put in place and autogenerate
    //Need to check if node exists. //and if a message was left for us.
  }

}



const reqListener = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const argArr = [];
  if (req.method == "POST") {
    req.on('data', parsePost);
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


const server = http.createServer(reqListener);
server.listen(port, host, () => { //binds our server to network address and port (registers port with system OS).
  console.log(`Server is running on http:// ${host}:${port}`)
});
