const express = require('express');
const {getProvince} = require('../../DataAccess/tc_provinces');
const{createProvince} = require('../../DataAccess/tc_provinces'); 
const{deleteProvince} = require('../../DataAccess/tc_provinces'); 
const{updateProvince} = require ('../../DataAccess/tc_provinces');
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
        console.log("Got it!")
        const data = await getProvince(); 
        res.send(data);
        
  } catch (err) {
        console.log(err);
        res.send(500, "Error-Internal Server Issue. A total failure.");
  };
});

//"READ" Phase- not sure but here goes

router.post('/', async function(req, res, next) {
   console.log(req.body);
      try {
            const data = await createProvince(req.body); 
            res.send(data);
            
      } catch (err) {
            console.log(err);
            res.status(500).send  ("Error-Internal Server Issue. A total failure.");
      };
    });

router.put('/:id', async function(req, res, next) {
   console.log(req.body);
      try {
            const data = await updateProvince(req.params.id, req.body); 
            res.send(data);
            
      } catch (err) {
            console.log(err);
            res.status(500).send  ("Error-Internal Server Issue. A total failure.");
      };
});




router.delete('/:id', async function(req, res, next) { // COULD IT BE the '/'? 
      console.log(req.body);
         try {
               const data = await deleteProvince(req.params.id); 
               res.send(data);
               
         } catch (err) {
               console.log(err);
               res.status(500).send  ("Error-Internal Server Issue. A total failure.");
         };
      });


module.exports = router;