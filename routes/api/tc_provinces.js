const express = require('express');
const {getProvince} = require('../../DataAccess/tc_provinces');
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
        const data = await getProvince(); 
        res.send(data);
  } catch (err) {
        console.log(err);
        res.send(500, "Error-Internal Server Issue. A total failure.");
  };
});

//"READ" Phase- not sure but here goes

router.post('/' async function(req, res, next){

})

// READ Phase


module.exports = router;