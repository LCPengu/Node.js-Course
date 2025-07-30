const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    //console.log(con.connections);
    //console.log('db connection successful');
  });
//console.log(process.env);
const port = process.env.PORT || 3000;
// start server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
