import mongoose from 'mongoose';

const listeningHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true, index: true },
  playedAt: { type: Date, default: Date.now, index: true },
  source: { type: String, default: 'player', trim: true }
});

listeningHistorySchema.index({ user: 1, playedAt: -1 });
listeningHistorySchema.index({ song: 1, user: 1 });

const ListeningHistory = mongoose.model('ListeningHistory', listeningHistorySchema);
export default ListeningHistory;
