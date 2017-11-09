const express = require('express');
const router = express.Router();
var contract = require('truffle-contract');
var MongoClient = require('mongodb').MongoClient;
var Web3 = require('web3');
var path = require('path');

const dbURL = "mongodb://localhost:27017/learningblockchain";
var IndexContract = require(path.join(__dirname, '../../contracts/Index.json'));
var LearnerLearningProviderContract = require(path.join(__dirname, '../../contracts/LearnerLearningProvider.json'));
var RegistrarContract = require(path.join(__dirname, '../../contracts/Registrar.json'));

var provider = new Web3.providers.HttpProvider('http://localhost:8101');
var registrar = contract(RegistrarContract);
registrar.setProvider(provider);
var deployedRegistrar;

router.post('/init', function (req, res) {
  registrar.deployed().then(deployedRegistrar => {
    this.deployedRegistrar = deployedRegistrar;
    res.send({"address": deployedRegistrar.address});
    MongoClient.connect(dbURL, function (err, db) {
      if (err) throw err;
      db.collection('Registrar', function (err, collection) {
        collection.update({address: deployedRegistrar.address, network_id: 10},
          {address: deployedRegistrar.address, active: true, default: true, network_id: 10}, {upsert: true});
      })
    });
  });
});

router.get('/all', function (req, res) {
  MongoClient.connect(dbURL, function (err, db) {
    if (err) throw err;
    db.collection('Registrar', function (err, collection) {
      let registrar = [];
      collection.find().toArray(function (index, item) {
        registrar.push(item);
      });
      res.json(registrar);
    })
  });
});

router.get('/allNodes', function (req, res) {
  MongoClient.connect(dbURL, function (err, db) {
    if (err) throw err;
    db.collection('RegisteredNodes', function (err, collection) {
      let registrar = [];
      collection.find().toArray(function (index, item) {
        console.log(item);
        registrar.push(item);
        res.json(item);
      });
    })
  });
});

router.get('/access/:ethAddress', function (req, res) {
  let contractAddress = req.params.ethAddress;
  let llpc = contract(LearnerLearningProviderContract);
  llpc.setProvider(provider);
  let llpcInstance = llpc.at(contractAddress);
  console.log(llpcInstance);
  let addStr = new String('0x7e2aae2be60afe540ab5f6cc6a6c2280d7c06df8');
  let addressRaw = addStr.valueOf();
  llpcInstance.canGrant.call(0x7e2aae2be60afe540ab5f6cc6a6c2280d7c06df8).then(function (ress) {
    console.log(ress);
    //res.json(ress);
  }).catch(error => {
    console.log(error);
    //res.json(llpcInstance.address);
  })
  llpcInstance.canWrite.call(0x7e2aae2be60afe540ab5f6cc6a6c2280d7c06df8).then(function (ress) {
    console.log(ress);
    //res.json(ress);
  }).catch(error => {
    console.log(error);
    //res.json(llpcInstance.address);
  })
  llpcInstance.canRead.call(0x7e2aae2be60afe540ab5f6cc6a6c2280d7c06df8).then(function (ress) {
    console.log(ress);
    //res.json(ress);
  }).catch(error => {
    console.log(error);
    //res.json(llpcInstance.address);
  })
});

router.post('/add/:ethAddress/:providerAddress', function (req, res) {
  let eth_address = req.params.ethAddress;
  let provider_address = req.params.providerAddress;
  let registrar_address = req.body.registrar_address;
  let queryString = req.body.query_string;
  let queryResult = req.body.query_result;
  console.log(req.body);
  let llpc = contract(LearnerLearningProviderContract);
  llpc.setProvider(provider);
  /*llpc.at('0x44a816f03d75985c06cddeeeed27dd4c0cd3b8ba').then(function (response) {
    response.getQueryHash().then(function (ress) {
      console.log(ress);
    })
  })*/
  llpc.new(
    eth_address,
    registrar_address,
    eth_address,
    queryString,
    queryResult,
    {
    from:
    provider_address,
    gas: 2100000
  }).then(llpcInstance => {
    console.log(llpcInstance.address);
    res.json(llpcInstance.address)
  }).catch(error => {
    console.log(error);
  });
});



router.post('/', function (req, res) {
  registrar.deployed().then(function (r) {
    console.log('ffff', r.address);
    res.send(r.toString());
  });
});

module.exports = router;
