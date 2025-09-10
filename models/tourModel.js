const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const tourScema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, ' A tour cannot exceed 40 characters'],
      minlength: [10, ' A tour must have at leats 10 characters'],
      //validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A group must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficult'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Diffculty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, ' Rating can have a max of 5.0'],
    },

    ratingsQuantity: { type: Number, default: 0 },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // This only points to current doc on new documnet creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be lower than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJson
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourScema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document middlewaree: runs beforer .save() and .create()
tourScema.pre('save', function (next) {
  //console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourScema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

//Query middleware
tourScema.pre(/^'find'/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourScema.post(/^'find'/, function (docs, next) {
  console.log(`This query too ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

//Aggreation middleware
tourScema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourScema);

module.exports = Tour;
