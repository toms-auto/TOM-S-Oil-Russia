import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),prefix='/TOM-S-Oil-Russia/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{let url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.writeHead(302,{Location:prefix});res.end();return}if(!url.pathname.startsWith(prefix)){res.writeHead(404);res.end();return}const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html';if(relative.split('/').some(s=>s.startsWith('.'))||relative.includes('\\'))throw Error('Invalid path');const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep))throw Error('Invalid path');const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}).listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173'+prefix));
