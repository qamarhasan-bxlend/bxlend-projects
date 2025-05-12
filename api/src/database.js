"use strict";

const { MONGODB_URI } = require("@src/config");
const mongoose = require("mongoose");

/* istanbul ignore next */
mongoose
  .connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  )
  .then(() => console.log("MongoDB connection established"))
  .catch(error => {
    console.error(error);

    process.exit(1);
  });
