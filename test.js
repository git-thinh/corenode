const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
var snappy = require('snappy');


console.log('BEGIN ...');
//console.time();
readFile('test.txt', 'utf8').then(data => {
    console.log('data compressed 3,735,671 = ', data.length);
     
    snappy.compress(data, function (err, compressed) {
        console.log('compressed Buffer = ', compressed.length);
        // return it as a string
        snappy.uncompress(compressed, { asBuffer: false }, function (err, original) {
            console.log('Original String = ', original.length);
            console.log('DONE');
        });
    });

    //console.timeEnd();
});

//let k = 0;
//require('fs').createReadStream('test.txt', {
//    //flag: 'a+',
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