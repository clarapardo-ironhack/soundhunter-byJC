const { Schema, model } = require("mongoose")

const eventSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        artists: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        description: { type: String, required: true },
        location: {
            type: { type: String },
            coordinates: [Number]
        },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        image: { type: String },
        comments: [Object]
    }
)

eventSchema.index({ location: '2dsphere' })

module.exports = model("Event", eventSchema)