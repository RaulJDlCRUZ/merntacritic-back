import { Router } from 'express';
var router = Router();

const mymsg = '  Hello! if you are reading this, it means that the back-end of the MERNtacritic video game platform is up and running, so it would be left for you to enter the visual page (front-end), using the port specified in the environment variables';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { customTitle: 'Welcome to MERNtacritic!' , msg: mymsg });
});

export default router;
