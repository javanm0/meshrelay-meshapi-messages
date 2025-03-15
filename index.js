const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3030;

const uri = process.env.MONGODB_URI;

const messageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  node_id: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  phoneNumber: {
    type: String,
    required: false
  },
  messageSent: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to the database');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

app.use(express.json());

app.get('/api/messages', async (req, res) => {
  try {
    await connectToDatabase();
    const messages = await Message.find({});
    console.log('Successfully fetched messages:', messages);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.put('/api/messages', async (req, res) => {
  const { id } = req.body;

  try {
    await connectToDatabase();
    const result = await Message.updateOne({ _id: id }, { $set: { messageSent: true } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Message not found or already updated' });
    }

    // Re-fetch the message to ensure the update is applied
    const updatedMessage = await Message.findById(id);
    console.log('Re-fetched updated message:', updatedMessage);

    // Check if the messageSent field is updated
    if (updatedMessage && updatedMessage.messageSent) {
      console.log('Message sent field updated successfully');
      res.json({ message: 'Message updated successfully', data: updatedMessage });
    } else {
      console.log('Failed to update message sent field');
      res.status(500).json({ error: 'Failed to update message sent field' });
    }
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Error updating message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});