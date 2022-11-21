const Router = require('express');
const router = new Router();
const edgesController = require('../controller/edges.controller');

router.post('/edges', edgesController.getCoords);

module.exports = router;
