const express = require('express');
const { uploadFile, clear } = require('./middleware/uploadFile');
const { content } = require('./fileReader');
const fs = require('fs');
require('./database/bars_db');
const { Billing, Store } = require('./model/billings');
const moment = require('moment');

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.post(
  '/upload',
  clear,
  uploadFile.single('upload'),
  (req, res) => {
    const stats = fs.statSync('csv-txt-files/upload.txt');
    if (stats.size === 0) {
      throw new Error('No request(s) to read from the input file.');
    }
    const client = content();
    console.log(`Processing Request with three parameters`);
    Store.deleteMany({}, (err, user) => {
      if (err) {
        console.log('Cannot pull out');
      }
    });
    let n = 0;
    for (let i = 0; i < client.length; i++) {
      Billing.find(client[i], (error, user) => {
        try {
          const wait = new Store({
            billingCycle: '0' + String(user[0].billingCycle),
            startDate: moment(user[0].startDate).format('MM/DD/YYYY'),
            endDate: moment(user[0].endDate).format('MM/DD/YYYY'),
            firstName: user[0].account.customer.firstName,
            lastName: user[0].account.customer.lastName,
            amount: user[0].amount});
          wait.save();
          n++;
        } catch (error) {
          res.status(400).send({ error: 'No Record Found!' });
          console.log('error: No Record Found!');
        }
      });
    }

    setTimeout(() => {
      if (!(n === 0)) {
        Store.find({}, (err, user) => {
          res.status(200).send(user);
        }).select('-_id');
        console.log('Successfully displayed billing request!');
      }
    }, 400);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
    console.log(`error: ${error.message}`);
  }
);

app.listen(port, () => {
  console.log(`Server is running at port ${port}!`);
});
