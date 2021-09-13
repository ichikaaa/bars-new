const multer = require('multer');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'csv-txt-files');
  },
  filename: function (req, file, cb) {
    console.log(`========> FilePath: ${file.originalname}`);
    if (file.originalname.match(/\.(txt|csv)$/)) {
      cb(null, file.fieldname + '.txt');
    } else {
      return cb(new Error('File is not supported for processing.'));
    }
  }});

const uploadFile = multer({ storage });

const clear = async (req, res, next) => {
  try {
    await fs.emptyDir('csv-txt-files');
    next();
  } catch (error) {
    throw new Error('Failed to clear');
  }
};

module.exports = { uploadFile, clear };
