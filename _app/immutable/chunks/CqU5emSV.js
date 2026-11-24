import{c as p,a as f}from"./BATa2uCf.js";import{I as m,s as u}from"./CTymBxJ_.js";import{b as h,v as y}from"./DYMeVDBa.js";import{l as g,s as j}from"./DJSe-Hyr.js";import{D as S}from"./DuRzv-t8.js";function M(t,e){const o=g(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v1.0.1 - ISC
 *
 * ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The following Lucide icons are derived from the Feather project:
 *
 * airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
 *
 * The MIT License (MIT) (for the icons listed above)
 *
 * Copyright (c) 2013-present Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const a=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];m(t,j({name:"trash-2"},()=>o,{get iconNode(){return a},children:(s,P)=>{var i=p(),l=h(i);u(l,e,"default",{}),f(s,i)},$$slots:{default:!0}}))}const c="biosphere.projects.v1",$=["pedigree-analyzer","pedigree-solver","punnett-squares","gene-analyzer","nucleotide-flipper"];function d(t){if(!t||typeof t!="object")return!1;const e=t;return typeof e.id=="string"&&typeof e.name=="string"&&typeof e.updatedAt=="number"&&$.includes(e.tool)}function v(){if(typeof localStorage>"u")return[];try{const t=localStorage.getItem(c);if(!t)return[];const e=JSON.parse(t);return Array.isArray(e)?e.filter(d).slice(0,40):[]}catch{return[]}}const r=y({items:v()});function n(){if(!(typeof localStorage>"u"))try{localStorage.setItem(c,JSON.stringify(r.items))}catch{}}function _(t){return r.items.find(e=>e.id===t)}function D(t){const e=t.id?_(t.id):void 0,o={id:(e==null?void 0:e.id)??`prj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,name:t.name.trim()||"Untitled project",tool:t.tool,updatedAt:Date.now(),dataVersion:S,payload:t.payload},a=r.items.findIndex(s=>s.id===o.id);return a>=0?r.items[a]=o:r.items=[o,...r.items].slice(0,40),n(),o}function J(t){r.items=r.items.filter(e=>e.id!==t),n()}function b(){r.items=[],n()}function k(t){let e;try{e=JSON.parse(t)}catch{return{ok:!1,error:"The file is not valid JSON."}}return d(e)?e.payload?{ok:!0,project:e}:{ok:!1,error:"The project file contains no data."}:{ok:!1,error:"This file is not a Biosphere project."}}export{M as T,k as a,b as c,J as d,_ as g,r as p,D as s};
