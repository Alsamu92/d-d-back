const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema(
  {
    records:[{ type: String}],
    username: { type: String, required: true, trim: true, unique: true },
    medallas: [{type: String, trim: true,required: true}] ,
    experiencia: {type: Number, trim: true,required: true} ,
  lirena: {type: Number, trim: true} ,
    bruster: {type: Number, trim: true} ,
    krista: {type: Number, trim: true} ,
    furtur: {type: Number, trim: true} ,
    darion: {type: Number, trim: true} ,
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next('Error hashing password', error);
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
