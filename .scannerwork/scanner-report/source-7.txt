const moment = require('moment');

class ERROR extends Error {
  constructor(args) {
    super(args);
    this.name = 'ERROR';
  }
}

const startDateValid = file => {
  let n = 1;
  for (let i = 0; i < file.length; i++) {
    if (!moment(file[i].startDate, 'YYYY-MM-DD').isValid()) {
      break;
    } else {
      n++;
    }
  }
  if (file.length === n - 1) {
    return true;
  } else {
    throw new ERROR(`Invalid Start Date format at row ${n}.`);
  }
};

const endDateValid = file => {
  let n = 1;
  for (let i = 0; i < file.length; i++) {
    if (!moment(file[i].endDate, 'YYYY-MM-DD').isValid()) {
      break;
    } else {
      n++;
    }
  }
  if (file.length === n - 1) {
    return true;
  } else {
    throw new ERROR(`Invalid End Date format at row ${n}.`);
  }
};

const billingCycleValid = file => {
  let n = 1;

  for (let i = 0; i < file.length; i++) {
    if (!(file[i].billingCycle < 13 && file[i].billingCycle > 0)) {
      break;
    } else {
      n++;
    }
  }
  if (file.length === n - 1) {
    return true;
  } else {
    throw new ERROR(`Billing Cycle not on range at row ${n}.`);
  }
};

module.exports = { startDateValid, endDateValid, billingCycleValid };
