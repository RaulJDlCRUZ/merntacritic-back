import { Schema as _Schema, model } from "mongoose";
var Schema = _Schema;

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");
// var debug = require("debug")("moviesAppAuth:server"); // CommonJS no soporta import

//Para la encriptación del password
import pkg from 'bcryptjs';
const { genSalt, hash: _hash, compare } = pkg;

var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  fullname: String,
  email: {
    type: String,
    required: true,
  },
  creationdate: {
    type: Date,
    default: Date.now,
  },
});

/* El pre middleware se ejecuta antes de que suceda la operacion. 
Por ejemplo, un middleware pre-save sera ejecutado antes de salvar 
el documento. */

UserSchema.pre("save", function (next) {
  var user = this;
  debugInstance("En middleware pre (save)...");
  // solo aplica una función hash al password si ha sido modificado (o es nuevo)
  if (!user.isModified("password")) return next();
  // genera la salt
  genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    // aplica una función hash al password usando la nueva salt
    _hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // sobrescribe el password escrito con el “hasheado”
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

export default model("User", UserSchema);
