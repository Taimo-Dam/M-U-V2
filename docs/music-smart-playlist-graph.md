# Thiết kế đồ án: Music Streaming and Smart Playlist Graph

## 1. Kết luận và phạm vi ước lượng

M-U-V2 đã có ứng dụng streaming chạy được: React/Vite, Express, MongoDB/Mongoose, JWT, danh mục Song/Artist/Album, phát audio và một API ghi lượt phát. Phần có thể giữ lại nhiều nhất là giao diện, xác thực, player, danh mục nhạc và các tài nguyên audio/ảnh.

| Phương án | Ước tính tái sử dụng source hiện có | Mức đáp ứng đề tài sau khi hoàn thiện | Nhận xét |
|---|---:|---:|---|
| MongoDB-only | 75–85% | 65–75% | Làm được playlist và collaborative filtering bằng aggregation, nhưng không có graph database/Cypher thực tế. |
| MongoDB + Neo4j | 70–80% | 90–95% | Giữ MongoDB và phần lớn ứng dụng; Neo4j thực thi các đường đi quan hệ, recommendation và playlist bằng Cypher đúng trọng tâm đề tài. |

Đây là ước lượng kỹ thuật, không phải số đo theo dòng code. Tỷ lệ tái sử dụng tính theo các phần chức năng đang chạy; mức đáp ứng tính theo các yêu cầu đã nêu. Phương án polyglot được khuyến nghị nếu giảng viên yêu cầu chứng minh graph database và truy vấn Cypher.

## 2. Đánh giá source hiện tại

### Có thể tái sử dụng

- `frontend/src/App.jsx`, các trang danh mục, card, layout và style: tiếp tục dùng; thêm khu vực recommendations/playlist nếu cần.
- `frontend/src/context/PlayerContext.jsx`: giữ luồng audio/queue; bổ sung cách lấy và phát queue từ smart playlist.
- `frontend/src/services/musicService.js`: giữ các API đang có, bổ sung client methods cho recommendation và playlist.
- `backend/models/User.js`: giữ tài khoản, bcrypt và JWT. Trường `listeningHistory` hiện được nhúng trong User.
- `backend/models/Song.js`, `Artist.js`, `Album.js`: giữ làm dữ liệu nguồn MongoDB, nhưng cần chuẩn hóa liên kết bằng ID.
- `backend/controllers/musicController.js`: giữ API danh mục và điểm ghi lượt phát; tách phần truy cập Neo4j ra service mới.
- `backend/middleware/authMiddleware.js`, `backend/routes/authRoutes.js`: tái sử dụng bảo vệ JWT và lịch sử nghe.
- `backend/seed/seed.js`: giữ quy trình seed catalog, bổ sung genre/mood/ID liên kết và bước đồng bộ graph.

### Khoảng trống quan trọng

1. `Song.artist` và `Album.artist` là chuỗi tên, không phải quan hệ ID; Song chưa có album reference, genre hay mood.
2. `Artist.songs` và `Album.songs` là số lượng, không phải danh sách liên kết bài hát.
3. `User.listeningHistory` loại lượt nghe cũ của cùng bài, giới hạn 50 mục và không có `playCount`; nó phù hợp với trang “nghe gần đây”, chưa đủ làm dữ liệu collaborative filtering.
4. `Song.plays` chỉ là bộ đếm tổng, không thể thay thế lịch sử theo user.
5. Chưa có Neo4j driver, graph service, đồng bộ dữ liệu, endpoint recommendation hay smart playlist.
6. Player ghi lượt nghe khi audio bắt đầu phát; để thống kê chính xác hơn nên ghi nhận sau một ngưỡng nghe (ví dụ 30 giây hoặc 50% bài) và chỉ ghi một lần cho một phiên phát.

## 3. So sánh lựa chọn lưu trữ

