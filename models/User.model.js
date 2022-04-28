const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    name: String,
    lastname: String,
    favoriteGenres: [String],
    city: String,
    image: { type: String, default: 'https://www.tech101.in/wp-content/uploads/2018/07/blank-profile-picture.png' },
    role: { type: String, enum: ['USER', 'ARTIST', 'ADMIN'], default: 'USER' },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    favouriteArtists: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    savedEvents: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    idSpotify: String
  },
  {
    timestamps: true,
  }
)



module.exports = model("User", userSchema)