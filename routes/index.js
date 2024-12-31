import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { customTitle: 'Hello' , msg: 'Welcome to MERNtacritic' });
});

export default router;