| Tiêu chí | MongoDB-only | MongoDB + Neo4j |
|---|---|---|
| Song/User/catalog | Mongoose documents | MongoDB vẫn là nguồn chuẩn |
| Genre/Mood | Mảng ID/tên trong Song và `$lookup`/aggregation | Node riêng, nối với Track bằng quan hệ |
| Listening History | Collection sự kiện hoặc subdocument; `$group` để tính lượt nghe | MongoDB lưu sự kiện đầy đủ; Neo4j lưu cạnh tổng hợp `playCount` |
| Playlist | `$lookup`, `$setIntersection`, `$addFields`, `$sort` | Traversal `Track`→`Genre`/`Mood`→`Track` |
| Collaborative filtering | Nhiều `$lookup`/`$group`; phù hợp corpus nhỏ-vừa | Tìm user chung track và candidate bằng Cypher |
| Cypher/graph requirement | Không đáp ứng trực tiếp | Đáp ứng trực tiếp và trực quan hóa được graph |
| Vận hành | Ít dịch vụ, dễ triển khai | Cần vận hành thêm Neo4j và đồng bộ eventual consistency |

### Phương án MongoDB-only

Thêm `genres: [ObjectId]` và `moods: [ObjectId]` vào Song, hoặc dùng slug trong giai đoạn prototype; dùng collection riêng `Genre` và `Mood` để quản trị từ vựng. Dùng collection `ListeningHistory` theo từng sự kiện, có `user`, `song`, `playedAt`, `durationPlayed`, `source`; tạo index `{ user: 1, playedAt: -1 }` và `{ song: 1, user: 1 }`.

Playlist aggregation thực hiện theo chuỗi: lấy bài seed → tìm Song có phần giao genre hoặc mood → tính `genreMatchCount` và `moodMatchCount` bằng `$setIntersection` → cộng điểm phổ biến `ln(1 + plays)` và/hoặc điểm affinity người dùng → loại seed và bài đã nghe nếu muốn → sort/limit.

Ví dụ pipeline cốt lõi dưới đây giả định `genres` và `moods` là mảng ObjectId trên `songs`. Ứng dụng thực tế cần validate `seedId`; nếu có user, thêm `$lookup` vào `listeninghistories` để lọc các bài user đã nghe trước `$sort`:

```js
db.songs.aggregate([
  { $match: { _id: ObjectId(seedId) } },
  {
    $lookup: {
      from: "songs",
      let: {
        seedId: "$_id",
        seedGenres: { $ifNull: ["$genres", []] },
        seedMoods: { $ifNull: ["$moods", []] }
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $ne: ["$_id", "$$seedId"] },
                {
                  $or: [
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [
                              { $ifNull: ["$genres", []] },
                              "$$seedGenres"
                            ]
                          }
                        },
                        0
                      ]
                    },
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [
                              { $ifNull: ["$moods", []] },
                              "$$seedMoods"
                            ]
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          $addFields: {
            genreMatches: {
              $size: {
                $setIntersection: [
                  { $ifNull: ["$genres", []] },
                  "$$seedGenres"
                ]
              }
            },
            moodMatches: {
              $size: {
                $setIntersection: [
                  { $ifNull: ["$moods", []] },
                  "$$seedMoods"
                ]
              }
            }
          }
        },
        {
          $addFields: {
            score: {
              $add: [
                { $multiply: ["$genreMatches", 3] },
                { $multiply: ["$moodMatches", 2] },
                { $ln: { $add: [1, { $ifNull: ["$plays", 0] }] } }
              ]
            }
          }
        },
        { $sort: { score: -1, _id: 1 } },
        { $limit: 20 }
      ],
      as: "playlist"
    }
  },
  { $unwind: "$playlist" },
  { $replaceWith: "$playlist" }
]);
```

Collaborative filtering thực hiện bằng aggregation trên ListeningHistory:

1. Gom các track và play count của user mục tiêu.
2. `$lookup` các lượt nghe của user khác trên những track giao nhau.
3. Tính độ tương đồng, ví dụ Jaccard `sharedTrackCount / (targetTrackCount + neighborTrackCount - sharedTrackCount)`.
4. Chọn top users tương đồng; gom các track họ nghe mà user mục tiêu chưa nghe.
5. Xếp hạng bằng tổng `similarity × playCount`, có thể cộng prior phổ biến.

