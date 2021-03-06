﻿let _mod_file = function _mod_file() {
    const FS = require('fs');
    const _ = require('lodash');

    this.get_files = (root_dir_, file_ext_) => {
        const m = { ok: false, message: '', results: [] };

        return new Promise((resolve, reject) => {
            FS.readdir(root_dir_, (e1_, files_) => {
                if (e1_) {
                    m.message = e1_.message;
                } else {
                    const ext = file_ext_.toLowerCase();
                    let a = _.filter(files_, function (o) { return o.toLowerCase().endsWith(ext); });
                    //const path = root_dir_ + (root_dir_.endsWith('/') ? '' : '/');
                    a = _.map(a, function (o) { return o.toLowerCase(); });

                    m.ok = true;
                    m.results = a;
                }
                resolve(m);
            });
        });
    };

    this.get_objects = (root_dir, file_ext) => {
        return new Promise((resolve, reject) => {
            const obj = {};
            let total = 0;

            if (FS.existsSync('./' + root_dir + '/') == false) resolve(obj);

            FS.readdir('./' + root_dir + '/', (err_1, dirs_) => {
                //console.log(dirs_);
                if (dirs_.length == 0) resolve(obj);

                dirs_.forEach(dir_ => {

                    obj[dir_.toUpperCase()] = {};

                    FS.readdir('./' + root_dir + '/' + dir_, (err_2, files_) => {
                        const fs = _.filter(files_, function (o_) { return o_.endsWith('.' + file_ext); });
                        total = total + fs.length;

                        //console.log(api_, files_);
                        fs.forEach(fi_ => {
                            const file = './' + root_dir + '/' + dir_ + '/' + fi_;
                            //console.log(file); 

                            const key = fi_.substr(0, fi_.length - file_ext.length - 1).toUpperCase();
                            obj[dir_.toUpperCase()][key] = {
                                ok: false,
                                info: {
                                    root: root_dir.toUpperCase(),
                                    scope: dir_.toUpperCase(),
                                    key: key,
                                    setting: {}
                                },
                                execute: function (config_, obj_) { return null; }
                            };

                            FS.readFile('./' + root_dir + '/' + dir_ + '/' + key.toLowerCase() + '.json', 'utf-8', (err_3, text_) => {
                                try {
                                    obj[dir_.toUpperCase()][key].info.setting = JSON.parse(text_);
                                } catch (err_4) { ; }
                            });

                            FS.readFile(file, 'utf-8', (err_3, text_) => {
                                obj[dir_.toUpperCase()][key].text = text_;
                                total--;
                                //console.log('---> ' + key, total);
                                if (total == 0) resolve(obj);
                            });
                        });
                    });
                });
            });

        });

    };
};

_mod_file.instance = null;
_mod_file.getInstance = function () {
    if (this.instance === null) this.instance = new _mod_file();
    return this.instance;
};
module.exports = _mod_file.getInstance();