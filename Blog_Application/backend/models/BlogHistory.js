const mongoose = require('mongoose');

const blogHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  blogId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  },
  blogTitle: { 
    type: String, 
    required: true 
  },
  action: { 
    type: String, 
    enum: ['Created', 'Updated', 'Deleted'], 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('BlogHistory', blogHistorySchema);
