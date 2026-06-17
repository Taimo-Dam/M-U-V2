import express from 'express';
import { getAlbums, getArtists, getSongs, getArtistByName, getSongsByArtist, recordPlay, search } from '../controllers/musicController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/songs', getSongs);
router.get('/artists', getArtists);
router.get('/artists/:name', getArtistByName);
router.get('/artists/:name/songs', getSongsByArtist);
router.post('/songs/:id/play', optionalProtect, recordPlay);
router.get('/albums', getAlbums);
router.get('/search', search);

export default router;
