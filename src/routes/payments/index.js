const Router = require('koa-router');
const payments = new Router();
const paymentsCtrl = require('./payments.ctrl');

payments.post('/admin', paymentsCtrl.bulkUpload);
payments.get('/', paymentsCtrl.list);

module.exports = payments;
