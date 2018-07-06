var bcSdk = require('../fabcar/query');
const user = require('../models/patientdetails');
//const user = require('../models/fetchdata');

       
        exports.getparticulardetails = (requestid) => {
            return new Promise((resolve, reject) => {
                console.log("entering into readRequest function.......!")
                
                bcSdk.getparticulardetails({
                    requestid: requestid 
                })
        
                .then((requestarray) => {
                    console.log("data in requestArray " + JSON.stringify (requestarray))
        
                    return resolve({
                        status: 200,
                        query: requestarray
                    })
                })
        
                .catch(err => {
        
                    if (err.code == 401) {
        
                        return reject({
                            status: 401,
                            message: 'cant fetch !'
                        });
        
                    } else {
                        console.log("error occurred" + err);
        
                        return reject({
                            status: 500,
                            message: 'Internal Server Error !'
                        });
                    }
                })
            })
        };
       
       
       
        // bcSdk.getparticulardetails(requestid)
        
        

      /*  user.find({
            "requestid":requestid
        })
            
            .then(users => {
                console.log("users", users)
               
                resolve({
                    status: 201,
                    usr: users
                })

            })*/

           
//             .catch(err => {

//                 if (err.code == 11000) {

//                     return reject({
//                         status: 409,
//                         message: 'cant fetch !'
//                     });

//                 } else {
//                     console.log("error occurred" + err);

//                     return reject({
//                         status: 500,
//                         message: 'Internal Server Error !'
//                     });
//                 }
//             })
//     })
// };
