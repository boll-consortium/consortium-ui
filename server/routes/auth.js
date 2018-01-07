const express = require('express');
const router = express.Router();
var contract = require('truffle-contract');
var MongoClient = require('mongodb').MongoClient;
var GoogleAuth = require('google-auth-library');
var web3 = require('web3');
var path = require('path');
var axios = require('axios');
var jwt = require('jsonwebtoken');
const SECRET = '0x3c1607c36fff4b9c85195e5be54187f56b154673';

const dbURL = "mongodb://localhost:27017/learningblockchain";
var IndexContract = require(path.join(__dirname, '../../contracts/Index.json'));
var LearnerLearningProviderContract = require(path.join(__dirname, '../../contracts/LearnerLearningProvider.json'));
var RegistrarContract = require(path.join(__dirname, '../../contracts/Registrar.json'));

var provider = new web3.providers.HttpProvider('http://10.236.173.83:6060/node1');
var registrar = contract(RegistrarContract);
registrar.setProvider(provider);
var deployedRegistrar;
const API_CLIENT_CREDENTIALS = {
  GOOGLE: {
    CLIENT_ID: '489430961108-40lf5al8fla0fta8qe489hcic10hi3t0.apps.googleusercontent.com',
    KEY: 'AIzaSyA5zgjGFtCcQuwi_eCrLBuH5ePDzYSAgAI',
    SECRET: 'kT2eCJd9vV5L1jFXv1f17D-g'
  },
  FACEBOOK: {
    APP_ID: '1995449750733639',
    SECRET: '0d84e6070a8b67d222c76c96c3be08ad',
    VERSION: 'v2.11'
  }
};
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}
const fbGraphVerifier = 'https://graph.facebook.com/debug_token?input_token={0}&access_token={1}|{2}';
const loginSources = {GOOGLE: 'google', FACEBOOK: 'facebook', EMAIL: 'email'};

var auth = new GoogleAuth;
var client = new auth.OAuth2(API_CLIENT_CREDENTIALS.GOOGLE.CLIENT_ID,
  API_CLIENT_CREDENTIALS.GOOGLE.SECRET,
  'http://localhost:3000');

router.post('/', (req, res) => {
  let token = req.body.token;
  let idToken = req.body.idToken;
  let email = req.body.email;
  let uid = req.body.uid;
  let source = req.body.source ? req.body.source : req.body.provider;
  switch (source) {
    case loginSources.GOOGLE:
      client.verifyIdToken(idToken, API_CLIENT_CREDENTIALS.GOOGLE.CLIENT_ID, (error, response) => {
        if (error) {
          res.json({});
        } else {
          let payload = response.getPayload();
          let userId = payload['sub'];
          if (userId === uid) {
            getUser(uid, email).then((error, response) => {
              if (error) {
                console.log(error);
                res.json(error);
              } else if (!response) {
                createUser(req.body).then((response) => {
                  response.token = jwt.sign({data: response['uid']}, SECRET, {expiresIn: '1h'});
                  res.json(response);
                }).catch(error => {
                  res.json(error);
                });
              } else {
                response.token = jwt.sign({data: response['uid']}, SECRET, {expiresIn: '1h'});
                res.json(response);
              }
            });
          } else {
            res.json({code: 419});
          }
        }
      });
      break;
    case loginSources.FACEBOOK:
      verifyFbToken(token).then((response) => {
        if (response.data.data.is_valid) {
          getUser(uid, email).then((error, response) => {
            if (error) {
              console.log(error);
              res.json(error);
            } else if (!response) {
              createUser(req.body).then((response) => {
                res.json(response);
              }).catch(error => {
                res.json(error);
              });
            } else {
              res.json(response);
            }
          });

        } else {
          res.json({});
        }
      }).catch((error) => {
        console.log(error);
      });
      break;
    case loginSources.EMAIL:
      break;
    default:
      res.json({});
      break;
  }
});

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

function verifyFbToken(token) {
  return axios.get(fbGraphVerifier.format(token, API_CLIENT_CREDENTIALS.FACEBOOK.APP_ID, API_CLIENT_CREDENTIALS.FACEBOOK.SECRET));
}

module.exports = router;
