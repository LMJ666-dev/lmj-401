// 功能：启动 HTTP 数据服务器（端口 3004），提供 /api/poems 接口返回 db.json 的 poems 数据
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3004;
const DB_FILE = path.join(__dirname, 'db.json');

// 函数功能：设置 CORS 响应头，允许跨域访问
function lmj_setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

// 函数功能：读取 db.json 并返回解析后的对象，读取失败返回 null
function lmj_readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[server] 读取 db.json 失败:', err.message);
    return null;
  }
}

// 函数功能：根据 URL 路径返回对应数据，处理 /api/poems 和根路径健康检查
function lmj_handleRequest(req, res) {
  lmj_setCorsHeaders(res);

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0]; // 去除查询参数

  if (url === '/api/poems' || url === '/') {
    const data = lmj_readDb();
    if (!data) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: '读取数据库失败' }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: '接口不存在' }));
  }
}

// 创建并启动服务器
const server = http.createServer(lmj_handleRequest);
server.listen(PORT, () => {
  console.log(`\n📜 诗词数据服务器已启动`);
  console.log(`   端口: ${PORT}`);
  console.log(`   接口: http://localhost:${PORT}/api/poems`);
  console.log(`   按 Ctrl+C 停止\n`);
});
