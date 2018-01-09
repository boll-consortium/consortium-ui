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
const Wb3 = new web3(provider);

router.post('/init', function (req, res) {
  registrar.new({
    from: '0xe715f10de7cfcca2eb155ef87eea8c832bffcd78',
    gas: 4700000
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
router.post('/create_index', function (req, res) {
  createIndexContract(req, res);
});
router.post('/register_account', function (req, res) {
  registerAccount(req, res);
});
router.post('/write_learning_content', function (req, res) {
  writeLearningContent(req, res);
});

router.post('/update_index', function (req, res) {
  updateIndex(req, res);
});

router.get('/check_status/:txHash', function (req, res) {
  const txHash = req.params.txHash;
  if(txHash) {
    let txRcpt = Wb3.eth.getTransactionReceipt(txHash);
    if (txRcpt.blockNumber !== undefined && txRcpt.blockNumber !== null) {
      res.json({response: {contractAddress: txRcpt.contractAddress, status: txRcpt.blockNumber !== undefined && txRcpt.blockNumber !== null}});
    } else {
      let counter = 0;
      const watcher = setInterval(() => {
        txRcpt = Wb3.eth.getTransactionReceipt(txHash);
        if (txRcpt.blockNumber !== undefined && txRcpt.blockNumber !== null || counter === 45000) {
          res.json({response: {contractAddress: txRcpt.contractAddress, status: txRcpt.blockNumber !== undefined && txRcpt.blockNumber !== null}});
          clearInterval(watcher);
        } else {
          counter=+5000;
        }
      }, 5000);
    }
  }
});
//"{'creator':'0xe715f10de7cfcca2eb155ef87eea8c832bffcd78','owner':'0x8b9b4d62a767e0902d78dd6cbc1753e62103519a','isLearningProvider':false,'userStatus':'active','registrarAddress':'0x35d18a934178cab1c2b8e7c747b2df4479708d40','otherId':'learner'}"
function createIndexContract(req, res) {
  const creator=req.body.creator, owner=req.body.owner, isLearningProvider=req.body.isLearningProvider,
    userStatus = req.body.userStatus, registrarAddress = req.body.registrarAddress, otherId = req.body.otherId;
  let response = "";
  if (!shell.which('/opt/ethereum/build/bin/geth')) {
    response = "geth is required for this";
    res.json({response: response});
    return null;
} else {
    const params = "{0} {1} {2} {3} {4} {5} {6}".format(creator, owner, otherId, isLearningProvider, userStatus, "4100000", registrarAddress);
    console.log("Params: ",params);
    console.log(creator, owner, otherId, isLearningProvider, userStatus, "1000000", registrarAddress);
    shell.exec('/home/patrick/index_contract_creator.sh {0}'.format(params), function (code, stdout, stderr) {
      response = stdout;
      res.json({response: response});
    });
  }
}

function writeLearningContent(req, res) {
  const creator=req.body.creator, owner=req.body.owner, queryString=req.body.queryString,
    recordType = req.body.recordType, registrarAddress = req.body.registrarAddress, queryResult = req.body.queryResult;
  let response = "";
  if (!shell.which('/opt/ethereum/build/bin/geth')) {
    response = "geth is required for this";
    res.json({response: response});
    return null;
  } else {
    const params = "{0} {1} {2} {3} {4} {5} {6} {7}".format(creator, owner, queryString, queryResult, recordType, "4100000", registrarAddress);
    shell.exec('/home/patrick/learner_learning_provider_creator.sh {0}'.format(params), function (code, stdout, stderr) {
      response = stdout;
      res.json({response: response});
    });
  }
}

function updateIndex(req, res) {
  const creator=req.body.creator, owner=req.body.owner, isLearningProvider=req.body.isLearningProvider,
    llpcAddress = req.body.llpcAddress, registrarAddress = req.body.registrarAddress, indexContractAddress=req.body.indexContractAddress, recordType = req.body.recordType;
  let response = "";
  if (!shell.which('/opt/ethereum/build/bin/geth')) {
    response = "geth is required for this";
    res.json({response: response});
    return null;
  } else {
    const params = "{0} {1} {2} {3} {4} {5} {6} {7}".format(creator, owner, llpcAddress, isLearningProvider, recordType, "2100000", registrarAddress, indexContractAddress);
    shell.exec('/home/patrick/index_contract_updater.sh {0}'.format(params), function (code, stdout, stderr) {
      response = stdout;
      res.json({response: response});
    });
  }
}

function registerAccount(req, res) {
  const creator=req.body.creator, owner=req.body.owner, isLearningProvider=req.body.isLearningProvider,
    userStatus = req.body.userStatus, registrarAddress = req.body.registrarAddress,
    indexContractAddress=req.body.indexContractAddress, otherId = req.body.otherId;
  let response = "";
  if (!shell.which('/opt/ethereum/build/bin/geth')) {
    response = "geth is required for this";
    res.json({response: response});
    return null;
  } else {
    const params = "{0} {1} {2} {3} {4} {5} {6} {7}".format(creator, owner, otherId, isLearningProvider, userStatus,
      "4700000", registrarAddress, indexContractAddress);
    shell.exec('/home/patrick/register_account.sh {0}'.format(params), function (code, stdout, stderr) {
      response = stdout;
      res.json({response: response});
    });
  }
}

module.exports = router;