Trong MongoDB, các bước 2–5 có thể thực hiện qua `$lookup` lồng nhau và `$group`, nhưng các lookup sẽ khuếch đại số dòng khi user/track/events tăng. Để scale tốt hơn có thể duy trì collection tổng hợp `userTrackStats { user, song, playCount, lastPlayedAt }` từ sự kiện nghe rồi chạy aggregation trên collection này. Đây là phương án riêng MongoDB, không phải graph relationship.

Ưu điểm là ít thay đổi hạ tầng; nhược điểm là query aggregation dài, khó diễn đạt các đường đi nhiều bước và không thể trình bày sản phẩm như graph recommendation chạy trên Neo4j. Nếu rubric yêu cầu Neo4j/Cypher thì MongoDB-only không thể đạt đủ tiêu chí đó dù kết quả gợi ý tương đương.

## 4. Kiến trúc khuyến nghị

```text
React ──REST/JWT──> Express API ──> MongoDB (nguồn dữ liệu chuẩn)
                         │                    │
                         │                    └── Mongo outbox event
                         │                              │
                         └── read recommendations <── Neo4j sync worker
                                │
                                └── Neo4j (graph projection/query)
```

- MongoDB giữ User, Song/Track, Artist, Album và lịch sử sự kiện đầy đủ.
- Neo4j là projection phục vụ graph traversal; không lưu mật khẩu, JWT hoặc dữ liệu tài khoản nhạy cảm.
- Neo4j giữ `mongoId` dạng chuỗi để ánh xạ ổn định tới `_id` MongoDB. Không phụ thuộc internal Neo4j node ID.
- Neo4j lưu cạnh nghe đã tổng hợp theo cặp user-track. Lịch sử sự kiện chi tiết và thời gian thực vẫn ở MongoDB.
- API trả metadata Song từ MongoDB theo `mongoId` của các kết quả Cypher để frontend nhận đúng schema hiện có.

### Đồng bộ MongoDB → Neo4j

Luồng khuyến nghị là transactional outbox:

1. Sau khi xác nhận một lượt nghe hợp lệ, Express ghi `ListeningHistory` và tăng `Song.plays`.
2. Trong cùng Mongo transaction, ghi một document outbox như `{ type: "LISTEN_RECORDED", userId, songId, eventId, createdAt, processedAt }`. Mongo transaction yêu cầu replica set; môi trường dev có thể dùng MongoDB replica-set cục bộ/Atlas.
3. Worker lấy outbox chưa xử lý, đọc metadata hiện hành từ MongoDB, rồi dùng Neo4j `MERGE` để upsert User/Artist/Track/Genre/Mood và quan hệ.
4. Cập nhật `processedAt` sau khi Neo4j commit thành công. Thao tác phải idempotent; retry không được tăng `playCount` lần nữa. Dùng `eventId` hoặc projection counter/version để bảo đảm điều này.
5. Đồng bộ backfill ban đầu bằng CSV hoặc script Node đọc MongoDB. Outbox xử lý thay đổi sau backfill.

Không ghi lần lượt Mongo rồi Neo4j trực tiếp trong request và giả định cả hai luôn thành công: hai database không có transaction chung. Nếu không triển khai transactional outbox cho đồ án, phải ghi rõ đó là prototype eventual consistency và có retry/reconciliation.

## 5. MongoDB schema đề xuất

Schema dưới đây là mục tiêu sau migration; không yêu cầu thay toàn bộ schema ngay lập tức.

### User

```js
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,                 // bcrypt hash, chỉ ở MongoDB
  createdAt: Date,
  updatedAt: Date
}
```

Trong Neo4j chỉ đồng bộ `_id` thành `mongoId` và một số thuộc tính hiển thị tối thiểu nếu thật sự cần.

### Song / Track

```js
{
  _id: ObjectId,
  title: String,
  artist: String,                   // giữ tương thích UI trong giai đoạn migrate
  artistId: ObjectId,               // ref Artist, bổ sung và backfill
  albumId: ObjectId,                // ref Album, bổ sung nếu bài thuộc album
  genres: [ObjectId],               // ref Genre
  moods: [ObjectId],                // ref Mood
  duration: String,
  plays: Number,                    // lượt nghe toàn hệ thống
  image: String,
  audioUrl: String,
  createdAt: Date
}
```

