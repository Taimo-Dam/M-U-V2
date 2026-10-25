import express from 'express';
import { getAlbums, getArtists, getSongs, getArtistByName, getSongsByArtist, recordPlay, search } from '../controllers/musicController.js';
import { optionalProtect, protect } from '../middleware/authMiddleware.js';
import { recommendations, smartPlaylist } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/songs', getSongs);
router.get('/artists', getArtists);
router.get('/artists/:name', getArtistByName);
router.get('/artists/:name/songs', getSongsByArtist);
router.post('/songs/:id/play', optionalProtect, recordPlay);
router.get('/albums', getAlbums);
router.get('/search', search);
router.get('/recommendations', protect, recommendations);
router.get('/smart-playlist/:trackId', optionalProtect, smartPlaylist);

export default router;
