'use strict';

// const creditscore = require('./functions/creditscore');
const login = require('./functions/login');
const registerUser = require('./functions/registerUser');
const Hospital=require('./functions/Hospital');
const Authorisation=require('./functions/Authorisation');
const mockWeather = require('./functions/mockWeather');
var crypto = require('crypto');
var fs = require('fs');
var cors = require('cors');
//const nem = require("nem-sdk").default;
const tpaNem= require("./functions/tpanem")
var tpaApproval=require("./functions/Tpaapproval.js")
const register1 = require('./functions/register');
 const contractJs = require('./functions/contract');
 const fetchcontract = require('./functions/getcontracts');
 const payer=require("./functions/payer");

var user = require('./models/accounts');
var config = require('./config.json')
var oneday= require('./functions/oneday')
var recordHistory= require('./functions/history')
// const loan = require('./functions/loan');
const getpatientdetails = require('./functions/getpatientdetails');
// const getdetailsuser = require('./functions/getdetailsuser');
// const getparticulardetails = require('./functions/getparticulardetails');
const getHistory = require('./functions/getHistory');
// const readRequest = require('./functions/readRequest');
// const preclosing = require('./functions/preclosing');
// const loanschedule = require('./functions/loanschedule');
// const getloanschedule = require('./functions/getloanschedule');
// const approveloan = require('./functions/approveloan');
const updatetpa=require('./functions/updatetpa');
const tpaupdate=require('./functions/updatetpa');
const updatetransaction = require('./functions/updatetransaction');
 const updateDischargeSummary = require('./functions/updateDischargeSummary');

const savetransaction = require('./functions/savetransaction');
const register = require('./models/register');
const readIndex = require('./functions/readIndex');


var cors = require('cors');
var mongoose = require('mongoose');

var Promises = require('promise');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var Photo = require('./models/document');
var path = require('path');



