const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {type:String, required:true},
  description: {type:String},
  price: {type:Number, required:true},
  quantity:  {type:Number,required:true}, 
  unit: {type:String, default:'kg'},
  location: {type:String},
  imageUrl: {type:String},
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
