import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  songs: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
