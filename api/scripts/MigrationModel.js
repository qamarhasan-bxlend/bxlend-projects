"use strict";

const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: "db_migrations",
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  },
);

// ------------------------- Statics ----------------------------

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = model("Migration", SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
