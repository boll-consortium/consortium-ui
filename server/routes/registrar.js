const express = require('express');
const router = express.Router();
const contract = require('truffle-contract');
const MongoClient = require('mongodb').MongoClient;
const web3 = require('web3');
const path = require('path');
const shell = require('shelljs');
const exec = require('ssh-exec');

const dbURL = "mongodb://localhost:27017/learningblockchain";
var IndexContract = require(path.join(__dirname, '../../contracts/Index.json'));
var LearnerLearningProviderContract = require(path.join(__dirname, '../../contracts/LearnerLearningProvider.json'));
var RegistrarContract = require(path.join(__dirname, '../../contracts/Registrar.json'));

var provider = new web3.providers.HttpProvider('http://10.236.173.83:6060/node1');
var registrar = contract(RegistrarContract);
registrar.setProvider(provider);
var deployedRegistrar;

router.post('/init', function (req, res) {
  registrar.new({
    from: '0xe715f10de7cfcca2eb155ef87eea8c832bffcd78',
    gas: 2100000
  }).then(deployedRegistrar => {
    console.log('created');
    this.deployedRegistrar = deployedRegistrar;
    res.send({"address": deployedRegistrar.address});
    MongoClient.connect(dbURL, function (err, db) {
      if (err) throw err;
      db.collection('Registrar', function (err, collection) {
        collection.update({address: deployedRegistrar.address, network_id: 10},
          {address: deployedRegistrar.address, active: true, default: true, network_id: 10}, {upsert: true});
      })
    });
  }).catch(error => {
    console.log(error);
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

router.get('/default', function (req, res) {
  MongoClient.connect(dbURL, function (err, db) {
    if (err) throw err;
    db.collection('Registrar', function (err, collection) {
      collection.findOne().then(function (docReg) {
        res.json(docReg);
      });
    })
  });
})

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

router.get('/id/:network_id', function (req, res) {
  MongoClient.connect(dbURL, function (err, db) {
    if (err) throw err;
    db.collection('Registrar', function (err, collection) {
      if (err) throw err;
      collection.find({active: true, default: true, network_id: req.param('network_id')}).limit(1);
      res.send({"address": 'ddd'});
    });
  });
})

router.post('/register/:registrar_id', function (req, res) {
  let registrar_id = req.param('registrar_id');
  let eth_address = req.body.public_address;
  let other_id = req.body.other_id;
  let index_contract_address = req.body.index_contract_address;
  let status = req.body.status;
  let is_learning_provider = req.body.is_learning_provider;
  if (registrar_id && eth_address && other_id && index_contract_address) {
    MongoClient.connect(dbURL, function (err, db) {
      if (err) throw err;
      db.collection('RegisteredNodes', function (err, collection) {
        if (err) throw err;
        collection.insert({
            eth_address: eth_address, registrar_id: registrar_id, other_id: other_id,
            index_contract_address: index_contract_address, status: status, is_learning_provider: is_learning_provider
          },
          {eth_address: eth_address, registrar_id: registrar_id, other_id: other_id}, {upsert: false});
      });
      res.json({success:true})
    });
  }
});

router.get('/access/:ethAddress/:registrarAddress', function (req, res) {
  let contractAddress = req.params.ethAddress;
  let registrarAddress = req.params.registrarAddress;
  let rlpc = contract(RegistrarContract);
  rlpc.setProvider(provider);
  let rlpcInstance = rlpc.at(registrarAddress);
  console.log(rlpcInstance);
  let addStr = new String(contractAddress);
  let addressRaw = addStr.valueOf(registrarAddress);
  rlpcInstance.getIndexContract.call(addressRaw).then(function (ress) {
    console.log(ress);
    res.json(ress);
  }).catch(error => {
    console.log(error);
    res.json(rlpcInstance.address);
  })
});



router.post('/', function (req, res) {
  registrar.deployed().then(function (r) {
    console.log('ffff', r.address);
    res.send(r.toString());
  });
});
router.get('/tester', function (req, res) {
  let response = unlockAccount(res);
});

function unlockAccount(res) {
  let response = "";
  if (!shell.which('/opt/ethereum/build/bin/geth')) {
    response = "geth is required for this";
} else {

  }
 shell.exec('$ETHEREUM_HOME/build/bin/geth --exec "eth.coinbase" attach http://127.0.0.1:8101', function (code, stdout, stderr) {
   response = code + stdout + stderr;
   response =+ shell.exec('eth.coinbase');
   res.send(response);
 });
}

module.exports = router;
