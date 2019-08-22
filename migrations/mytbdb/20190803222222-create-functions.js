'use strict';

var dbm;
var type;
var seed;
var driver;
var fs = require('fs');
var path = require('path');
var Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  driver = dbm.getInstance().config.getCurrent().settings.driver;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var filePath = path.join(__dirname, 'sqls', driver, '20190803222222-create-functions-up.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
      return new Promise((resolve, reject) => {
          const promises = [];
          for (const sql of data.split('$$')) {
              if (sql === undefined || sql.trim() === '') {
                  console.error("skip sql" + sql);
                  continue;
              }
              console.error("run sql" + sql);
              promises.push(db.runSql(sql));
          }


          return Promise.all(promises).then(values => {
              return resolve(values[0]);
          }).catch(reason => {
              return reject(reason);
          });
      });
  });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, 'sqls', driver, '20190803222222-create-functions-down.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
};

exports._meta = {
  "version": 1
};
