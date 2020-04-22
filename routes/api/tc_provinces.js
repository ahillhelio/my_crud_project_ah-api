const express = require('express');
const {getProvince} = require('../../DataAccess/tc_provinces');
const{createProvince} = require('../../DataAccess/tc_provinces'); //WIP
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

      try {
            const data = await createProvince(req.body); 
            res.send(data);
            
      } catch (err) {
            console.log(err);
            res.status(500).send  ("Error-Internal Server Issue. A total failure.");
      };
    });

// READ Phase


module.exports = router;