### Artist và Album

- Artist: `_id`, `name`, `image`, timestamps; bỏ dần `songs` dạng số đếm khỏi vai trò quan hệ.
- Album: `_id`, `title`, `artistId`, `image`, timestamps; bài hát tham chiếu album qua `Song.albumId`.
- Có thể giữ trường `artist` chuỗi cũ để frontend cũ tiếp tục chạy trong migration; dữ liệu chuẩn mới là ID.

### Genre và Mood

```js
// Genre
{ _id: ObjectId, name: String, slug: String, description: String }

// Mood
{ _id: ObjectId, name: String, slug: String, description: String }
```

Tạo unique index cho `slug`. Song tham chiếu danh mục bằng ObjectId; khi đồng bộ graph dùng slug hoặc Mongo `_id` chuỗi làm khóa ổn định.

### ListeningHistory

Collection riêng, một document cho mỗi phiên nghe hợp lệ:

```js
{
  _id: ObjectId,
  eventId: String,                  // UUID duy nhất, idempotency/outbox correlation
  user: ObjectId,                   // ref User
  song: ObjectId,                   // ref Song
  playedAt: Date,
  durationPlayed: Number,           // giây thực nghe
  source: String                    // "player", "playlist", ...
}
```

Index: unique `eventId`; `{ user: 1, playedAt: -1 }`; `{ song: 1, user: 1 }`. User chưa đăng nhập vẫn có thể tăng `Song.plays`, nhưng không tạo user edge. Có thể giữ `User.listeningHistory` làm recent-history cache tạm thời để tránh phá UX cũ, rồi chuyển `GET /api/auth/history` sang collection mới.

## 6. Neo4j schema và ràng buộc

Node labels: `User`, `Track`, `Artist`, `Genre`, `Mood`. Thuộc tính bắt buộc `mongoId: STRING`; node `Track` có thể giữ `title`, `popularity`, `duration`, `image`, `audioUrl` nếu muốn trả kết quả trực tiếp, nhưng API vẫn nên lấy dữ liệu cuối cùng từ MongoDB.

Quan hệ:

```text
(Artist)-[:PERFORMED]->(Track)
(Track)-[:HAS_MOOD]->(Mood)
(Track)-[:IN_GENRE]->(Genre)
(User)-[:LISTENED_TO {playCount, lastPlayedAt}]->(Track)
```

Quan hệ `LISTENED_TO` biểu diễn số lượt nghe tích lũy cho user-track, không phải một event. `playCount` là số nguyên không âm. Nếu cần phân tích theo từng event/thời gian trong graph, đó là mở rộng tùy chọn, không thay thế lịch sử sự kiện MongoDB.

Tạo uniqueness constraint cho `mongoId` trên từng label. Scripts mẫu trong `backend/neo4j/cypher/`:

- `00-schema.cypher`: constraints/indexes.
- `01-import-csv.cypher`: import CSV catalog, user và play count. CSV phải có `mongoId` tương ứng; Genre/Mood ID được tham chiếu từ `tracks.csv`.
- `02-recommendations.cypher`: collaborative filtering.
- `03-smart-playlist.cypher`: playlist theo Genre/Mood và popularity.
- `04-sync-listen.cypher`: upsert cạnh nghe từ aggregate MongoDB theo cách idempotent.

## 7. API REST và luồng xử lý

Trong source hiện tại, `server.js` mount music router dưới `/api`; vì vậy khi thêm routes vào router đó, URL thực tế sẽ là `/api/recommendations/:userId` và `/api/smart-playlist/:trackId` (có thể bỏ prefix nếu triển khai sau API gateway).

### `GET /recommendations/:userId`

- Bảo vệ bằng JWT; chỉ cho phép `:userId` trùng user trong token. Không tin user ID do client gửi để đọc sở thích người khác.
- Query Neo4j bằng tham số `$userId`, lấy các track chưa nghe cùng score và `neighborSupport`.
- Lấy metadata đầy đủ của các Mongo Song bằng danh sách `_id`; giữ thứ tự theo score Neo4j khi map kết quả.
- Response gợi ý:

