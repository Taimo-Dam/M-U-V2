import express from 'express';
import { getAlbums, getArtists, getSongs } from '../controllers/musicController.js';

const router = express.Router();

router.get('/songs', getSongs);
router.get('/artists', getArtists);
router.get('/albums', getAlbums);

export default router;
