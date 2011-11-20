var http = require('http');
var util  = require('util');
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var cmd = require('commander');

cmd
  .version("0.0.1")
  .option("-d --directory [dir]", "Download to this directory", "./")
  .parse(process.argv);

var last_directory = process.cwd();
process.chdir(cmd.directory);

var pattern = /http\:\/\/turntable\.fm/;

// For turntable.fm's static file upload.
var static_pattern = /http\:\/\/static\.turntable\.fm\/upload\//;

// Pattern for musicnet files.
var musicnet_pattern = /http\:\/\/fp-limelight.musicnet.com/;

process.on('uncaughtException',function(error){
  console.log("Process: " + error);
});

var mp3_filename = function(url) {
  if(static_pattern.exec(url)) {
    return url.substr(34) + ".mp3";
  }

  if(musicnet_pattern.exec(url)) {
    return url.substring(71, 87);
  }
}

http.createServer(function(request, response) {
  if(pattern.exec(request.url)) {
    util.log(request.method + " " + request.url);
  } else {
    util.log(request.method + " " + request.url.grey);
  }
  var mp3 = false;

  if(static_pattern.exec(request.url) || musicnet_pattern.exec(request.url)) {
    var name = mp3_filename(request.url);
    if(!path.existsSync(name)) {
      console.log(("MP3 File Found, downloading to " + name).blue);
      mp3 = true;
    }
  }

  var proxy = http.createClient(80, request.headers['host'])

  proxy.on('error', function(error) {
    console.log("Proxy: " + error);
    response.writeHead(404, "not found");
    response.end();
  });

  var proxy_request = proxy.request(request.method, request.url, request.headers);

  proxy_request.addListener('response', function (proxy_response) {
    if(mp3) {
      var name = mp3_filename(request.url);
      var download_file = fs.createWriteStream(name);
    }
    proxy_response.addListener('data', function(chunk) {
      if(mp3) {
        download_file.write(chunk, encoding='binary');
      }
      response.write(chunk, 'binary');
    });
    proxy_response.addListener('end', function() {
      response.end();
      if(mp3){
        console.log(( name + " now saved" ));
        download_file.end();
        delete download_file;
      }
    });
    response.writeHead(proxy_response.statusCode, proxy_response.headers);
  });
  request.addListener('data', function(chunk) {
    proxy_request.write(chunk, 'binary');
  });
  request.addListener('end', function() {
    proxy_request.end();
  });
}).listen(8080);


process.on('exit', function () {
  process.chdir(last_directory);
});

