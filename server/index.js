const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 允许跨域访问
app.use(cors());

// 静态文件服务 - 使用完整的路径
app.use('/', express.static(path.join(__dirname, 'public')));

// 添加一个测试路由来检查文件是否存在
app.get('/check-video', (req, res) => {
  const videoPath = path.join(__dirname, 'public/videos/demo/demo.mp4');
  res.json({
    exists: require('fs').existsSync(videoPath),
    path: videoPath
  });
});

// 启动服务器
const port = 8081;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // 打印实际的文件路径
  console.log('Video path:', path.join(__dirname, 'public/videos/demo2/demo.mp4'));
}); 