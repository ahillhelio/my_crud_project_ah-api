const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require('assert');
 
// Connection URL
const url = process.env.DB_URL;

const dbName = 'my_crud_project_ah';
const colName = "tc_provinces";
const settings = { useUnifiedTopology: true }

const invalidProvince = (province) => {
        let result ;
        if(!province.il){
            result = "Requires a Name";
        } else if (typeof province.visited !="boolean"){
            result = "Has this province been visited?";
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

const createProvince = (province) => {
    
   
    const iou = new Promise ((resolve,reject) => {
        if (!Array.isArray(province)){
            reject({ error: "Need to send an array of province info"})
         
        } else {
            const invalidProvinces = province.filter((province) => {
                const check = invalidProvince(province);
                if(check){
                    province.invalid = check;
                }
                return province.invalid;
            });
            if (invalidProvinces.length > 0){
                reject({
                    error: "Some entries were invalid",
                    data: invalidProvinces
                })
            }else{

            
            MongoClient.connect(url, settings, async function (err,client){
                if(err){
                    reject(err);
                } else{
                    console.log("Connected successfully to server to POST Article");
                    const db = client.db(dbName);
                    const collection = db.collection(colName)
                   //NOT SURE ABOUT BELOW:
                   collection.insertMany (province, (err, result) => {
                       if(err){
                           reject(err);
                       } else {
                           resolve(result.ops); 
                           client.close();
                       }
                   })


                }
            

            })
          }
        }
    });
    return iou;
}
//const updateProvinceValues = (province) => {};
const updateProvince= (id, province) => {
    const iou = new Promise((resolve,reject) => {
            MongoClient.connect(url, settings, function(err, client) { // appears as "DB_URL" in tutorial but worked only as "url" in my Delete
                if(err){ //telling the computer to reject it if an error is found, but if not and all goes well, tell us in a console log 
                    reject(err); // that it has connected; then, access the database by name and then the collection on Mongo. 
                }else{
                    console.log("Connected to server- gonna update this Province like it's 1999!");
                    const db = client.db(dbName);
                    const collection = db.collection(colName);
                    collection.replaceOne ({_id: ObjectID(id)}, // access the Mongo-generated ID and prepare to make changes
                        province,
                        { upsert: true }, //this basically says "provided you are doing an upsert, that is"
                        (err, result) => { // from here through line 133, the final pieces of the process are explained
                            if(err){
                                reject(err); //once you're in the database, reject again if there are any problems
                            }else{
                                resolve({ updated_id:id }); //but if not,  show that the changes have been made. refer back to ID in original params on line 114
                                client.close(); // once that has been resolved. The client is "the client of the database"- close the client to the DB because the task is complete, ie the info has been accessed and processed
                            }
                        }
                    );
                }
            })    
    })
    return iou;            
};

const deleteProvince = async (id) => {
    const iou = new Promise ((resolve, reject) => {
        MongoClient.connect(url, settings, async function (err, client) { //changed "url" to "DB_URL" 
        //function or async function?
            if(err){
                reject(err);
            } else {
                console.log("Connected to DataBase Server to DELETE Province");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                console.log(collection)
                collection.deleteMany({_id: ObjectID(id) }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else{
                         resolve(true);
                         client.close(); 
                    }
                }) 
            //     //tutorial has "deleteOne"
            //    try {
            //     const _id = new ObjectID(id);
            //     collection.findOneAndDelete({ _id }, function(err, data){
            //         if(err){
            //             reject(err);
            //         }else {
            //             if(data.lastErrorObject.n > 0){
            //                 resolve(data.value);
            //             } else{
            //                 resolve({error: "ID doesn't exist"});
            //             }
            //         }
            //     });
            //  } catch(err){
            //      console.log(err);
            //      reject({error: "ID has to be in ObjectID format"});
            //  }
            }
        })    
    })

    return iou;
};

module.exports = { 
    getProvince,
    createProvince,
    updateProvince,
    deleteProvince
   //updateProvinceValues
    
}