import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const base=process.argv[2];if(!base||!base.endsWith('/'))throw Error('Provide website URL ending in /');
const hash=b=>createHash('sha256').update(b).digest('hex');
const html=await fs.readFile('index.html','utf8'),products=JSON.parse(await fs.readFile('products.json','utf8'));
const required=new Set(['index.html','style.css','app.js','products.json','verification/original-image-audit.md','verification/supplied-assets-manifest.json']);
for(const [,asset]of html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g))required.add(asset);
for(const p of products){required.add(p.local);for(const v of p.variants)required.add(v.local)}
let files=0;const paths=[...required];for(let i=0;i<paths.length;i+=6)await Promise.all(paths.slice(i,i+6).map(async relative=>{if(relative.startsWith('/')||relative.includes('..'))throw Error('Invalid runtime path '+relative);const segments=relative.split('/');let directory='.';for(const segment of segments){if(!(await fs.readdir(directory)).includes(segment))throw Error('Filename case mismatch '+relative);directory=path.join(directory,segment)}const local=await fs.readFile(relative);const r=await fetch(new URL(relative,base),{cache:'no-store'});if(!r.ok)throw Error(relative+' HTTP '+r.status);const remote=Buffer.from(await r.arrayBuffer());if(hash(local)!==hash(remote))throw Error(relative+' does not match local source');files++}));
const app=await fs.readFile('app.js','utf8'),css=await fs.readFile('style.css','utf8');if(/(?:localhost|127\.0\.0\.1|\b[A-Za-z]:[\\/])/.test(html+app+css))throw Error('Host-specific runtime path');
const summary={url:base,homepageContentMatches:true,requiredFilesVerified:files,sha256Matches:true,filenameCaseMatches:true,productCount:products.length,packagingVariations:products.reduce((n,p)=>n+p.variants.length,0),note:'Delivery/content verification only; browser layout, console and interactive network behavior are not established.'};console.log(JSON.stringify(summary,null,2));
