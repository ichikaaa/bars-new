const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('../database/bars_db');

const billingSchema = new mongoose.Schema({
  billingCycle: Number,
  billingMonth: String,
  amount: Number,
  startDate: Date,
  endDate: Date,
  lastEdited: String,
  account: {
    accountName: String,
    dateCreated: Date,
    isActive: String,
    lastEdited: String,
    customer: {
      firstName: String,
      lastName: String,
      address: String,
      status: String,
      dateCreated: Date,
      lastEdited: String}}});

const storeSchema = new mongoose.Schema(
  {
    billingCycle: String,
    startDate: String,
    endDate: String,
    firstName: String,
    lastName: String,
    amount: Number},
  { versionKey: false }
);

const Store = mongoose.model('store', storeSchema);
const Billing = mongoose.model('billing', billingSchema);

module.exports = { Billing, Store };
