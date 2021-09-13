const { readCsv, readTxt } = require('../src/fileReader');
const {
  billingCycleValid,
  startDateValid,
  endDateValid,
} = require('../src/Validator/dateValidator');
const request = require('supertest');
const express = require('express');

const app = express();

test('BARS.TC.001: Read CSV Valid Request Parameter', () => {
  const readCsvFile = readCsv([
    '01,01/15/2013,02/14/2013',
    '01,01/15/2016,02/14/2016',
  ]);
  expect(readCsvFile).toStrictEqual([
    {
      billingCycle: 1,
      startDate: new Date('2013/01/15'),
      endDate: new Date('2013/02/14'),
    },
    {
      billingCycle: 1,
      startDate: new Date('2016/01/15'),
      endDate: new Date('2016/02/14'),
    },
  ]);
});

test('BARS.TC.002: Read Invalid CSV Request With Invalid Billing Cycle', () => {
  const readCsvFile = readCsv([
    '1,01/01/2013,01/31/2013',
    '12,01/01/2013,01/31/2013',
    '12,01/01/2013,01/31/2013',
    '13,01/01/2013,01/31/2013',
    '3,01/01/2013,01/31/2013',
  ]);
  expect(() => {
    billingCycleValid(readCsvFile);
  }).toThrow('Billing Cycle not on range at row 4');
});

test('BARS.TC.003: Read Invalid CSV Request With Invalid Start Date Format', () => {
  const readCsvFile = readCsv(['1,01/ /2013,01/31/2013']);

  expect(() => {
    startDateValid(readCsvFile);
  }).toThrow('Invalid Start Date format at row 1.');
});

test('BARS.TC.004: Read Invalid CSV Request With Invalid End Date Format', () => {
  const readCsvFile = readCsv([
    '1,01/01/2013,05/31/2013',
    '1,01/01/2013,05/31/2013',
    '1,01/01/2013,05/31/2013',
    '1,01/01/2013,05/31/2013',
    '1,01/01/2013,05/31/2013',
    '1,01/01/2013,05/31/2013',
    '1,01/01/2013,05//2013',
    '1,01/01/2013,05/31/2013',
  ]);

  expect(() => {
    endDateValid(readCsvFile);
  }).toThrow('Invalid End Date format at row 7');
});

test('BARS.TC.005: Read an empty CSV file.', () => {
  request(app)
    .post('/upload')
    .attach('upload', 'tests/BARS_TEST/empty-csv.csv')
    .expect(400);
});

test('BARS.TC.006: Read TXT Valid Request Parameter', () => {
  const readTxtFile = readTxt(['010115201302142013', '010115201602142016']);
  expect(readTxtFile).toStrictEqual([
    {
      billingCycle: 1,
      startDate: new Date('2013/01/15'),
      endDate: new Date('2013/02/14'),
    },
    {
      billingCycle: 1,
      startDate: new Date('2016/01/15'),
      endDate: new Date('2016/02/14'),
    },
  ]);
});

test('BARS.TC.007: Read Invalid TXT Request With Invalid Billing Cycle', () => {
  const readTxtFile = readTxt([
    '010115201302142013',
    '010115201602142016',
    '130115201302142013',
    '010115201602142016',
  ]);
  expect(() => {
    billingCycleValid(readTxtFile);
  }).toThrow('Billing Cycle not on range at row 3.');
});

test('BARS.TC.008: Read Invalid TXT Request With Invalid Start Date Format', () => {
  const readTxtFile = readTxt([
    '010101201301312013',
    '010101201301312013',
    '0101  201301312013',
    '010101201301312013',
    '010101201301312013',
  ]);

  expect(() => {
    startDateValid(readTxtFile);
  }).toThrow('Invalid Start Date format at row 3.');
});

test('BARS.TC.009: Read Invalid TXT Request With Invalid End Date Format', () => {
  const readTxtFile = readTxt(['0101012013  312013']);

  expect(() => {
    endDateValid(readTxtFile);
  }).toThrow('Invalid End Date format at row 1');
});

test('BARS.TC.010: Read an empty TXT file.', () => {
  request(app)
    .post('/upload')
    .attach('upload', 'tests/BARS_TEST/empty-txt.txt')
    .expect(400);
});
