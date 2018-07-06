'use strict';

const  loanpage = require('../models/patientdetails');
//const user = require('../models/fetchdata');



exports.patientdetails = (requestid,transactionstring) => {
    
return new Promise((resolve, reject) => { 
   

    const newloanpage = new loanpage({

           // userid: userid,
           requestid: requestid,
           transactionstring:transactionstring
            
        
    });
    newloanpage.save()
        .then((result) => resolve({status: 201, message: 'success'}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'already they are having loan application!'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
    });
};
