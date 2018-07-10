
'use strict';
var bcSdk = require('../fabcar/invoke.js');
const tpaupdate= require('../models/updatetpa')

// var express = require('express');
// var router = express.Router();
// var cors = require('cors');
// var bodyParser = require('body-parser');
// var bcSdk = require('../fabcar/query');
// var user = 'rathy';
// var affiliation = 'supplychain';
// var requestid=requestid;

exports.updatetpa=(userId,transactionstring)=>{

    return new Promise((resolve,reject)=>{
        const newupdate = new tpaupdate({

        // bcSdk.tpa({
            userId: userId, 
            transactionstring:transactionstring
        })
        newupdate.save()
        .then((result) => resolve({status: 201, message: 'success'}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'already they are having insurance application!'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }

            var str=JSON.stringify(transferObj)
       
            if(status == "Rejected"){
                new Promise(async(resolve,reject)=>{
                if(HospitalName=="Apollo"){
                    console.log("Appollo TPAupdate");

                    // AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
                }
                if(HospitalName=="Fortis")
                {
                    console.log("Fortis TPAupdate");

                    // AddressOfProvider="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2"   
                }
               

                if(status == "Approved"){
                    new Promise(async(resolve,reject)=>{
                  
                       if(HospitalName=="Apollo"){
                        //    AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
                       }
                       if(HospitalName=="Fortis"){
                        //    AddressOfProvider="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2"   
                       }


                       return   resolve({"status":200,
                       "message":"approved"})
               })
                   }
                 return  resolve({"status":200,
               "messsage":"object updated"})

               }).catch(err=>{console.log(err)})
            }
           })
           })
        };


//         Tpa.find({ _id:id}).then(result=>{
            
    

//             var report = result
//             var HospitalName=report[0]._doc.HospitalName
//             var rapidID= report[0]._doc.rapidID
//             var submitID= report[0]._doc.submitID
//             var transferObj={"id":id,
//                 "rapidID":rapidID,
//         "submitID":submitID,
//         "message":message,
//         "status":status
//     }
//         var str=JSON.stringify(transferObj)
       
//             if(status == "Rejected"){
//                 new Promise(async(resolve,reject)=>{
//                 if(HospitalName=="Apollo"){
//                     console.log("Appollo TPAupdate");

//                     // AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
//                 }
//                 if(HospitalName=="Fortis")
//                 {
//                     console.log("Fortis TPAupdate");

//                     // AddressOfProvider="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2"   
//                 }
               

//                 if(status == "Approved"){
//                     new Promise(async(resolve,reject)=>{
                  
//                        if(HospitalName=="Apollo"){
//                         //    AddressOfProvider="MALSD5RR7YN4YSFTQWOLJURZ2OINSME4GD5RBHZJ"
//                        }
//                        if(HospitalName=="Fortis"){
//                         //    AddressOfProvider="MBAPHIOTSEORVR5DMJGVOCAWC2HE4PH2JTBVHTG2"   
//                        }


//                        return   resolve({"status":200,
//                        "message":"approved"})
//                })
//                    }
//                  return  resolve({"status":200,
//                "messsage":"object updated"})

//                }).catch(err=>{console.log(err)})
//             }
//            })
//            })
        
// };

// const  loanpage = require('../models/loandetails');


// exports.approveloan = (requestid,transactionstring) => {
    
// return new Promise((resolve, reject) => { 
   

//     const newapprove = new loanpage({

//            // userid: userid,
//            requestid: requestid,
//            transactionstring:transactionstring
            
        
//     });
//     newapprove.save()
//         .then((result) => resolve({status: 201, message: 'success'}))
//         .catch(err => {

//             if (err.code == 11000) {

//                 reject({status: 409, message: 'already they are having loan application!'});

//             } else {

//                 reject({status: 500, message: 'Internal Server Error !'});
//             }
//         });
//     });