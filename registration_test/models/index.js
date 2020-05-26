'use strict';

/**
  /config/config.js
  sequelize를 사용하기 위해 환경을 설정하는 부분

  /models/index.js
  Model을 정의하고 관계를 설정해주는 역할
 
 models/index.js 파일은 다음을 과정을 수행합니다.
 - /config/config.json 파일의 설정 값을 읽어 sequelize를 생성
 - models 폴더 아래에 존재하는 js 파일을 모두 로딩
 - db 객체에 Model을 정의하여 반환
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
