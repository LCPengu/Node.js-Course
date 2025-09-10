//app
const express = require('express');

const { get } = require('http');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSan = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
//security HTTP headers
app.use(helmet());

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Global Middleware
//development logging
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limits requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//data sanitization againest Nosql query injection
app.use(mongoSan());
//data sanitization againest xss
app.use(xss());
//prevent parameters pollution (eg. using sort mutiple times in the url)
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//serving static files
app.use(express.static(`${__dirname}/public`));

/* app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});
 */
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can send to this endpoint');
});

//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTourById);
//app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'Failed',
    message: `Cant find ${req.originalUrl} on this server`,
  }); */

  next(new appError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
