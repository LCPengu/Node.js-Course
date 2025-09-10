const fs = require('fs');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('db connection successful');
  });

//read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours loaded successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Database data was deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

///console.log(process.argv)

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
