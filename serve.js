
// Simple script to serve the demos and tests

var static = require('node-static'),
    http = require('http'),
    util = require('util'),
    port = 8980;

var fileServer = new static.Server('./');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        console.log('Requesting url', request.url)
        fileServer.serve(request, response);
    });
}).listen(port);
console.log('listening on ', port);
