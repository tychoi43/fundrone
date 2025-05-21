const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());

// 정적 파일 서비스
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 업로드 폴더 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// 파일 업로드 API
app.post('/api/upload', upload.array('files', 5), (req, res) => {
  // 업로드된 파일 정보 반환
  const fileInfos = req.files.map(file => ({
    originalname: file.originalname,
    filename: file.filename,
    url: `/uploads/${file.filename}`
  }));
  res.json({ success: true, files: fileInfos });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 