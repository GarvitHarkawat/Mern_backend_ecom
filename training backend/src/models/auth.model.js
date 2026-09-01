const mongoose = require("mongoose");
const{ROLE_LIST} = require("../constants/roles");
const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      maxLength: 120,
      trim: true,
    },
    street: {
      type: String,
      maxLength: 120,
      trim: true,
    },
    phone: {
      type: String,
      maxLength: 120,
      trim: true,
    },

    city: {
      type: String,
      maxLength: 120,
      trim: true,
    },
    state: {
      type: String,
      maxLength: 120,
      trim: true,
    },
    pincode: {
      type: Number,
      maxLength: 6,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 128,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 128,
      select : false,
    },
    phone: {
      type: String,
      maxLength: 10,
      //  match: /^[6-9]\d{9}$/
    },
    role: {
      type: String,
      enum: ROLE_LIST,
      default: "user",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePhoto: {
      url: { type: String },
      publicId: { type: String },
    },
    shopName: {
      type: String,
      trim: true,
    },
    addressess: [addressSchema],
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
