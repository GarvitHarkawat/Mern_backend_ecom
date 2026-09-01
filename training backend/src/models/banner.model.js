import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            url: {
                type: String,
                required: true
            },

            publicId: {
                type: String,
                required: true
            }
        },

        link: {
            type: String,
            default: ""
        },

        position: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;