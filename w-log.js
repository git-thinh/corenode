const DGRAM = require('dgram');

let THREAD_ID;
let SCOPE = 'WK_LOG';
const MSG = [];

process.on('message', (m) => {
    //console.log('\n-> ' + SCOPE + ': ', m);
    if (m) {
        switch (m.code) {
            case 'SET_THREAD_ID':
                THREAD_ID = m.data;
                return;
        }

        setTimeout(function () {

        });

        let text = m;
        if (typeof m != 'string') text = JSON.stringify(m);
        text = new Date().toLocaleString() + '\r\n' + text;

        MSG.push(text);
    }
});


const SNAPPY = require('snappy');
const REDIS = require("redis");
const CLIENT = REDIS.createClient({ detect_buffers: true });

let _busy = false;
let k = 1;

const log___send = () => {
    if (_busy) {
        setTimeout(function () { log___send(); }, 1);
        return;
    }

    if (MSG.length > 0) {
        _busy = true;

        const text = MSG.shift();         
        console.log('\n-> ' + SCOPE + ': ' + text);

        SNAPPY.compress(text, function (err, buf_compressed) {
            if (err) { }
            CLIENT.set(k, buf_compressed, function (err) {
                if (err) {
                    MSG.push(text);
                    return;
                }
                else {
                    k++;
                }

                _busy = false;
                setTimeout(function () { log___send(); }, 1);
            });
        });
    }
};

log___send();