```json
{
  "userId": "mongo-user-id",
  "items": [
    {
      "song": { "_id": "mongo-song-id", "title": "..." },
      "score": 2.7,
      "similarUsers": 4,
      "reason": "popular among listeners with similar taste"
    }
  ]
}
```

Nếu Neo4j chưa sẵn sàng, trả lỗi dịch vụ rõ ràng (503) hoặc dùng fallback MongoDB có ghi log; không trả response rỗng như thể không có đề xuất.

### `GET /smart-playlist/:trackId`

- `trackId` là Mongo Song `_id`; tìm Track bằng `mongoId`.
- JWT tùy chọn: nếu có user, loại track họ đã nghe; nếu không có, sinh playlist theo seed.
- Query params gợi ý: `limit` giới hạn trong khoảng 1–50. Đầu vào ID phải được validate trước khi query.
- Response có thể trả `{ seed, items, strategy }`; mỗi item mang `reason` (shared genre/mood/popular) để giải thích kết quả.

### Luồng ghi nghe và đề xuất

```text
Playbar phát bài
 → POST /api/songs/:id/play (JWT tùy chọn)
 → ghi lượt nghe + tăng plays trong MongoDB
 → ghi outbox trong cùng transaction
 → worker MERGE graph và tăng playCount đúng một lần
 → GET /recommendations/:userId
 → Neo4j chọn neighbors/candidates
 → MongoDB hydrate Song documents
 → React hiển thị và PlayerContext phát queue
```

### Luồng smart playlist

```text
Người dùng chọn Track seed
 → GET /smart-playlist/:trackId
 → validate Mongo ID và tra seed
 → Neo4j tìm Track cùng Genre/Mood, tính popularity score
 → (nếu đăng nhập) loại bài đã nghe
 → MongoDB hydrate metadata và giữ thứ tự graph
 → trả queue cho React PlayerContext
```

## 8. Cấu trúc backend nên bổ sung

```text
backend/
├── config/
│   └── neo4j.js
├── controllers/
│   └── recommendationController.js
├── models/
│   ├── Genre.js
│   ├── Mood.js
│   ├── ListeningHistory.js
│   └── OutboxEvent.js
├── routes/
│   └── recommendationRoutes.js
├── services/
│   ├── graphSyncService.js
│   ├── neo4jRecommendationService.js
│   └── songHydrationService.js
├── workers/
│   └── graphOutboxWorker.js
└── neo4j/
    └── cypher/
        ├── 00-schema.cypher
        ├── 01-import-csv.cypher
        ├── 02-recommendations.cypher
        ├── 03-smart-playlist.cypher
        └── 04-sync-listen.cypher
```

## 9. Những file hiện tại dự kiến sửa

