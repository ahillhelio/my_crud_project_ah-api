const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require('assert');
 
// Connection URL
const url = process.env.DB_URL;

const dbName = 'my_crud_project_ah';
const colName = "tc_provinces";
const settings = { useUnifiedTopology: true }

const invalidCountry = (country) => {
        let result ;
        if(!country.countryname){
            result = "Requires a Country Name";
        } else if (!country.walkinghours){
            result = "Requires Walking Hours";
        } //else if (!validURL(country.link)) {
           // result = "Link not valid URL";
        //}

        return result;
}

const validURL = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
   }

const getProvince = () => {
    
    const iou = new Promise ((resolve,reject) => {
        
        MongoClient.connect(url, settings, function(err, client) {
            if(err){
                reject(err);
            } else {
                console.log("Connected successfully to GET Province");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({}).toArray(function(err, docs) {
                        if (err) {
                            reject(err);
                        } else { 
                            console.log("Found the Following");
                            console.log(docs);
                            resolve(docs);
                            client.close();
                        }
                        
                 });    
            }
        });
    });
    return iou;
}

const addProvince = (province) => {
    
   
    const iou = new Promise ((resolve,reject) => {
        if (!Array.isArray(province)){
            reject({ error: "Need to send an array of province info"})
         
        } else {
            const invalidProvince = province.filter((country) => {
                const check = invalidProvince(province);
                if(check){
                    province.invalid = check;
                }
                return province.invalid;
            });
            if (invalidProvince.length > 0){
                reject({
                    error: "Some entries were invalid",
                    data: invalidProvince
                })
            }else{

            
            MongoClient.connect(url, settings, async function (err,client){
                if(err){
                    reject(err);
                } else{
                    console.log("Connected successfully to server to POST Article");
                    const db = client.db(dbName);
                    const collection = db.collection(colName)
                    // province.forEach((province) => {
                    //         province.dateAdded = new Date(Date.now()).toUTCString(); 
                    // });
                    const results = await collection.insertMany(province); 
                    resolve(results.ops);
                }
            

            })
          }
        }
    });
    return iou;
}

const updateCountry = (id, country) => {
    const iou = new Promise((resolve,reject) => {
        if(country.link) {
                if(!validURL(country.link)){
                    country.invalid = "link not validURL";
                    reject(country);
                }
            }
            MongoClient.connect(url, settings, function(err, client) {
                if(err){
                    reject(err);
                }else{
                    console.log("connected successfully to server to PATCH a Country");
                    const db = client.db(dbName);
                    const collection = db.collection(colName);
                    try {
                        const _id = new ObjectID(id);
                        collection.updateOne({_id},
                            { $set: {...country} },
                            function(err, data){
                                if(err) {
                                    reject(err);
                                }else{
                                    if(data.result.n > 0){
                                        collection.find({_id}).toArray(
                                            function(err, docs){
                                                if(err){
                                                    reject(err);
                                                } else {
                                                    resolve(docs[0]);
                                                };
                                        })
                                        
                                    }else{
                                        resolve({error: "Nothing Updated"});
                                    }
                                    
                                }
                            });

                    } catch (err) {
                        console.log(err);
                        reject({error: "ID has to be in Object ID format"});
                    }
                }

            });
    });

    return iou;
}

const deleteCountry = (id) => {
    const iou = new Promise ((resolve,reject) => {
        MongoClient.connect(url, settings, async function (err, client) {
            if(err){
                reject(err);
            } else {
                console.log("connected successfully to server to DELETE a Country");
                const db = client.db(dbName);
                const collection = db.collection(colName);
               try {
                const _id = new ObjectID(id);
                collection.findOneAndDelete({ _id }, function(err, data){
                    if(err){
                        reject(err);
                    }else {
                        if(data.lastErrorObject.n > 0){
                            resolve(data.value);
                        } else{
                            resolve({error: "ID doesn't exist"});
                        }
                    }
                });
             } catch(err){
                 console.log(err);
                 reject({error: "ID has to be in ObjectID format"});
             }
            }
        })    
    });

    return iou;
}

module.exports = { 
    getProvince,
    addProvince,
    updateCountry,
    deleteCountry
}