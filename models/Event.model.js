const { Schema, model } = require("mongoose")

const eventSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        artist: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        description: { type: String, required: true },
        location: { type: String, required: true },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        image: { type: String, required: true },
        comments: [Object]
    }
)

module.exports = model("Event", eventSchema)