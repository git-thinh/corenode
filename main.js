const HTTP_PORT = 12345;
const IP = '127.0.0.1';

const LOG_PORT = 1515;
const LOG_ERROR_PORT = 1510;

const UUID = require('uuid');
const JOB = require('cron').CronJob;

const PATH = require('path');
const FS = require('fs');

const FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const _mod_file = require('./lib/_mod_file.js');

let ___API = {};
let ___JOB = {};

_mod_file.get_objects('job', 'js').then(data => {
    ___JOB = data;

    for (var api in data) {
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

    //console.log('????????? = ', ___JOB);
});


//#region [ HTTP ]

const HTTP_EXPRESS = require('express');
const HTTP_BODY_PARSER = require('body-parser');
const HTTP_APP = HTTP_EXPRESS();
const HTTP_SERVER = require('http').createServer(HTTP_APP);

HTTP_APP.use(HTTP_EXPRESS.static(PATH.join(__dirname, 'htdoc')));

HTTP_APP.get('/test/job', async (req, res) => { res.json(___JOB); });
HTTP_APP.get('/test/api', async (req, res) => { res.json(___API); });

HTTP_SERVER.listen(HTTP_PORT, IP);

//#endregion


