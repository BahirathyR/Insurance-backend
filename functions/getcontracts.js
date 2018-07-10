'use strict';


const hash = require('../models/contractHash');
//const nem = require("nem-sdk").default;


exports.getcontract = ((i) =>{
   
   return new Promise((resolve, reject) => {

    hash.find({})
    .then((txHashOfContract) =>{
       console.log(txHashOfContract.length)
       var len = txHashOfContract.length;
        var hash =txHashOfContract[len-1]._doc.hash;
        console.log("hash from mongo",hash)

    var txHash = hash;
        // Create another endpoint because this request need special nodes
//      

            
          
        })

	})
    })

