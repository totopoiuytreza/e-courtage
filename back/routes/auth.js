var express = require('express');
var auth = require('../controllers/auth');
var router = express.Router();

router.post('/something', function(req, res,) {	
    res.send('POST request received');
});
/*  Vérification des credentials clients */
router.post('/loginClient', auth.loginClient);

/*  Vérification des credentials banque */
router.post('/loginBanque', auth.loginBanque);


/*  Enregistrement d'un nouveau client */
router.post('/registerClient', auth.registerClient);

/*  Enregistrement d'un nouvelle banque */
//router.post('/registerbanque', auth.registerBanque);

module.exports = router;