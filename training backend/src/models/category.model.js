const mongoose = require("mongoose");
const convertToSlug = require("../utils/slug");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    image: {
      url: String,
      publicId: String,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    position: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre("validate", function setSlung() {
  if (this.isModified("name") || !this.slug) this.slug = convertToSlug(this.name);
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
