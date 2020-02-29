const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
var snappy = require('snappy');





















//console.log('BEGIN ...');
////console.time();
//readFile('100k.txt', 'utf8').then(data => {
//    console.log('data compressed 37,581,797 = ', data.length);
     
//    snappy.compress(data, function (err, compressed) {
//        console.log('compressed Buffer = ', compressed.length);

//        fs.writeFile('100k.bin', compressed, function (e1) {
//            console.log(e1);
//        });

//        // return it as a string
//        snappy.uncompress(compressed, { asBuffer: false }, function (err, original) {
//            console.log('Original String = ', original.length);
//            console.log('DONE');
//        });
//    });

//    //console.timeEnd();
//});





//let k = 0;
//require('fs').createReadStream('test.txt', {
//    //flag: 'a+',// r|a+|...
//    //encoding: 'ascii',
//    encoding: 'ascii',
//    //start: 8,
//    //end: 64,
//    highWaterMark: 4 // default = 65536
//}).on('data', function (chunk) {
//    if (k == 0)
//        console.log(chunk.length, chunk.toString());
//    k++;
//}).on('end', () => {
//    console.log('DONE');
//  let s = this;
//  setTimeout(function () {
//    // the destroy method can be used to
//    // close the stream manually
//    s.destroy();
//  }, 3000);
//}).on('error', function (err) {
//console.log(err); 
//}).on('close', function () {
//console.log(''read stream closed''); 
//});





//var snappyStream = require('snappy-stream')
//    , compressStream = snappyStream.createCompressStream()
//    , uncompressStream = snappyStream.createUncompressStream({
//        asBuffer: false // optional option, asBuffer = false means that the stream emits strings, default: true
//    });

//compressStream.on('data', function (chunk) {
//    console.log('data compressed 3,884,961 = ', chunk.length);
//    console.log(chunk.toString('utf8'));
//});

//uncompressStream.on('data', function (chunk) {
//    console.log('data origin = ', chunk.length);
//    //console.log(chunk);
//});

////compressStream.write('hello');
////compressStream.write('world');
 
//var stream = fs.createReadStream('10k.txt');
//stream.pipe(compressStream);

//compressStream.end();