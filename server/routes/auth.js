const express = require('express');
const router = express.Router();
const contract = require('truffle-contract');
const MongoClient = require('mongodb').MongoClient;
const GoogleAuth = require('google-auth-library');
const web3 = require('web3');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const SECRET = '0xebd3273c2f829181019e4a62e16f2ad548caac7e';
const secretKey = 'y0xebd3273c2f829181it08068674787';

const dbURL = "mongodb://localhost:27017";
const config = require(path.join(__dirname, '../../config.json'));
const RegistrarContract = require(path.join(__dirname, '../../contracts/Registrar.json'));

const provider = new web3.providers.HttpProvider(config['base_nodes'][0]);
const registrar = contract(RegistrarContract);
registrar.setProvider(provider);
let deployedRegistrar;
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
    const args = arguments;
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

const auth = new GoogleAuth;
const client = new auth.OAuth2(API_CLIENT_CREDENTIALS.GOOGLE.CLIENT_ID,
  API_CLIENT_CREDENTIALS.GOOGLE.SECRET,
  'http://localhost:3000');
const uploader = multer({dest: __dirname + '/uploads/'});

router.post('/login', uploader.single('keyFile'), (req, res) => {
  let password = req.body.password;
  //console.log(password, req.file);
  const keyFile = JSON.parse(fs.readFileSync(__dirname + '/uploads/' + req.file.filename, 'utf8'));
  const formData = {
    'keyFile': keyFile,
    'password': password
  };
  let source = req.body.source ? req.body.source : req.body.provider ? req.body.provider : 'email';
  switch (source) {
    case loginSources.EMAIL:
      axios.post('http://10.236.173.58:8082/validate/credentials', formData, {
        headers: {
          'apikey': 'BYHNIFxyT32buJXAKCPEQzTW2qPIG1Gd',
          'Authorization': 'BYHNIFxyT32buJXAKCPEQzTW2qPIG1Gd'
        }
      }).then(response => {
        if(!response['data']['valid'] || !response['data']['verified']) {
            res.json({"message": "account is not verified. Please wait for a while or contact join@boll.io", code: 419})
          }
        else {
          res.json({
            'token': jwt.sign({data: response['data']['bollAddress'] + ':' + password + ':' + response['data']['isAdmin']}, SECRET, {expiresIn: '1h'}),
            'code': 200,
            'bollAddress': response['data']['bollAddress'],
            'isAdmin': response['data']['isAdmin']
          });
        }
      }).catch(console.error);
        /*getUser(uid, email).then((response) => {
          if (!response || CryptoJS.AES.encrypt(password,secretKey) == response['password']) {
            res.json({"message": "email or password incorrect", code: 419})
          } else if(!response['verified']) {
            res.json({"message": "account is not verified. Please wait for a while or contact join@boll.io", code: 419})
          }
          else {
            response.token = jwt.sign({data: response['uid']}, SECRET, {expiresIn: '1h'});
            res.json(response);
          }
        }).catch(error => {
          res.json(error);
        });*/
      break;
    default:
      res.json({"mesage": "invalid request.", code: 419});
      break;
  }
});

router.post('/register', (req, res) => {
  let email = req.body.email;
  let source = req.body.source ? req.body.source : req.body.provider ? req.body.provider : 'email';
  switch (source) {
    case loginSources.EMAIL:
      getUser(email).then((response) => {
        if (!response) {
          createUser(req.body).then((response) => {
            res.json({"message": "Your registration request has been submitted. We will get back to you shortly.", code: 200});
          }).catch(error => {
            res.json(error);
          });
        } else {
          res.json({"message": "account with the provided email address already exists.", code: 444});
        }
      });
      break;
    default:
      res.json({"mesage": "invalid request.", code: 419});
      break;
  }
});

function createUser(data) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, function (err, client) {
      if (err) reject(err);
      const db = client.db("learningblockchain");
      db.collection('Users', function (err, collection) {
        if (err) reject(err);
        const user = {
          university_name: data.schoolName,
          blockchainAddress: data.blockchainAddress,
          school_website: data.schoolWebsite,
          email: data.email,
          verified: false
        };
        collection.insert(user,
          {email: user.email}, {upsert: false}, (error, response) => {
            console.log(response);
            if (error) {
              reject(error);
            } else{
              user['password'] = undefined;
              resolve(user);
            }
          });
      });
    });
  })
}

function getUser(email) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, function (err, client) {
      if (err) reject(err);
      //console.log("dhdhdhdhdh....", client, err);
      const db = client.db("learningblockchain");
      db.collection('Users', function (err, collection) {
        if (err) reject(err);
        collection.findOne({email: email}, (err2, user) => {
          if (err2) {
            console.error("error:2", err2);
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