module.exports = router => {
    // router.post('/mock',cors(),function(req,res){
    //     console.log(req.body);
    //     res.send({message:"mock mock"})
    
    // }

    

// router.post('/registerUser', cors(),function(req,res)
// {

// const walletName = req.body.walletName;
// // Set a password
// const password = "123";
// // Create PRNG wallet
// const nem_id = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.mijin.id);

// var endpoint =nem.model.objects.create("endpoint")("http://b1.nem.foundation", "7895");
// // Create a common object
//  var common = nem.model.objects.create("common")(password, "");

// // // // Get the wallet account to decrypt

//  var walletAccount = nem_id.accounts[0];

// // // Decrypt account private key 
//  nem.crypto.helpers.passwordToPrivatekey(common, walletAccount, "pass:bip32");

// // // The common object now has a private key
//  console.log("my private key :"+ JSON.stringify(common.privateKey))
//  const privateKey = common.privateKey;


//             register.registerUser(nem_id,privateKey)

//             .then(result => {
                
        
//                         res.status(result.status).json({
//                             message: result.message
                          
//                         });
    
//                     })
//                     .catch(err => res.status(err.status).json({message: err.message}).json({status: err.status}));
            
//         });
//=============================================create discharge summary==============================================================//
        router.post('/createContract', cors(),function(req,res){

        var conditions =req.body.patientData;
                        var HospitalName=req.body.HospitalName;
                        var submitID=req.body.SubmitId;
                        var status = req.body.status;
                        var TotalClaimedAmount=req.body.TotalClaimedAmount
         
             contractJs.createContract(conditions,HospitalName,submitID,status,TotalClaimedAmount)
             .then(result => {
                
        
                        res.status(result.status).json({
                            message: result.message
                          
                        });
    
                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });

//============================================mock weather====================================================//         
router.get('/trigger',cors(),function(req,res){


    var jsonfile = require('jsonfile')
    var file = './payer_provider.json'
    jsonfile.readFile(file, function(err, obj)
    {
     if(err){
        res.send({"code":404,
        "message":"no contract created yet",
            "error":err})
         }    

   
             mockWeather.mock(obj)
             .then(result => {
                        console.log(result)
                        res.status(200).json({
                         message: "conditions satisfied for the users below"
                        });
    
                    }) .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                })
               
                   
                });
    
            

//==========================Tpa=====================================================================//
router.get('/Tpa',cors(),function(req,res){
   
        tpaApproval.mock()
             .then(result => {
                        console.log(result)
                        res.status(result.status).json({
                            patients:result.patients 
                        });
    
                    }) .catch(err => res.status(err.status).json({
                        message: err.message
                    }))
                });
            
//===========================tpa changing status=========================================================//
router.post('/Tpaupdate',cors(),function(req,res){
   var status= req.body.status;
   var id=req.body.id;
   var message=req.body.message;

    tpaNem.mocknem(status,id,message)
         .then(result => {
                    console.log(result)
                    res.status(200).json({
                        message:"dataset triggered "
                    });
                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            });
        
//====================================payer page=============================================//
router.get('/payerpay',cors(),function(req,res){
   
    payer.mock()
         .then(result => {
                    console.log(result)
                    res.status(result.status).json({
                        patients:result.message 
                    });

                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            });
//=======================================fortis dashboard api====================================================//
router.post("/HospitalDashboard",cors(),function(req,res){
    var HospitalName= req.body.HospitalName;
    Hospital.DashBoard(HospitalName).then(reports=>{
        res.send({
            "status":200,
            "patients":reports.message
        })
    })
})

//=========================================24hrs trigger===============================================//
router.get("/24hrs",cors(),(req,res)=>{
    oneday.oneday().then((results)=>{
            console.log(results)
            res.send({"status":200,
        "message":results.message})
    })
})
//===============================history api==============================================================//
router.post("/history",cors(),(req,res)=>{
    var id=req.body.id
    recordHistory.history(id).then(result=>{
        
            console.log(result)
            res.status(result.status).json({
                history:result.message 
            });

        }) .catch(err => res.status(err.status).json({
            message: err.message
        }))
    });
//=================update discharge summary=======================================//
router.post("/updateDischargeSummary",cors(),(req,res)=>{
    var id=req.body.id
    updateDischargeSummary.update(id).then(result=>{
        
            console.log(result)
            res.status(result.status).json({
                history:result.message 
            });

        }) .catch(err => res.status(err.status).json({
            message: err.message
        }))
    });

//    router.post('/creditscore', cors(), (req, res) => {

//         console.log("credit....>>>",req.body);
//         console.log("entering register function in functions ");
//         const requestid = parseInt(req.body.records);
//         console.log(requestid);
       


//         creditscore
//             .creditscore(requestid)
//             .then(result => {

//                 console.log("res123----",result);
//                 res.status(result.status).json({
//                     message: "credit score generated ",
//                     creditscore: result.creditscore


//                 });

//             })
//             .catch(err => res.status(err.status).json({
//                 message: err.message
//             }).json({
//                 status: err.status
//             }));

//     }); 


//     router.post('/registerUser', cors(), (req, res) => { 

//         const firstname = req.body.firstname;
//         console.log(firstname);
//         const lastname = req.body.lastname;
//         console.log(lastname);
//         const phonenumber = parseInt(req.body.phonenumber);
//         console.log(phonenumber);
//         const dateofbirth = req.body.dateofbirth;
//         console.log(dateofbirth);
//         const email = req.body.email;
//         console.log(email);
//         const password = req.body.password;
//         console.log(password);
//         const retypepassword = req.body.retypepassword;
//         console.log(retypepassword);
//         const usertype = req.body.usertype;
//         console.log(usertype);
//         var  userId = "";
//         var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
//         for (var i = 0; i < 3; i++)
//             userId += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
//         console.log("userId" + userId)


//         if (!firstname || !lastname || !phonenumber|| !dateofbirth || !email || !password || !retypepassword || !usertype || !userId) {

//             res
//                 .status(400)
//                 .json({
//                     message: 'Invalid Request !'
//                 });

//         } else {

//             registerUser
//                 .registerUser(firstname, lastname, phonenumber,dateofbirth,email,password, retypepassword,usertype,userId)
//                 .then(result => {

//                     res.send({
//                         "message": "user has been registered successfully",
//                         "status": true,


//                     });


//                 })
//                 .catch(err => res.status(err.status).json({
//                     message: err.message
//                 }).json({
//                     status: err.status
//                 }));
//         }
//     });

//     router.post('/login', cors(), (req, res) => {
//         console.log("entering login function in functions ");
//         const emailid = req.body.email;
//         console.log(emailid);
//         const passwordid = req.body.password;
//         console.log(passwordid);
       
       
//         login
//             .loginUser(emailid, passwordid)
//             .then(result => {   
//                 console.log("result ===>>>",result.users.usertype)


//                 res.send({
//                     "message": "Login Successful",
//                     "status": true,
//                     "usertype":result.users.usertype,
//                     "userId":result.users.userId

//                 });

//             })
//             .catch(err => res.status(err.status).json({
//                 message: err.message
//             }).json({
//                 status: err.status
//             }));

//     });
//     cloudinary.config({
//         cloud_name: 'diyzkcsmp',
//         api_key: '188595956976777',
//         api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'
//     });

//     router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
//         console.log("req123..",req.body)
//         const id = req.query['requestid'];
//         console.log(id)
//         var photo = new Photo(req.body);
//         console.log("req.files.image" + JSON.stringify(req.files));
//         var imageFile = req.files.file.path;
//         cloudinary
//             .uploader
//             .upload(imageFile, {
//                 tags: 'express_sample'
//             })
//             .then(function(image) {
//                 console.log('** file uploaded to Cloudinary service');
//                 console.dir(image);
//                 photo.url = image.url;
//                 photo.requestid = id;
//                 // photo.claimno = claimno;
//                 // Save photo with image metadata
//                 return photo.save();
//             })
//             .then(function(photo) {

//                 res.send({
//                     url: photo._doc.url,
//                     //claimno: photo._doc.claimno,
//                     message: "files uploaded succesfully"
//                 });
//             })
//             .finally(function() {

//                 res.render('photos/create_through_server', {
//                     photo: photo,
//                     upload: photo.image
//                 });
//             });
//     });

//     router.get('/images/id', cors(), (req, res) => { 
     
//         console.log("req123..",req.body)
//         const id = req.query['requestid'];
//         console.log(id)
  
//     //     console.log("req123...",req.body)
//     //     const id = req.body.requestid
//     //    console.log("id" + id);
//         Photo
//             .find({
//                 "requestid": id
//             })
//             .then((images) => {
//                 console.log("enter in to the photo",images);
//                 var image = [];
//                 console.log("length",images.length);
//                 for (let i = 0; i < images.length; i++) {
//                     image.push(images[i]._doc)

//                 }

//                 res.send({
//                     images: image,
//                     message: "image fetched succesfully"
//                 });
//             })

//     });




    router.post('/patientdetails', cors(), (req, res) => {
        console.log("body========>",req.body)
        // const requestid = req.body.requestid;
        // console.log("line number 203----->",requestid);
        // var requestid = "";
        // var possible = "0123456789674736728367382772898366377267489457636736273448732432642326734"
        // for (var i = 0; i < 3; i++)
        //     requestid += (possible.charAt(Math.floor(Math.random() * possible.length))).toString();
        // console.log("requestid" + requestid)
        const userId = req.body.userId;
        console.log("userId",userId);
        var transactionstring =req.body.transactionstring;
        console.log("line number 212-------->",transactionstring)
    


        //  loan.loandetails(requestid, transactionstring)

        savetransaction.savetransaction(userId,transactionstring)
            
        .then(result => {

                console.log(result);
                res.send({
                    "message": result.message,
                    // "requestid": requestid,
                    "status": true


                });
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));

    });

//  router.get('/getdetailsuser', cors(), (req, res) => {
       
//         getdetailsuser
//                 .getdetailsuser()

//                 .then(function(result) {
//                     console.log("result---",result)

//                     res.send({
//                         status: result.status,
//                         message: result.usr
//                     });
//                 })
//                 .catch(err => res.status(err.status).json({
//                     message: err.message
//                 }));


//     }); 


//     router.get('/getparticulardetails', cors(), (req, res) => {
//        if (1 == 1) {
            
//                         const requestid1 = checkToken(req);
//                         console.log("requestid1", requestid1);
//                         const requestid = requestid1;
            
            
//                         getparticulardetails.getparticulardetails(requestid)
//                         .then(function(result) {
//                             console.log("requestid1",requestid1)
//                             console.log("result.query",result.query)
//                               return res.json({
//                                  "status":200,
//                                  "message": result.query
//                              });
//                          })
//                          .catch(err => res.status(err.status).json({
//                              message: err.message
//                          }));
//                  } else {
//                      res.status(401).json({
//                          "status": false,
//                          message: 'cant fetch data !'
//                      });
//                  }
//                 });

                router.post('/getHistory',(req,res)=>{
                    console.log("requ...123>>>ui>>>",req.body);
                    const userId = req.body.userId;
                    console.log("userId", userId);
                    

                           getHistory.getHistory (userId)
                                .then(result=>{
                                    console.log("result....123>>>",result);
                                   res.status(result.status).json({
                                    result:result.docs,

                                })
                            })
                            
                           .catch(err => res.status(err.status).json({
                                message: err.message
                            }).json({
                                status: err.status
                            }));
                        })
                        

    router.post('/savetransaction', cors(), (req, res) => {
        var name = req.body.name;
        var transactionstring = JSON.stringfy(req.body.transactionstring);
        var requestid = req.body.requestid;

        savetransaction
            .savetransaction(name, transactionstring, requestid)
            .then(function(result) {
                console.log(result)

                res.send({

                    message: "entered successfully"
                });
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));


    });

    router.post('/updatetpa', cors(), (req, res) => {
        // var status= req.body.status;
   var userId=req.body.userId;
   var transactionstring=req.body.transactionstring;
    //     console.log(req.body)
    //    const userId =req.body.id ;
    //     console.log(userId);
    //     const transactionstring = req.body.transactionstring;
    //     console.log(transactionstring);
    //     console.log("legal..123>>>",transactionstring.legal)

        // if (transactionstring.legal =="approved") {
            
        //     res
        //         .status(200)
        //         .json({
        //             message: 'Your Request has been approved !'
        //         });

        // } else {
        //      res
        //         .status(200)
        //         .json({
        //             message: 'Your Request has been rejected !'
        //         });
        //     }
        updatetpa.updatetpa(userId,transactionstring)
         .then(result => {
                    console.log(result)
                    res.status(200).json({
                        message:"dataset triggered "
                    });
                }) .catch(err => res.status(err.status).json({
                    message: err.message
                }))
            

        updatetransaction
        .updatetransaction(userId,transactionstring)
        .then(result =>  {
            console.log("result....",result)     
        
        })
    });



    router.post("/HospitalDashboard",cors(),function(req,res){
        var HospitalName= req.body.HospitalName;
        Hospital.DashBoard(HospitalName).then(reports=>{
            res.send({
                "status":200,
                "patients":reports.message
            })
        })
    })



    // router.get('/trigger',cors(),function(req,res){

    //     console.log("1");
    //     var jsonfile = require('jsonfile')
    //     var file = './payer_provider.json'
    //     jsonfile.readFile(file, function(err, obj)
    //     {
    //         console.log("2");
    //      if(err){
    //         res.send({"code":404,
    //         "message":"no contract created yet",
    //             "error":err})
    //          }    
    
       
    //              mockWeather.mock(obj)
    //              .then(result => {
    //                         console.log(result)
    //                         res.status(200).json({
    //                          message: "conditions satisfied for the users below"
    //                         });
        
    //                     }) .catch(err => res.status(err.status).json({
    //                         message: err.message
    //                     }))
                    
                   
                       
//              });
               
                   
            //   **********************************************************
            // router.get('/trigger',cors(),function(req,res){


            //     var jsonfile = require('jsonfile')
            //     var file = './payer_provider.json'
            //     jsonfile.readFile(file, function(err, obj)
            //     {
            //      if(err){
            //         res.send({"code":404,
            //         "message":"no contract created yet",
            //             "error":err})
            //          }    
            
               
            //              mockWeather.mock(obj)
            //              .then(result => {
            //                         console.log(result)
            //                         res.status(200).json({
            //                          message: "conditions satisfied for the users below"
            //                         });
                
            //                     }) .catch(err => res.status(err.status).json({
            //                         message: err.message
            //                     }))
            //                 })
                           
                               
            //                 });
                  
    //     // var HospitalName= req.body.HospitalName;
    //     // var patientname= req.body.patientname;
    //     // var userId=req.body.userId;
    //     // var disease=req.body.disease;
    //     // var amount=req.body.amount;
    //     var userId=req.body.userId;
    //     var transactionstring=req.body.transactionstring;
    //     Authorisation.Authorisation(userId,transactionstring).then(reports=>{
            
    //         savetransaction.savetransaction(userId,transactionstring)
            
    //     .then(result => {

    //             console.log(result);
    //             res.send({
    //                 "message": result.message,
    //                 // "requestid": requestid,
    //                 "status": true


    //             });
    //         })

    //         .catch(err => res.status(err.status).json({
    //             message: err.message
    //         }).json({
    //             status: err.status
    //         }));
    // });

    // router.post('/approveloan', cors(), (req, res) => {
    //     console.log(req.body)
    //    const userId =req.body.id ;
    //     console.log(userId);
    //     const transactionstring = req.body.transactionstring;
    //     console.log(transactionstring);
    //     console.log("legal..123>>>",transactionstring.legal)

    //     if (transactionstring.legal =="approved") {
            
    //         res
    //             .status(200)
    //             .json({
    //                 message: 'Your Request has been approved !'
    //             });

    //     } else {
    //          res
    //             .status(200)
    //             .json({
    //                 message: 'Your Request has been rejected !'
    //             });
    //         }

    //     updatetransaction
    //     .updatetransaction(userId,transactionstring)
    //     .then(result =>  {
    //         console.log("result....",result)     
        
    //     })
    // });


    // router.get("/readRequest", (req, res) => {
    //     //    var requestList = [];

    //     if (1 == 1) {

    //         const requestid = checkToken(req);
    //         console.log("requestid1", requestid);
    //         const requestid1 = requestid;


    //         readRequest.readRequest(requestid)
    //             .then(function(result) {
    //                 readAlldata = result.query;
    //                 console.log("readAlldata ---", readAlldata);
    //                 return res.json({
    //                     "status": 200,
    //                     "message": result.query
    //                 });
    //             })
    //             .catch(err => res.status(err.status).json({
    //                 message: err.message
    //             }));
    //     } else {
    //         res.status(401).json({
    //             "status": false,
    //             message: 'cant fetch data !'
    //         });
    //     }
    // });

    // router.post('/preclosingUser', cors(), (req, res) => {

    //             const requestid = req.body.requestid;
    //             console.log(requestid);

    //             const emiremaining = req.body.emiremaining;
    //             console.log(emiremaining);
        
    //             const penaltyforclosure = req.body.penaltyforclosure;
    //             console.log("penalty",penaltyforclosure);
        
    //             const installmentpermonth = req.body.installmentpermonth;
    //             console.log(installmentpermonth);
    //             const documentrequiredforclosing = req.body.documentrequiredforclosing;
    //             console.log(documentrequiredforclosing);
    //             const paymentmode = req.body.paymentmode;
    //             console.log(paymentmode);
        
    //             if (!requestid||!emiremaining || !penaltyforclosure || !installmentpermonth || !documentrequiredforclosing || !paymentmode) {
        
    //                 res
    //                     .status(400)
    //                     .json({
    //                         message: 'Invalid Request !'
    //                     });
        
    //             } else {
        
    //                 preclosing
    //                     .preclosingUser(requestid,emiremaining,penaltyforclosure,installmentpermonth,documentrequiredforclosing,paymentmode)
    //                     .then(result => {
        
    //                         res.send({
    //                             "message": "preclosing request accepted",
    //                             "status": true,
        
    //                         });
        
        
    //                     })
    //                     .catch(err => res.status(err.status).json({
    //                         message: err.message
    //                     }))
    //             }
    //         });

    //       router.post('/loanscheduleUser', cors(), (req, res) => {

    //             console.log("ui....123>>>",req.body);
    //             const requestid = req.body.requestid;
    //             console.log(requestid);
    //             const transactionstring = req.body.transactionstring;
    //             console.log(transactionstring);
                
    //                      loanschedule
    //                          .loanscheduleUser(requestid,transactionstring)
    //                             .then(result => {
    //                                 if(!requestid) {
    //                                     res
    //                                     .status(400)
    //                                     .json({
    //                                         message: 'Invalid Request !'
    //                                     });
    //                                 } 
    //                                 else {
    //                                 updatetransaction
    //                                 .updatetransaction(requestid,transactionstring)
    //                                 .then(function(result) {
    //                                     console.log("result....",result)                                    
    //                                 res.send({
    //                                     "message": "loanschedule created successfully",
    //                                     "status": true,
                
    //                                 });
                
                
    //                             })
                            
    //                             .catch(err => res.status(err.status).json({
    //                                 message: err.message
    //                             }))
    //                         }
    //                         });
                        
    //                 }); 

    //                 router.get('/getloanschedule', cors(), (req, res) => {

    //                             console.log(req.body);
    //                             console.log(req.body.requestid);
    //                             var requestid = req.body.requestid;
    //                             getloanschedule
    //                                 .getloanschedule(requestid)
    //                                 .then(function(result) {
    //                                     console.log(result)
                        
    //                                     res.send({
    //                                         status: result.status,
    //                                         message: result.usr
    //                                     });
    //                                 })
    //                                 .catch(err => res.status(err.status).json({
    //                                     message: err.message
    //                                 }));
                        
                        
    //                         }); 

                             router.get("/getpatientdetails", cors(), (req, res) => {
                                
                                                                       
                                            var startKey = '000';
                                            console.log("startKey", startKey);
                                            var endKey = '999';
                                            console.log("endKey--", endKey);
                                
                                            getpatientdetails
                                            .getpatientdetails(startKey, endKey)
                                                .then(function(result) {

                                                    console.log("  result.query1234..>>>", result.query);
                                                    console.log("  result.querykey..>>>", result.query.Key);
                                                    res.status(result.status).json({message:result.query})
                                                })
                                                .catch(err => res.status(err.status).json({
                                                    message: err.message
                                                }));
                                       

                                    });


                                   /* router.post('/creditscore', cors(), (req, res) => {
                                        console.log("entering in to the update trans",req.body);

                                        var body = req.body
                                        var requestid = body.id;
                                        var transactionstring = body.transactionstring;
                                        
                                        console.log("entering in to the upda trans",requestid,transactionstring);

                                            creditscore
                                            .creditscore(requestid)
                                            .then(results => {
                                               console.log("results123......>>>>",results.creditscore);
                                                var creditscore = results.creditscore
                                                console.log("transactionstring",transactionstring);
                                                console.log("transactionstring",req.body.creditscore);

                                                var updatedString = ""
                                                if(body.creditscore == ""){
                                                    console.log("creditscore ++++++++++>>>>>");
                                                updatedString= {
        
                                                    "creditscore":""
                                                } 
                                        
                                            }
                                            else{
                                                console.log("creditscore notnull ++++++++++>>>>>");
                                                
                                                updatedString= {

                                                    "creditscore": creditscore
                                                }
                                                
                                            
                                            } 
                                            updatetransaction
                                            .updatetransaction(requestid,updatedString)
                                            .then(function(result) {
                                                console.log("result....",result)                                    
                                
                                                res.send({
                                
                                                    message: result.message,
                                                    results:results.creditscore
                                                });
                                            })
                                        
                                            .catch(err => res.status(err.status).json({
                                                message: err.message
                                            }));
                                            
                                    })
                                        
                                    }); */ 


   router.post('/updatetransaction', cors(), (req, res) => {
    
        console.log("entering in to the update trans.....ui",req.body);
        
         var body = req.body
        var userId = body.id;
      var transactionstring = body.transactionstring;
      
                                                
  console.log("entering in to the upda trans",userId,transactionstring);

  

        updatetransaction.updatetransaction(userId,transactionstring)
        
        
        .then(result => {
            if(!userId) {
                res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
            }

                //console.log(result);
                else {
                res.send({
                    "message": result.message,
                    "status": true


                });
            }
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }).json({
                status: err.status
            }));

    }); 
    // router.post("/updateDischargeSummary",cors(),(req,res)=>{
    //     var userId=req.body.userId
    //     updatetransaction.update(userId).then(result=>{
            
    //             console.log(result)
    //             res.status(result.status).json({
    //                 history:result.message 
    //             });
    
    //         }) .catch(err => res.status(err.status).json({
    //             message: err.message
    //         }))
    //     });
//         router.post('/updateDischargeSummary', cors(), (req, res) => {
//                 console.log(req.body)
//                const userId =req.body.userId ;
//                 console.log(userId);
//                 const transactionstring = req.body.transactionstring;
//                 console.log(transactionstring);
//                 console.log("legal..123>>>",transactionstring.legal)
        
               
        
//                 updatetransaction
//                 .updatetransaction(userId,transactionstring)
//                 .then(result =>  {
//                     console.log(result)
//                 res.status(result.status).json({
//                     history:result.message 
//             //     });
    
//             // }) .catch(err => res.status(err.status).json({
//             //     message: err.message
//             // })); 
                
                
            
//             // });
    
        



// //      router.get("/readIndex", cors(), (req, res) => {

// //           if (1==1) {
                                            
// //             readIndex
// //               .readIndex({})
//                     .then(function(result) {
//                     console.log("result",result);
//                      var firstrequest = result.query[0]
//                        console.log("firstrequest--", firstrequest);
//                        var length = result.query.length;
//                         var lastrequest = result.query[length - 1];
//                           console.log("lastrequest--", lastrequest);
//                           console.log("query",result);
                                            
//                                        return res.json({
//                                                 "status": 200,
//                                                 "result": result
//                                                        });
//                                                    })
//                                                 .catch(err => res.status(err.status).json({
//                                                      message: err.message
//                                                     }));
//                                                     } else {
//                                                         res
//                                                             .status(401)
//                                                             .json({
//                                                                 "status": false,
//                                                                 message: 'cant fetch data !'
//                                                             });
//                                                     }
//                                                 });
                                            


            

    function checkToken(req) {

        const token = req.headers['authorization'];

        if (token) {

            try {
                (token.length != 0)
                return token
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }

    function getrapidID(req) {
        
               const token = req.headers['x-access-token'];
        
               if (token) {
        
                   try {
        
                     //  var decoded = jwt.verify(token, config.secret);
                    
                        return decoded.register.userId;
        
        
                   } catch (err) {
        
                       return false;
                    }
        
               } else {
        
                   return false;
                }
            }
        }


