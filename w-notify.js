﻿let THREAD_ID;
let SCOPE = 'WK_NOTIFY';

const KUE = require('kue');
const QUEUE = KUE.createQueue();

const GRPC = require("grpc");
const PROTO_LOADER = require("@grpc/proto-loader");
const PROTO = GRPC.loadPackageDefinition(PROTO_LOADER.loadSync("msg.proto", { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }));

process.on('message', (m_) => {
    console.log('\n-> ' + SCOPE + ': ', m_);

    if (m_) {
        switch (m_.code) {
            case 'SET_THREAD_ID':
                THREAD_ID = m_.data;
                break;
        }
    }
});

const username = '';
const REMOTE_SERVER = "0.0.0.0:5001";
const CLIENT = new PROTO.example.Chat(REMOTE_SERVER, GRPC.credentials.createInsecure());

//////const CHANNEL = CLIENT.join({ user: username });
//////CHANNEL.on("error", (err) => {
//////    console.log('ERROR DISCONNECT TO SERVER ...');
//////});
//////const onData = (message) => {
//////    if (message.user == username) {
//////        return;
//////    }
//////    console.log(`${message.user}: ${message.text}`);
//////};
//////CHANNEL.on("data", onData);

//////CLIENT.send({ user: username, text: 'LOGIN' }, res => { });



//QUEUE.process('email', 10, function (job, done) {
//    var pending = 5, total = pending;

//    var interval = setInterval(function () {
//        job.log('sending!');
//        job.progress(total - pending, total);

//        --pending || done();

//        pending || clearInterval(interval);

//    }, 1000);
//});




