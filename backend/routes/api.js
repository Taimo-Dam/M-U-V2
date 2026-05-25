import express from 'express';
import { getAlbums, getArtists, getSongs, getArtistByName, getSongsByArtist } from '../controllers/musicController.js';

const router = express.Router();

router.get('/songs', getSongs);
router.get('/artists', getArtists);
router.get('/artists/:name', getArtistByName);
router.get('/artists/:name/songs', getSongsByArtist);
router.get('/albums', getAlbums);

export default router;
