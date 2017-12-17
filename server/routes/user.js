const express = require('express');
const router = express.Router();
var contract = require('truffle-contract');
var MongoClient = require('mongodb').MongoClient;
var web3 = require('web3');
var path = require('path');
var axios = require('axios');
var jsonwebtoken = require('jsonwebtoken');
const SECRET = '0xe223466183d84da6a6fbf1d1c21f8f2b94eb2a5e';

const dbURL = "mongodb://localhost:27017/learningblockchain";
var IndexContract = require(path.join(__dirname, '../../contracts/Index.json'));
var LearnerLearningProviderContract = require(path.join(__dirname, '../../contracts/LearnerLearningProvider.json'));
var RegistrarContract = require(path.join(__dirname, '../../contracts/Registrar.json'));

var provider = new web3.providers.HttpProvider('http://10.236.173.83:6060/node1');
var registrar = contract(RegistrarContract);
registrar.setProvider(provider);
var deployedRegistrar;
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

router.post('/addAccount/:userId', validateToken, (req, res) => {
  const userId = req.params.userId;
  console.log(req.params);
  let accounts = req.body.accounts;
  updateAccount(userId, accounts).then((response => {
    res.json(response);
  })).catch((error) => {
    res.json(error);
  });
});

function validateToken(req, res, next) {
  /*const userId = req.params.id;
  const token = req.header('Auth-Token');
  if (userId !== null && token !== null) {
    const verifier = jsonwebtoken.verify(token, SECRET);
    console.log(verifier);
  }*/
  next();
}

function updateAccount(userId, accounts) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, function (err, db) {
      if (err) reject(err);
      db.collection('Users', function (err, collection) {
        if (err) reject(err);
        collection.findOne({uid: userId}, (error, user) => {
          console.log(userId, user);
          if (error) {
            reject(error);
          } else {
            if (user['accounts'] !== null && user['accounts'] !== undefined) {
              console.log('aaaaaaaaaaaaa', accounts);
              user['accounts'].push(accounts);
            } else {
              user['accounts'] = accounts;
              console.log('SSSSSSSS::: ', user);
              collection.findOneAndUpdate(
                {email: user.email},{accounts: user['accounts']},{multi: true}, (error, response) => {
                  console.log('7777777777 ', response);
                  console.log(response);
                  if (error) {
                    reject(error);
                  } else
                    resolve(user);
                });
            }
          }
        });
      });
    });
  });
}

function updateUser(userId, user) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, function (err, db) {
      if (err) reject(err);
      db.collection('Users', function (err, collection) {
        if (err) reject(err);
        collection.find({uid: userId}, (error, user) => {
          if (error) {
            reject(error);
          } else {
            collection.findOneAndUpdate(user,
              {email: user.email}, (error, response) => {
                console.log('7777777777 ', accounts);
                console.log(response);
                if (error) {
                  reject(error);
                } else
                  resolve(user);
              });

            }
        });
    });
  });
    });
}

function createUser(data) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, function (err, db) {
      if (err) reject(err);
      db.collection('Users', function (err, collection) {
        if (err) reject(err);
        const user = {
          uid: data.uid ? data.uid : data.id,
          name: data.name ? data.name : data.firstname + ' ' + data.lastname,
          email: data.email,
          image: data.image ? data.image : data.profile_picture,
          provider: data.provider ? data.provider : data.source
        };
        collection.insert(user,
          {email: user.email}, {upsert: false}, (error, response) => {
            console.log(response);
            if (error) {
              reject(error);
            } else
              resolve(user);
          });
      });
    });
  })
}

function getUser(uid, email) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, function (err, db) {
      if (err) reject(err);
      db.collection('Users', function (err, collection) {
        if (err) reject(err);
        collection.findOne({email: email}, (err2, user) => {
          if (err2) {
            console.log(err2);
            reject(err2);
          } else {
            resolve(user);
          }
        });
      });
    });
  });
}

module.exports = router;
