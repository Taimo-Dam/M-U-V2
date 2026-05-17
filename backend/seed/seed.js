import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meandyou';

const songs = [
  { title: 'Anh Trai Say Hi', artist: 'Anh Trai Say Hi', duration: '3:45', plays: 1250, image: '/images/anh2.avif' },
  { title: 'Nơi Này Có Anh', artist: 'Sơn Tùng MTP', duration: '4:12', plays: 2500, image: '/images/anh3.avif' },
  { title: 'Em Của Ngày Hôm Qua', artist: 'Sơn Tùng MTP', duration: '3:58', plays: 3100, image: '/images/anh5.avif' }
];

const artists = [
  { name: 'Sơn Tùng MTP', image: '/images/sontungmtp/sontung-avatar.jfif', songs: 45 },
  { name: 'Amee', image: '/images/Amee/amee.jpg', songs: 38 },
  { name: 'Anh Trai Say Hi', image: '/images/AnhTraiSayHi/ahsi.jpg', songs: 52 }
];

const albums = [
  { title: 'Album 1', artist: 'Artist 1', image: '/images/anh2.avif', songs: 12 },
  { title: 'Album 2', artist: 'Artist 2', image: '/images/anh3.avif', songs: 10 },
  { title: 'Album 3', artist: 'Artist 3', image: '/images/anh5.avif', songs: 15 }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log('Connected to MongoDB for seeding');

    await Song.deleteMany({});
    await Artist.deleteMany({});
    await Album.deleteMany({});

    await Song.insertMany(songs);
    await Artist.insertMany(artists);
    await Album.insertMany(albums);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
