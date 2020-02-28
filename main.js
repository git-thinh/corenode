
const UUID = require('uuid');
const JOB = require('cron').CronJob;

const PATH = require('path');
const FS = require('fs');

const FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const _mod_file = require('./lib/_mod_file.js');


let ___API = {};
let ___FN = {};


_mod_file.get_objects('bot', 'js').then(data => {
    ___FN = data;

    for (var api in data) {
        for (var key in data[api]) {
            const js = '(function () { \
                            try{ \
                                ___FN["' + api + '"]["' + key + '"].execute = ' + data[api][key].text + '; \
                                ___FN["' + api + '"]["' + key + '"].ok = true; \
                            }catch(e){ \
                                ___FN["' + api + '"]["' + key + '"].ok = false; \
                            } \
                        })()';
            eval(js);
        }
    }

    console.log('????????? = ', ___FN);
});





