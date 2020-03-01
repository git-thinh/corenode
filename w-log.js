const DGRAM = require('dgram');

let THREAD_ID;
let SCOPE = 'WK_LOG';
const MSG = [];

process.on('message', (m_) => {
    //console.log('\n-> ' + SCOPE + ': ', m_);
    if (m_) {
        switch (m_.code) {
            case 'SET_THREAD_ID':
                THREAD_ID = m_.data;
                return;
        }
        MSG.push(m_);
    }
});

const log___send = () => {
    if (MSG.length > 0) {
        const m = MSG.shift();

        let s = m;
        if (typeof m != 'string') s = JSON.stringify(m);
        if (s.length > 0 && s[0] == '\n') s = s.substr(1);

        console.log('\n-> ' + SCOPE + ': ' + s);

        const buf = Buffer.from(s);
        const udp = DGRAM.createSocket('udp4');
        udp.send(buf, 0, buf.length, 15555, '127.0.0.1', (err) => {
            // Send success
            udp.close();
        });
    }

    setTimeout(function () {
        log___send();
    }, 1);
};

log___send();


