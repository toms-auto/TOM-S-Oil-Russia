import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {JSDOM} from 'jsdom';
const html=await fs.readFile('./index.html','utf8'),app=await fs.readFile('./app.js','utf8'),products=JSON.parse(await fs.readFile('./products.json','utf8'));
assert.equal(products.length,16);assert.equal(new Set(products.map(p=>p.id)).size,16);
let variants=0;
for(const p of products){assert.ok(p.url.startsWith('https://toms-auto.ru/product/'));await sharp('./'+p.local).stats();for(const v of p.variants){assert.equal(v.loading,'OK');await sharp('./'+v.local).stats();variants++}}
for(const [,asset]of html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g))await fs.access('./'+asset);
const dom=new JSDOM(html,{url:'https://test.local/TOM-S-Oil-Russia/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.fetch=async()=>({ok:true,json:async()=>products});w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=()=>{};const dialog=w.document.querySelector('dialog');dialog.showModal=()=>dialog.setAttribute('open','');dialog.close=()=>{dialog.removeAttribute('open');dialog.dispatchEvent(new w.Event('close'))};
await w.eval('(async()=>{'+app+'})()');
const q=s=>w.document.querySelector(s),qa=s=>[...w.document.querySelectorAll(s)],click=s=>q(s).click();
assert.equal(qa('#catalog-grid .product-card').length,16);assert.equal(qa('#featured-grid .product-card').length,3);assert.equal(qa('#category-grid .category-card').length,4);
for(const [filter,n]of [['engine',10],['transmission',3],['coolant',2],['accessory',1],['all',16]]){click(`[data-filter="${filter}"]`);assert.equal(qa('#catalog-grid .product-card').length,n)}
q('#search').value='DL-1';q('#search').dispatchEvent(new w.Event('input'));assert.equal(qa('#catalog-grid .product-card').length,2);q('#search').value='unknown';q('#search').dispatchEvent(new w.Event('input'));assert.equal(q('#empty').hidden,false);click('#reset');assert.equal(qa('#catalog-grid .product-card').length,16);
for(const p of products){click(`#catalog-grid [data-product="${p.id}"]`);assert.equal(q('#dialog-title').textContent,p.name.replace('Антифриз ',''));for(const v of p.variants){click(`[data-size="${v.size}"]`);assert.equal(q('#preview-image').getAttribute('src'),v.local);assert.ok(q('#preview-image').alt.includes(v.size.replace('l',' л')))}click('.dialog-close')}
const hybrid=products.find(p=>p.id==='toms-0w-20-hybrid');assert.equal(hybrid.defaultSize,'1l');assert.ok(q('#catalog-grid [data-product="toms-0w-20-hybrid"] img').alt.includes('1 л'));click('#catalog-grid [data-product="toms-0w-20-hybrid"]');assert.equal(q('#preview-image').getAttribute('src'),hybrid.local);assert.ok(q('#preview-caption').textContent.endsWith('1 л'));click('[data-size="4l"]');assert.notEqual(q('#preview-image').getAttribute('src'),hybrid.local);assert.ok(q('#preview-image').alt.includes('4 л'));click('.dialog-close');
q('#viscosity').value='5W-30';q('#oil-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(qa('[data-oil-product]').length,3);click('[data-city="kras"]');assert.ok(q('#city-info').textContent.includes('Северное шоссе'));click('.menu');assert.equal(q('.menu').getAttribute('aria-expanded'),'true');click('nav a');assert.equal(q('.menu').getAttribute('aria-expanded'),'false');
const report={date:'2026-10-16',products:16,variants,assetDecode:'PASS',filters:'PASS',searchAndReset:'PASS',productDialogs:'PASS',allVariantImageChanges:'PASS',oilViscosityFilter:'PASS',dealerCitySwitch:'PASS',mobileMenuDOM:'PASS',desktopAndMobileBrowserVisualQA:'NOT RUN: no browser surfaces available; this is DOM verification only',jsErrors:[]};
await fs.writeFile('verification/check-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));dom.window.close();
