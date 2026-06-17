import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meandyou';

const songs = [
  // Sơn Tùng M-TP
  { title: 'Âm Thầm Bên Em', artist: 'Sơn Tùng M-TP', duration: '4:53', plays: 2450, image: '/images/sontungmtp/amthambenem-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/AmThamBenEm-SonTungMTP-4066476.mp3' },
  { title: 'Chạy Ngay Đi', artist: 'Sơn Tùng M-TP', duration: '4:12', plays: 1820, image: '/images/sontungmtp/chayngaydi-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/ChayNgayDi-SonTungMTP-5468704.mp3' },
  { title: 'Chúng Ta Của Hiện Tại', artist: 'Sơn Tùng M-TP', duration: '5:01', plays: 3200, image: '/images/sontungmtp/chungtacuhientai-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/ChungTaCuaHienTai-SonTungMTP-6892340.mp3' },
  { title: 'Chúng Ta Của Tương Lai', artist: 'Sơn Tùng M-TP', duration: '4:15', plays: 4300, image: '/images/sontungmtp/ChungTaCuaTuongLai.jpg', audioUrl: '/audio/nhacTre/sontungmtp/ChungTaCuaTuongLai.mp3' },
  { title: 'Có Chắc Yêu Là Đây', artist: 'Sơn Tùng M-TP', duration: '3:22', plays: 1540, image: '/images/sontungmtp/CoChacYeuLaDay.jpg', audioUrl: '/audio/nhacTre/sontungmtp/CoChacYeuLaDay.mp3' },
  { title: 'Đừng Làm Trái Tim Anh Đau', artist: 'Sơn Tùng M-TP', duration: '3:47', plays: 6200, image: '/images/sontungmtp/dunglamtraitimanhdau-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/DungLamTraiTimAnhDau-sontungmtp.mp3' },
  { title: 'Hãy Trao Cho Anh', artist: 'Sơn Tùng M-TP', duration: '4:05', plays: 5400, image: '/images/sontungmtp/haytraochoanh-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3' },
  { title: 'Khuôn Mặt Đáng Thương', artist: 'Sơn Tùng M-TP', duration: '4:17', plays: 800, image: '/images/sontungmtp/KhuonMatDangThuong.jpg', audioUrl: '/audio/nhacTre/sontungmtp/KhuonMatDangThuong.mp3' },
  { title: 'Muộn Rồi Mà Sao Còn', artist: 'Sơn Tùng M-TP', duration: '4:35', plays: 2900, image: '/images/sontungmtp/MuonRoiMaSaoCon.jpg', audioUrl: '/audio/nhacTre/sontungmtp/MuonRoiMaSaoCon.mp3' },
  { title: "There's No One At All", artist: 'Sơn Tùng M-TP', duration: '3:47', plays: 1100, image: '/images/sontungmtp/NoOneAtAll.jpg', audioUrl: '/audio/nhacTre/sontungmtp/NoOneAtAll.mp3' },
  { title: 'Em Của Ngày Hôm Qua', artist: 'Sơn Tùng M-TP', duration: '3:45', plays: 9800, image: '/images/sontungmtp/emcuangayhomqua-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/emcuangayhomqua-sontungmtp.mp3' },
  { title: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP', duration: '4:20', plays: 8700, image: '/images/sontungmtp/noinaycoanh-sontungmtp.jpg', audioUrl: '/audio/nhacTre/sontungmtp/noinaycoanh-sontungmtp.mp3' },

  // Amee
  { title: 'Mộng Yu', artist: 'Amee', duration: '3:15', plays: 1200, image: '/images/Amee/amee.jpg', audioUrl: '/audio/nhacTre/Amee/1. MỘNG YU - AMEE ft. MCK - lyric video (from MỘNGMEE album).mp3' },
  { title: 'Cuộc gọi lúc nửa đêm', artist: 'Amee', duration: '3:40', plays: 890, image: '/images/Amee/cuocgoilucnuadem.jpg', audioUrl: '/audio/nhacTre/Amee/2. Cuộc gọi lúc nửa đêm - AMEE - lyric video (from MỘNGMEE album).mp3' },
  { title: 'Beautiful Nightmare (Interlude)', artist: 'Amee', duration: '1:45', plays: 450, image: '/images/Amee/amee.jpg', audioUrl: '/audio/nhacTre/Amee/3. Beautiful nightmare (interlude) - AMEE - lyric video (from MỘNGMEE album).mp3' },
  { title: 'Miền Mộng Mị', artist: 'Amee', duration: '3:05', plays: 720, image: '/images/Amee/amee.jpg', audioUrl: '/audio/nhacTre/Amee/4. Miền Mộng Mị - AMEE - lyric video (from MỘNGMEE album).mp3' },
  { title: '2000 câu hỏi vì sao', artist: 'Amee', duration: '3:25', plays: 1500, image: '/images/Amee/2000cauhoivisao.jpg', audioUrl: '/audio/nhacTre/Amee/5. 2000 câu hỏi vì sao - AMEE - lyric video (from MỘNGMEE album).mp3' },

  // Anh Trai Say Hi
  { title: 'Lần Đầu Tiên', artist: 'Anh Trai Say Hi', duration: '3:30', plays: 2300, image: '/images/AnhTraiSayHi/LanUuTien.jpg', audioUrl: '/audio/nhacTre/AnhTraiSayHi/LanUuTien.mp3' },

  // Dangrangto
  { title: 'Lướt Trên Con Sóng', artist: 'Dangrangto', duration: '3:10', plays: 1400, image: '/images/Dangrangto/LuotTrenConSong-Dangrangto.jpg', audioUrl: '/audio/nhacTre/Dangrangto/LuotTrenConSong-Dangrangto.mp3' },
  { title: 'Wrong Times', artist: 'Dangrangto', duration: '3:35', plays: 1980, image: '/images/Dangrangto/WrongTimes-Dangrangto.jpg', audioUrl: '/audio/nhacTre/Dangrangto/WrongTimes-Dangrangto.mp3' },
  { title: 'Love Is', artist: 'Dangrangto', duration: '2:50', plays: 890, image: '/images/Dangrangto/LoveIs-Dangrangto.jpg', audioUrl: '/audio/nhacTre/Dangrangto/LoveIs-Dangrangto.mp3' },
  { title: 'Ngựa Ô', artist: 'Dangrangto', duration: '3:15', plays: 1670, image: '/images/Dangrangto/NguaO-Dangrangto.jpg', audioUrl: '/audio/nhacTre/Dangrangto/NguaO-Dangrangto.mp3' },
  { title: 'Mời Em', artist: 'Dangrangto', duration: '3:02', plays: 1100, image: '/images/Dangrangto/MoiEm-Dangrangto.jpg', audioUrl: '/audio/nhacTre/Dangrangto/MoiEm-Dangrangto.mp3' },

  // Mono
  { title: 'Ôm Em Thật Lâu', artist: 'Mono', duration: '3:20', plays: 3400, image: '/images/Mono/omemthatlau-mono.jpg', audioUrl: '/audio/nhacTre/Dangrangto/MONO/OmEmThatLau-Mono.mp3' },
  { title: 'Em Xinh', artist: 'Mono', duration: '3:10', plays: 5200, image: '/images/Mono/emxinh-mono.jpg', audioUrl: '/audio/nhacTre/Dangrangto/MONO/Emxinh-Mono.mp3' },
  { title: 'Đi Tìm Tình Yêu', artist: 'Mono', duration: '3:45', plays: 2900, image: '/images/Mono/ditimtinhyeu-mono.jpg', audioUrl: '/audio/nhacTre/Dangrangto/MONO/DiTimTinhYeu-Mono.mp3' },
  { title: 'Waiting For You', artist: 'Mono', duration: '4:01', plays: 9500, image: '/images/Mono/waitingforyou-mono.jpg', audioUrl: '/audio/nhacTre/Dangrangto/MONO/WaitingForYou-Mono.mp3' },
  { title: 'Chầm Hoa', artist: 'Mono', duration: '3:15', plays: 1800, image: '/images/Mono/chamhoa-mono.jpg', audioUrl: '/audio/nhacTre/Dangrangto/MONO/ChamHoa-Mono.mp3' },

  // HIEUTHUHAI
  { title: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó', artist: 'HIEUTHUHAI', duration: '3:02', plays: 4500, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/1. HIEUTHUHAI - Ai Cũng Phải Bắt Đầu Từ Đâu Đó (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Giờ Thì Ai Cười', artist: 'HIEUTHUHAI', duration: '3:12', plays: 3200, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/2. HIEUTHUHAI - Giờ Thì Ai Cười (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Không Phải Gu', artist: 'HIEUTHUHAI', duration: '3:45', plays: 6700, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/3. HIEUTHUHAI - Không Phải Gu (prod. by Kewtiie) ft. B Ray & Tage [Official Lyric Video].mp3' },
  { title: 'Siêu Sao', artist: 'HIEUTHUHAI', duration: '2:58', plays: 2900, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/4. HIEUTHUHAI - Siêu Sao (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Đi Họp Lớp', artist: 'HIEUTHUHAI', duration: '3:20', plays: 5400, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/5. HIEUTHUHAI - Đi Họp Lớp (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Không Thể Say', artist: 'HIEUTHUHAI', duration: '3:10', plays: 8900, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/6. HIEUTHUHAI - Không Thể Say (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Exit Sign', artist: 'HIEUTHUHAI', duration: '3:30', plays: 7200, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/7. HIEUTHUHAI - Exit Sign (prod. by Kewtiie) ft. marzuz [Official Lyric Video].mp3' },
  { title: 'Visa Interlude', artist: 'HIEUTHUHAI', duration: '1:50', plays: 1200, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/8. HIEUTHUHAI - Visa Interlude (prod. by Kewtiie) [Official Audio].mp3' },
  { title: 'Sắp Nổi Tiếng', artist: 'HIEUTHUHAI', duration: '2:45', plays: 3100, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/9. HIEUTHUHAI - Sắp Nổi Tiếng (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'KPI', artist: 'HIEUTHUHAI', duration: '3:05', plays: 4300, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/10. HIEUTHUHAI - KPI (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Everything Will Be Okay', artist: 'HIEUTHUHAI', duration: '3:22', plays: 3800, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/11. HIEUTHUHAI - Everything Will Be Okay (prod. by Kewtiie) [Official Lyric Video].mp3' },
  { title: 'Cho Em An Toàn', artist: 'HIEUTHUHAI', duration: '3:35', plays: 2600, image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', audioUrl: '/audio/nhacTre/aicungphaibatdautudaudo/12. HIEUTHUHAI - Cho Em An Toàn (prod. by Kewtiie) [Official Lyric Video].mp3' },

  // Wren Evans
  { title: 'Phóng Đổ Tim Em', artist: 'Wren Evans', duration: '3:05', plays: 3400, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/1. WREN EVANS - Phóng Đổ Tim Em - LOI CHOI The FIrst Album (ft. itsnk).mp3' },
  { title: 'Call Me', artist: 'Wren Evans', duration: '3:12', plays: 5200, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/2. WREN EVANS - Call Me - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Cầu Vĩnh Tuy', artist: 'Wren Evans', duration: '3:18', plays: 4300, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/3. WREN EVANS - Cầu Vĩnh Tuy - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Từng Quen', artist: 'Wren Evans', duration: '2:50', plays: 9800, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/4. WREN EVANS - Từng Quen - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Bé Ơi Từ Từ', artist: 'Wren Evans', duration: '3:01', plays: 2700, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/5. WREN EVANS - bé ơi từ từ - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Lối Chơi (Interlude)', artist: 'Wren Evans', duration: '1:30', plays: 900, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/6. WREN EVANS - Lối Chơi (Interlude) - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Tình Yêu Vĩ Mô', artist: 'Wren Evans', duration: '3:08', plays: 1800, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/7. WREN EVANS - Tình Yêu Vĩ Mô - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Việt Kiều', artist: 'Wren Evans', duration: '3:25', plays: 2200, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/8. WREN EVANS - Việt Kiều - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'ĐĐĐ', artist: 'Wren Evans', duration: '3:10', plays: 3100, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/9. WREN EVANS - ĐĐĐ - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Quyền Anh', artist: 'Wren Evans', duration: '2:58', plays: 1500, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/10. WREN EVANS - Quyền Anh - LOI CHOI The First Album (ft. itsnk).mp3' },
  { title: 'Tò Te Tí', artist: 'Wren Evans', duration: '2:48', plays: 8900, image: '/images/WrenEvans/biaLOICHOI.jpg', audioUrl: '/audio/nhacTre/WREN EVANS/11. WREN EVANS - Tò Te Tí - LOI CHOI The First Album (ft. itsnk).mp3' },

  // Vũ
  { title: 'Đông Kiếm Em', artist: 'Vũ', duration: '3:58', plays: 4500, image: '/images/Vu/DongKiemEm-Vu.jpg', audioUrl: '/audio/nhacTre/Vu/DongKiemEm-Vu.mp3' },
  { title: 'Phút Ban Đầu', artist: 'Vũ', duration: '4:12', plays: 3200, image: '/images/Vu/Phutbandau-Vu.jpg', audioUrl: '/audio/nhacTre/Vu/PhutBanDau-Vu.mp3' },
  { title: 'Những Lời Hứa Bỏ Quên', artist: 'Vũ', duration: '4:05', plays: 6700, image: '/images/Vu/Nhungloihuaboquen-Vu.jpg', audioUrl: '/audio/nhacTre/Vu/Nhungloihuaboquen-Vu.mp3' },
  { title: 'Lạ Lùng', artist: 'Vũ', duration: '4:22', plays: 9800, image: '/images/Vu/LaLung-Vu.jpg', audioUrl: '/audio/nhacTre/Vu/LaLung-Vu.mp3' },
  { title: 'Anh Nhớ Ra', artist: 'Vũ', duration: '3:45', plays: 2900, image: '/images/Vu/Anhnhora-Vu.jpg', audioUrl: '/audio/nhacTre/Vu/AnhNhoRa-Vu.mp3' },

  // Dương Domic
  { title: 'Tràn Bộ Nhớ', artist: 'Dương Domic', duration: '3:10', plays: 3400, image: '/images/nghesi/duongdomic.jpg', audioUrl: '/audio/nhacTre/DuongDomic/TranBoNho-DuongDomic.mp3' },
  { title: 'Mất Kết Nối', artist: 'Dương Domic', duration: '3:25', plays: 5200, image: '/images/nghesi/duongdomic.jpg', audioUrl: '/audio/nhacTre/DuongDomic/MatKetNoi-DuongDomic.mp3' },

  // Low G
  { title: 'Dâu Tằm', artist: 'Low G', duration: '3:15', plays: 2400, image: '/images/LowG/flvr.jpg', audioUrl: '/audio/nhacTre/LowG/1. DÂU TẰM - Low G x tlinh - OFFICIAL AUDIO.mp3' },
  { title: 'Ngân', artist: 'Low G', duration: '3:20', plays: 1800, image: '/images/LowG/flvr.jpg', audioUrl: '/audio/nhacTre/LowG/2. NGÂN - Low G x tlinh - OFFICIAL AUDIO.mp3' },
  { title: 'Hop On Da Show', artist: 'Low G', duration: '3:05', plays: 2900, image: '/images/LowG/flvr.jpg', audioUrl: '/audio/nhacTre/LowG/3. HOP ON DA SHOW - Low G x tlinh - OFFICIAL AUDIO.mp3' },
  { title: 'Phóng Zìn Zìn', artist: 'Low G', duration: '2:58', plays: 3500, image: '/images/LowG/flvr.jpg', audioUrl: '/audio/nhacTre/LowG/4. PHÓNG ZÌN ZÌN - Low G x tlinh - OFFICIAL AUDIO.mp3' },

  // Jack - J97
  { title: 'Đom Đóm', artist: 'Jack - J97', duration: '3:42', plays: 5400, image: '/images/J97/DomDom-J97.jpg', audioUrl: '/audio/nhacTre/J97/DomDom-J97.mp3' },
  { title: 'Thiên Lý Ơi', artist: 'Jack - J97', duration: '3:58', plays: 7200, image: '/images/J97/ThienLyOi-J97.jpg', audioUrl: '/audio/nhacTre/J97/ThienLyOi-J97.mp3' },
  { title: 'Giai Điệu Miền Tây', artist: 'Jack - J97', duration: '3:20', plays: 3100, image: '/images/J97/GiaiDieuMienTay-J97.jpg', audioUrl: '/audio/nhacTre/J97/GiaiDieuMienTay-J97.mp3' },
  { title: 'Hoa Hải Đường', artist: 'Jack - J97', duration: '3:45', plays: 6100, image: '/images/J97/HoaHaiDuong-J97.jpg', audioUrl: '/audio/nhacTre/J97/HoaHaiDuong-J97.mp3' },
  { title: 'Bạc Phận', artist: 'Jack - J97', duration: '3:50', plays: 8900, image: '/images/J97/BacPhan-J97.jpg', audioUrl: '/audio/nhacTre/J97/BacPhan-J97.mp3' },
  { title: 'Mẹ Ơi 2', artist: 'Jack - J97', duration: '3:15', plays: 1200, image: '/images/J97/MeOi2-J97.jpg', audioUrl: '/audio/nhacTre/J97/MeOi2-J97.mp3' },
  { title: 'Hồng Nhan', artist: 'Jack - J97', duration: '3:35', plays: 9500, image: '/images/J97/HongNhan-J97.jpg', audioUrl: '/audio/nhacTre/J97/HongNhan-J97.mp3' },
  { title: 'Hoa Vô Sắc', artist: 'Jack - J97', duration: '3:40', plays: 4300, image: '/images/J97/HoaVoSac-J97.jpg', audioUrl: '/audio/nhacTre/J97/HoaVoSac-J97.mp3' },
  { title: 'Chúng Ta Rồi Sẽ Hạnh Phúc', artist: 'Jack - J97', duration: '4:01', plays: 2800, image: '/images/J97/ChungTaRoiSeHanhPhuc-J97.jpg', audioUrl: '/audio/nhacTre/J97/ChungTaRoiSeHanhPhuc-J97.mp3' },
  { title: '01 Ngoại Lệ', artist: 'Jack - J97', duration: '3:10', plays: 1500, image: '/images/J97/01NgoaiLe-J97.jpg', audioUrl: '/audio/nhacTre/J97/01NgoaiLe-J97.mp3' },
  { title: 'Là Một Thằng Con Trai', artist: 'Jack - J97', duration: '3:25', plays: 4900, image: '/images/J97/LaMotThangConTrai-J97.jpg', audioUrl: '/audio/nhacTre/J97/LaMotThangConTrai-J97.mp3' },
  { title: 'Lay Lalay', artist: 'Jack - J97', duration: '3:12', plays: 3800, image: '/images/J97/LayLaLay-J97.jpg', audioUrl: '/audio/nhacTre/J97/LayLaLay-J97.mp3' },

  // tlinh
  { title: 'Thế Giới Thần Tiên', artist: 'tlinh', duration: '3:02', plays: 3400, image: '/images/tlinh/thegioithantien.jpg', audioUrl: '/audio/nhacTre/ái/7. tlinh - thế giới thần tiên - OFFICIAL VISUALIZER.mp3' },
  { title: 'Ghệ Iu Dấu Của Em Ơi', artist: 'tlinh', duration: '3:15', plays: 7200, image: '/images/tlinh/gheiudaucuaemoi.jpg', audioUrl: '/audio/nhacTre/ái/10. tlinh - ghệ iu dấu của em ơi (feat. 2pillz, wokeup) - OFFICIAL MUSIC VIDEO.mp3' },
  { title: 'Nữ Siêu Anh Hùng', artist: 'tlinh', duration: '3:20', plays: 4300, image: '/images/tlinh/nusieuanhhung.jpg', audioUrl: '/audio/nhacTre/ái/9. tlinh - nữ siêu anh hùng - OFFICIAL MUSIC VIDEO.mp3' },
  { title: 'Kho Báu Đánh Rơi', artist: 'tlinh', duration: '3:28', plays: 2900, image: '/images/tlinh/khobaudanhroi.jpg', audioUrl: '/audio/nhacTre/ái/4. tlinh - kho báu đánh rơi (feat. Grey D) - OFFICIAL VISUALIZER.mp3' },
  { title: 'Tình Yêu Có Nghĩa Là Gì?', artist: 'tlinh', duration: '3:10', plays: 5400, image: '/images/tlinh/tinhyeuconghialagi.jpg', audioUrl: '/audio/nhacTre/ái/1. tlinh - tình yêu có nghĩa là gì- - OFFICIAL MUSIC VIDEO.mp3' },
  { title: 'Kết Thúc = Mở Đầu', artist: 'tlinh', duration: '1:45', plays: 1200, image: '/images/tlinh/ketthuc=modau.jpg', audioUrl: '/audio/nhacTre/ái/12. kết thúc = mở đầu.mp3' },
  { title: 'Người Điên', artist: 'tlinh', duration: '3:30', plays: 2600, image: '/images/tlinh/nguoidien.jpg', audioUrl: '/audio/nhacTre/ái/3. tlinh - người điên - OFFICIAL VISUALIZER.mp3' },
  { title: 'ái', artist: 'tlinh', duration: '3:05', plays: 3800, image: '/images/tlinh/ai.jpg', audioUrl: '/audio/nhacTre/ái/5. ái.mp3' },
  { title: 'Nếu Lúc Đó', artist: 'tlinh', duration: '3:35', plays: 9800, image: '/images/tlinh/neulucdo.jpg', audioUrl: '/audio/nhacTre/ái/11. tlinh - nếu lúc đó (ft. 2pillz) - OFFICIAL MUSIC VIDEO.mp3' },
  { title: 'Làm Lành Chữa Tình', artist: 'tlinh', duration: '3:12', plays: 3100, image: '/images/tlinh/lamlanhchuatinh.jpg', audioUrl: '/audio/nhacTre/ái/6. tlinh - làm lành chữa tình - OFFICIAL VISUALIZER.mp3' },
  { title: 'Những Đốm Sáng', artist: 'tlinh', duration: '3:22', plays: 1900, image: '/images/tlinh/nhungdomsang.jpg', audioUrl: '/audio/nhacTre/ái/8. tlinh - những đốm sáng - OFFICIAL VISUALIZER.mp3' },
  { title: 'Người Đẹp Ngủ', artist: 'tlinh', duration: '3:01', plays: 1500, image: '/images/tlinh/aialbum.jpg', audioUrl: '/audio/nhacTre/ái/2. tlinh - người đẹp ngủ - OFFICIAL VISUALIZER.mp3' },

  // Soobin
  { title: 'Ai Mà Biết Được', artist: 'Soobin', duration: '3:10', plays: 2400, image: '/images/SooBin/AiMaBietDuoc-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/AiMaBietDuoc.mp3' },
  { title: 'Anh Đã Quen Với Cô Đơn', artist: 'Soobin', duration: '4:05', plays: 5200, image: '/images/SooBin/AnhDaQuenVoiCoDon-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/AnhDaQuenVoiCoDon.mp3' },
  { title: 'Dancing In The Dark', artist: 'Soobin', duration: '3:18', plays: 1800, image: '/images/SooBin/DancingInTheDark-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/DancingInTheDark.mp3' },
  { title: 'Đẹp Nhất Là Em', artist: 'Soobin', duration: '3:22', plays: 2900, image: '/images/SooBin/DepNhatLaEm-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/DepNhatLaEm.mp3' },
  { title: 'Đi Để Trở Về', artist: 'Soobin', duration: '3:15', plays: 8900, image: '/images/SooBin/DiDeTroVe-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/DiDeTroVe.mp3' },
  { title: 'Đi Để Trở Về 3', artist: 'Soobin', duration: '3:30', plays: 4300, image: '/images/SooBin/DiDeTroVe3-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/DiDeTroVe3.mp3' },
  { title: 'Giá Như', artist: 'Soobin', duration: '3:25', plays: 3400, image: '/images/SooBin/GiaNhu-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/GiaNhu.mp3' },
  { title: 'Nếu Ngày Ấy', artist: 'Soobin', duration: '4:10', plays: 3100, image: '/images/SooBin/NeuNgayAy-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/NeuNgayAy.mp3' },
  { title: 'Phía Sau Một Cô Gái', artist: 'Soobin', duration: '4:12', plays: 9800, image: '/images/SooBin/PhiaSauMotCoGai-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/PhiaSauMotCoGai.mp3' },
  { title: 'Tháng Năm', artist: 'Soobin', duration: '3:35', plays: 6700, image: '/images/SooBin/ThangNam-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/ThangNam.mp3' },
  { title: 'The Playah', artist: 'Soobin', duration: '5:02', plays: 5400, image: '/images/SooBin/ThePlayah-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/ThePlayah.mp3' },
  { title: 'Và Thế Là Hết', artist: 'Soobin', duration: '3:20', plays: 1500, image: '/images/SooBin/VaTheLaHet-SooBin.jpg', audioUrl: '/audio/nhacTre/Soobin/VaTheLaHet.mp3' }
];

const artists = [
  { name: 'Sơn Tùng M-TP', image: '/images/sontungmtp/sontung-avatar.jpg', songs: 12 },
  { name: 'Amee', image: '/images/Amee/amee.jpg', songs: 5 },
  { name: 'Anh Trai Say Hi', image: '/images/AnhTraiSayHi/LanUuTien.jpg', songs: 1 },
  { name: 'Dangrangto', image: '/images/Dangrangto/dangrangto.jpeg', songs: 5 },
  { name: 'Mono', image: '/images/Mono/mono.jpg', songs: 5 },
  { name: 'HIEUTHUHAI', image: '/images/Hieuthuhai/hieuthuhai.jpg', songs: 12 },
  { name: 'Wren Evans', image: '/images/WrenEvans/WrenEvans0.jpg', songs: 11 },
  { name: 'Vũ', image: '/images/Vu/vu.jpg', songs: 5 },
  { name: 'Dương Domic', image: '/images/nghesi/duongdomic.jpg', songs: 2 },
  { name: 'Low G', image: '/images/LowG/flvr.jpg', songs: 4 },
  { name: 'Jack - J97', image: '/images/J97/anhjack.jpg', songs: 12 },
  { name: 'tlinh', image: '/images/tlinh/ai.jpg', songs: 12 },
  { name: 'Soobin', image: '/images/SooBin/soobinavata1.jpg', songs: 12 }
];

const albums = [
  { title: 'Chúng Ta Của Tương Lai', artist: 'Sơn Tùng M-TP', image: '/images/sontungmtp/sontungnen.jpg', songs: 12 },
  { title: 'Mộng Mee', artist: 'Amee', image: '/images/Amee/introduncingMongmee.jpg', songs: 5 },
  { title: 'Loi Choi', artist: 'Wren Evans', image: '/images/WrenEvans/biaLOICHOI.jpg', songs: 11 },
  { title: 'ái', artist: 'tlinh', image: '/images/tlinh/aialbum.jpg', songs: 12 },
  { title: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó', artist: 'HIEUTHUHAI', image: '/images/Hieuthuhai/acpbdtddMauXanh.jpg', songs: 12 },
  { title: 'The Playah', artist: 'Soobin', image: '/images/SooBin/soobinnen.jpg', songs: 12 }
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
