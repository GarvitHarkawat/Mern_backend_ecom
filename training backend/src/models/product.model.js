
const mongoose = require("mongoose");

const slugify = require("slugify");

const { nanoid } = require("nanoid");


const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 140
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        description: {
            type: String,
            maxlength: 4000
        },

        price: {
            type: Number,
            required: true,
            min: 1
        },

        mrp: {
            type: Number,
            required: true,
            min: 1
        },

        images: [
            {
                url: String,
                publicId: String
            }
        ],

        video: {
            url: String,
            publicId: String
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },

        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            index: true
        },

        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            index: true
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true
        },

        stockQty: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        tags: [
            {
                type: String,
                enum: ["trending", "top-selling", "new"]
            }
        ],

        ratingAvg: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        ratingCount: {
            type: Number,
            default: 0
        },

        soldCount: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


productSchema.virtual("discountPercent").get(function () {
    return Math.round(
        ((this.mrp - this.price) / this.mrp) * 100
    );
});


productSchema.virtual("inStock").get(function () {
    return this.stockQty > 0;
});


productSchema.pre("validate", function (next) {
    if (this.isNew || this.isModified("title")) {
        this.slug = `${slugify(this.title, { lower: true, strict: true })}-${nanoid(6)}`;
    }

    if (this.price > this.mrp) {
        return next(new Error("Price cannot exceed MRP"));
    }

    next();
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;