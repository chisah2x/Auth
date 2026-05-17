import mongoose, { Schema } from "mongoose";
import { timeStamp } from "node:console";

const sessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token is required"]
    },
    ip:{
        type: String,
        required: [true, "IP address is required"]
    },
    userAgent: {
        type: String,
        required: [true, "User agent is required"]
    },
    revoked:{
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const sessionModel = mongoose.model("sessions", sessionSchema);
export default sessionModel;