| File hiện có | Thay đổi |
|---|---|
| `backend/package.json` | Thêm `neo4j-driver` và script backfill/sync nếu cần. |
| `backend/.env.example` | Thêm `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `NEO4J_DATABASE`; không commit secret. |
| `backend/server.js` | Khởi tạo/kiểm tra Neo4j, chạy worker, đóng Neo4j/Mongo connections khi shutdown. |
| `backend/models/Song.js` | Thêm `artistId`, `albumId`, `genres`, `moods`; giữ trường cũ trong thời gian chuyển đổi. |
| `backend/models/User.js` | Bỏ dần embedded history hoặc chỉ giữ cache; giữ nguyên auth/password. |
| `backend/models/Artist.js`, `backend/models/Album.js` | Chuẩn hóa liên kết theo ObjectId; backfill catalog. |
| `backend/controllers/musicController.js` | Ghi history/outbox đúng một lần; hiện tại xóa lượt nghe cũ nên không thể tính play count theo user. |
| `backend/controllers/authController.js`, `backend/routes/authRoutes.js` | Đọc lịch sử từ collection mới, tương thích endpoint lịch sử hiện tại. |
| `backend/routes/api.js` | Giữ record-play; mount routes recommendation. |
| `backend/seed/seed.js` | Thêm genre/mood/artistId/albumId và đồng bộ graph/backfill dev. |
| `frontend/src/services/musicService.js` | Thêm API methods recommendation/playlist. |
| `frontend/src/context/PlayerContext.jsx` | Cho phép kết quả smart playlist được dùng như queue hiện tại. |
| `frontend/src/pages/Home.jsx` hoặc trang mới | Hiển thị recommendation/playlist, xử lý loading/error/empty state. |

## 10. Cấu trúc báo cáo đồ án

1. **Giới thiệu**: vấn đề, mục tiêu, phạm vi, giả định và đóng góp.
2. **Khảo sát nền tảng**: streaming, collaborative filtering, MongoDB, graph database, Cypher.
3. **Phân tích M-U-V2 hiện trạng**: kiến trúc, model/API hiện có, phần tái sử dụng và giới hạn dữ liệu nghe.
4. **Yêu cầu hệ thống**: chức năng, phi chức năng, use case và dữ liệu đầu vào.
5. **Thiết kế kiến trúc**: MongoDB source-of-truth, Neo4j graph projection, outbox, luồng lỗi/retry.
6. **Thiết kế dữ liệu**: Mongoose schemas, indexes, node labels, relationships, uniqueness constraints.
7. **Thuật toán**: Jaccard similarity, ngưỡng nghe, điểm candidate; playlist score từ Genre/Mood/popularity.
8. **Triển khai**: API, driver, worker, Cypher, giao diện, cấu hình Docker/Atlas nếu sử dụng.
9. **Kiểm thử và đánh giá**: correctness, latency, coverage, precision@K/recall@K nếu có ground truth, khảo sát người dùng; so sánh playlist theo Genre/Mood và baseline phổ biến.
10. **Hạn chế và hướng phát triển**: cold start, dữ liệu thưa, metadata gán thủ công, stale graph, weighting recency.
11. **Kết luận**.

Không khẳng định recommendation “chính xác” chỉ từ việc query chạy được. Nên tạo bộ dữ liệu test có nhiều user nghe chồng lấp, track chưa nghe và metadata Genre/Mood; đo output có loại bài đã nghe, thứ tự score đúng và đồng bộ không double-count.

## 11. Dàn ý slide bảo vệ

1. Tên đề tài, thành viên, mục tiêu.
2. Bài toán và người dùng mục tiêu.
3. Demo M-U-V2 hiện trạng; phần nào tái sử dụng.
4. So sánh MongoDB-only và polyglot; lý do chọn MongoDB + Neo4j.
5. Sơ đồ kiến trúc và luồng outbox.
6. MongoDB schema và Neo4j graph schema.
7. Collaborative filtering: user chung bài → similarity → candidate chưa nghe.
8. Smart playlist: seed → Genre/Mood → popularity → queue.
9. Demo API và UI.
10. Kiểm thử, chỉ số, giới hạn và hướng phát triển.

## 12. Thứ tự triển khai giảm rủi ro

1. Chuẩn hóa ID Artist/Album và gán Genre/Mood cho catalog.
2. Tạo ListeningHistory event collection, giữ history cũ tương thích và thêm test cho play counting.
3. Cài schema constraints Neo4j, chạy CSV/backfill, kiểm tra số node/relationship.
4. Triển khai worker idempotent và retry trước khi phụ thuộc graph trong API.
5. Triển khai Cypher recommendation/playlist và Mongo hydration.
6. Thêm endpoint, JWT authorization, validation và error handling.
7. Nối UI/player, đo kết quả với dữ liệu seed có nhiều user (một người dùng không đủ để đánh giá collaborative filtering).

Các script trong thư mục `backend/neo4j/cypher/` hướng tới Neo4j 5.x. Script import dùng `LOAD CSV` với các file nằm trong import directory của Neo4j; các file CSV phải có đúng header ghi ở đầu `01-import-csv.cypher` và các ID trong `tracks.csv` phải tồn tại trong CSV danh mục tương ứng.
