import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  plays: { type: Number, default: 0, min: 0 },
  image: { type: String, default: '' },
  audioUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Song = mongoose.model('Song', songSchema);
export default Song;
