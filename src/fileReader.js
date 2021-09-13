const fs = require('fs');
const {
  startDateValid,
  endDateValid,
  billingCycleValid,
} = require('./Validator/dateValidator');

const content = () => {
  const fileContent = fs.readFileSync('csv-txt-files/upload.txt');
  const file = String(fileContent).split('\r\n');
  try {
    if (file[0].includes(',' && '/') && fileContent !== 0) {
      const csvFile = readCsv(file);
      const validatorB = billingCycleValid(csvFile);
      const validatorS = startDateValid(csvFile);
      const validatorE = endDateValid(csvFile);
      if (validatorB !== true) {
        return validatorB;
      } else if (validatorS !== true) {
        return validatorS;
      } else if (validatorE !== true) {
        return validatorE;
      } else {
        return csvFile;
      }
    } else if (!file[0].includes(',' && '/') && fileContent !== 0) {
      const txtFile = readTxt(file);
      const validatorB = billingCycleValid(txtFile);
      const validatorS = startDateValid(txtFile);
      const validatorE = endDateValid(txtFile);
      if (validatorB !== true) {
        return validatorB;
      } else if (validatorS !== true) {
        return validatorS;
      } else if (validatorE !== true) {
        return validatorE;
      } else {
        return txtFile;
      }
    }
  } catch (e) {
    throw new Error(e);
  }
};

const readTxt = filename => {
  const fileArray = [];
  console.log(`==> INSIDE TXT PROCESSING <==`);
  for (let i = 0; i < filename.length; i++) {
    const billingCycle = parseInt(filename[i].slice(0, 2));
    const startDateString = filename[i].slice(2, 10);
    const startDate = new Date(
      `${startDateString.substring(0, 2)}/${startDateString.substring(
        2,
        4
      )}/${startDateString.substring(4, startDateString.length)}`
    );
    const endDateString = filename[i].slice(10, 18);
    const endDate = new Date(
      `${endDateString.substring(0, 2)}/${endDateString.substring(
        2,
        4
      )}/${endDateString.substring(4, endDateString.length)}`
    );
    fileArray.push({ billingCycle, startDate, endDate });
  }

  return fileArray;
};

const readCsv = filename => {
  const fileArray = [];
  console.log(`==> INSIDE CSV PROCESSING <==`);
  for (let i = 0; i < filename.length; i++) {
    const fileString = filename[i].split(',');
    const billingCycle = parseInt(fileString[0]);
    const startDate = new Date(fileString[1]);
    const endDate = new Date(fileString[2]);

    fileArray.push({ billingCycle, startDate, endDate });
  }

  return fileArray;
};

module.exports = { content, readCsv, readTxt };
