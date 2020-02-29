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

//#region [ MAIN: GRPC ]

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

//#region [ MAIN: KUE JOB ]

console.log('MAIN: ' + HTTP_PORT + ' -> ' + CLUSTER_WORKER_SIZE + ' cluster');
for (var i = 0; i < CLUSTER_WORKER_SIZE; i++) {
    CLUSTER.setupMaster({ exec: 'worker.js' /* , args: ['--use', 'http'] */ });
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



