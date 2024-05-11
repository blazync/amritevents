import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const eventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event_date: {
        type: Date,
        required: true,
    },
    event_title: {
        type: String,
        required: true,
    },
    event_category: {
        type: String,
        required: true
    },
    event_subcategory:{
        type:String,
        required:true
    },
    event_description: {
        type: String,
        required: true,
    },
    event_images: {
        type: [String], 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Creating Collection
const Event = mongoose.model('Event', eventSchema);

export default Event;
