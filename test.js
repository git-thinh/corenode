//const execFile = require('child_process').execFile;
//const child = execFile('.\redis-server.exe', ['--port 12345'], (err, stdout, stderr) => {
//    if (err) {
//        throw err;
//    }
//    console.log(stdout);
//});

//var exec = require('child_process').exec;
//exec('redis-server.exe --port 12345', function (err, stdout, stderr) {
//    console.log('REDIS STARTING ...');
//    console.log(stdout);
//});


var exec = require('child_process').exec;
exec('redis-server.exe redis.conf --port 12345', { cwd: './redis/4.0/' }, function (error, stdout, stderr) {
    console.log(stdout);
});


const redis = require("redis");
const client = redis.createClient({ port: 12345 });

client.on("error", function (error) {
    console.error(error);
});

const _READ_LINE = require("readline");
const _RL = _READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
_RL.on("line", function (text) {
    const a = text.split(' ');
    const cmd = a[0];
    switch (cmd) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        case 'test': 
            console.log(new Date().toString());
            break;
        case 'set':
            if (a.length > 2)
                client.set(a[1], a[2]);
            break;
        case 'get':
            if (a.length > 1) {
                client.get(a[1], function (err, reply) {
                    if (err) {
                        console.log(err);
                    } else
                        console.log(a[1], '=', reply == null ? '' : reply.toString());
                });
            }
            break; 
        case 'key':

            client.keys('*', function (err, keys) {
                if (err) return console.log(err);
                if (keys) {
                    console.log('ALL_KEY = ', keys);
                }
            });

            break;
        default:
            break;
    }
});