import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  songs: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Album = mongoose.model('Album', albumSchema);
export default Album;
