const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

process.on('uncaughtException', (err) => {
  console.log(err.message);
  console.log('Uncaught Exception...Shutting Down');
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    //console.log(con.connections);
    console.log('db connection successful');
  });
//console.log(process.env);

/* const tourScema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourScema); */

//created a new tour for testing
/* const testTour = new Tour({
  name: 'The forst Hiker',
  rating: 4.7,
  price: 497,
}); */

//saves the test tour to the database/ prints out details of the tour on success / or will print out the error upon fail
/* testTour
  .save()
  .then((doc) => {
    console.log('saved new tour');
    console.log(doc);
  })
  .catch((err) => {
    console.log('error:', err);
  }); */

const port = process.env.PORT || 3000;
// start server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('Unhadled Rejection...Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});
