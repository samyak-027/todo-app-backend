const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  text: { type: String, required: true, trim: true },
  status: { type: String, required: true, enum: ['pending', 'in-progress', 'completed'] },
  date: { type: String, required: true }, // YYYY-MM-DD
  folder: { type: String, trim: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create a virtual 'id' property that gets the '_id'
// This makes it compatible with the frontend without any changes
taskSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are included in JSON output
taskSchema.set('toJSON', {
    virtuals: true
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
