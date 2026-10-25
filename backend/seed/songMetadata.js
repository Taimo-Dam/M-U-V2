const artistTags = {
  'Sơn Tùng M-TP': { genres: ['V-pop', 'Dance-pop'], moods: ['energetic', 'romantic'] },
  Amee: { genres: ['V-pop', 'R&B'], moods: ['sweet', 'romantic'] },
  'Anh Trai Say Hi': { genres: ['V-pop'], moods: ['energetic'] },
  Dangrangto: { genres: ['Vietnamese hip-hop'], moods: ['energetic'] },
  Mono: { genres: ['V-pop', 'Dance-pop'], moods: ['energetic', 'romantic'] },
  HIEUTHUHAI: { genres: ['Vietnamese hip-hop', 'Rap'], moods: ['confident', 'energetic'] },
  'Wren Evans': { genres: ['V-pop', 'Alternative pop'], moods: ['energetic', 'romantic'] },
  'Vũ': { genres: ['Indie pop', 'Acoustic'], moods: ['mellow', 'romantic'] },
  'Dương Domic': { genres: ['V-pop'], moods: ['romantic'] },
  'Low G': { genres: ['Vietnamese hip-hop', 'Rap'], moods: ['confident', 'energetic'] },
  'Jack - J97': { genres: ['V-pop'], moods: ['emotional', 'romantic'] },
  tlinh: { genres: ['R&B', 'Vietnamese hip-hop'], moods: ['confident', 'romantic'] },
  Soobin: { genres: ['V-pop', 'R&B'], moods: ['emotional', 'romantic'] }
};

export function withDefaultSongTags(song) {
  const tags = artistTags[song.artist] || { genres: [], moods: [] };
  return {
    ...song,
    genres: song.genres?.length ? song.genres : tags.genres,
    moods: song.moods?.length ? song.moods : tags.moods
  };
}
