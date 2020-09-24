const purchaseModel = require('../models/purchaseModel');
const {validationResult} = require('express-validator');

exports.purchase = (req, res) => {
  const errors = validationResult(req);
  console.log('test');
  console.log('GUMANA'); // testing
  if (errors.isEmpty()) {
    const {shipping, billing, transactionType} = req.body;
    console.log(shipping);
    console.log(billing);
    console.log(transactionType);
  }
}