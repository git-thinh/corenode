const HTTP_PORT = 12345;
const IP = '127.0.0.1';

const KUE = require('kue');
const QUEUE = KUE.createQueue();
const CLUSTER = require('cluster');
const CLUSTER_WORKER_SIZE = require('os').cpus().length;

const GRPC = require("grpc");
const PROTO_LOADER = require("@grpc/proto-loader");
const PROTO = GRPC.loadPackageDefinition(PROTO_LOADER.loadSync("msg.proto", { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }));

const ___THREAD = {};
const ___API = {};
const ___JOB = {};

const ___log = (obj) => { if (___THREAD[0]) ___THREAD[0].send(obj); };

//#region [ SETTING ]

const _mod_file = require('./lib/_mod_file.js');

const setting___load = (callback) => {

    const j1 = _mod_file.get_objects('job', 'js').then(data => {
        for (var api in data) {
            ___JOB[api] = data[api];

            for (var key in data[api]) {
                const js = '(function () { \
                                try{ \
                                    ___JOB["' + api + '"]["' + key + '"].execute = ' + data[api][key].text + '; \
                                    ___JOB["' + api + '"]["' + key + '"].ok = true; \
                                }catch(e){ \
                                    ___JOB["' + api + '"]["' + key + '"].ok = false; \
                                } \
                            })()';
                eval(js);
            }
        }
        //console.log('SETTING ___JOB = ', Object.keys(___JOB));
        return true;
    });

    const j2 = _mod_file.get_objects('api', 'js').then(data => {
        for (var api in data) {
            ___API[api] = data[api];

            for (var key in data[api]) {
                const js = '(function () { \
                                try{ \
                                    ___API["' + api + '"]["' + key + '"].execute = ' + data[api][key].text + '; \
                                    ___API["' + api + '"]["' + key + '"].ok = true; \
                                }catch(e){ \
                                    ___API["' + api + '"]["' + key + '"].ok = false; \
                                } \
                            })()';
                eval(js);
            }
        }
        //console.log('SETTING ___API = ', Object.keys(___API));
        return true;
    });

    Promise.all([j1, j2]).then(results => {
        const ok = results.length == 2 && results[0] == true && results[1] == true;
        //console.log('SETTING RESULTs = ', results);
        //console.log('SETTING OK = ' + ok);
        if (callback) callback(ok);
    });
};

//#endregion

//#region [ GRPC ]

const SERVER_ADDRESS = "0.0.0.0:5001";
let users = [];

// Receive message from client joining
const join = (call, callback) => {
    users.push(call);
    broadCast({ user: "Server", text: "new user joined ..." });
};

// Receive message from client
const send = (call, callback) => {
    console.log(call.request);
    broadCast(call.request);
};

// Send message to all connected clients
const broadCast = (message) => {
    users.forEach(user => {
        user.write(message);
    });
};

const SERVER = new GRPC.Server();

SERVER.addService(PROTO.example.Chat.service, { join: join, send: send });
SERVER.bind(SERVER_ADDRESS, GRPC.ServerCredentials.createInsecure());
SERVER.start();

//#endregion

//#region [ KUE JOB ]

console.log('MAIN: ' + HTTP_PORT + ' -> ' + CLUSTER_WORKER_SIZE + ' cluster');
for (var i = 0; i < CLUSTER_WORKER_SIZE; i++) {
    let worker = 'worker.js';
    switch (i) {
        case 0:
            worker = 'w-log.js';
            break;
        case 1:
            worker = 'w-db.js';
            break;
        case 2:
            worker = 'w-notify.js';
            break;
    }
    CLUSTER.setupMaster({ exec: worker /* , args: ['--use', 'http'] */ });
    ___THREAD[i] = CLUSTER.fork();
    ___THREAD[i].on('disconnect', () => {
        clearTimeout(timeout);
    });
    //___THREAD[i].disconnect();
    //___THREAD[i].kill();
    ___THREAD[i].send({ code: 'SET_THREAD_ID', data: i });
}

//KUE.app.listen(HTTP_PORT);

const HTTP_EXPRESS = require('express');
const HTTP_BODY_PARSER = require('body-parser');
const HTTP_APP = HTTP_EXPRESS();
const HTTP_SERVER = require('http').createServer(HTTP_APP);

//const BASIC_AUTH = require('basic-auth-connect');
//HTTP_APP.use(BASIC_AUTH('admin', '123456'));

HTTP_APP.use(KUE.app);

HTTP_SERVER.listen(HTTP_PORT, IP);

//#endregion

setting___load(function (ok_) {
    console.log('\nSETTING DONE = ' + ok_);
    ___log('\nSETTING DONE = ' + ok_);

});

