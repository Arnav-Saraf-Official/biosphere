var va=Object.defineProperty;var Fn=a=>{throw TypeError(a)};var pa=(a,e,n)=>e in a?va(a,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[e]=n;var gn=(a,e,n)=>pa(a,typeof e!="symbol"?e+"":e,n),mn=(a,e,n)=>e.has(a)||Fn("Cannot "+n);var ut=(a,e,n)=>(mn(a,e,"read from private field"),n?n.call(a):e.get(a)),Yt=(a,e,n)=>e.has(a)?Fn("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,n),bn=(a,e,n,r)=>(mn(a,e,"write to private field"),r?r.call(a,n):e.set(a,n),n),En=(a,e,n)=>(mn(a,e,"access private method"),n);import{c as me,a as I,d as Sn,b as $,e as tn,f as te,s as H,g as Fe}from"./BATa2uCf.js";import{I as xe,s as _e,e as Oe,b as w,a as De,k as yn,d as Tn,r as nn,f as ga,h as Bt,j as ma,c as ba}from"./CTymBxJ_.js";import{q as ya,x as xa,b as j,p as Cn,h as ze,v as an,a as jt,j as B,e as Nn,i as S,c as g,s as L,g as t,k as le,o as ae,r as x,n as Le,w as _a}from"./DYMeVDBa.js";import{l as we,s as ke,i as ee,p as et}from"./DJSe-Hyr.js";import{s as Kn,t as wa,a as ka,p as sn,b as on,v as Ma,g as Jn,c as Ia,e as Qn,d as Pa,r as kn,f as $n,h as Un}from"./DHchxRtr.js";import{c as Sa}from"./jTy_ubts.js";import{b as Kt}from"./CqybyNxu.js";import{b as ea,e as Wt,s as Xn,u as xn}from"./zPKHEhTL.js";import{a as Pe}from"./Byq_Je9i.js";import{C as Ht}from"./ChTre1vn.js";import{T as ln}from"./CqU5emSV.js";import{X as Dn}from"./BW_Zntsv.js";import{T as Vt}from"./CnGRjKOD.js";import{T as Ca}from"./Dr1M-AvD.js";import{E as Na}from"./CBpkyb8w.js";import{S as Aa}from"./DWEO0GuO.js";var mt,Dt,Qt,dn,ta;const un=class un{constructor(e){Yt(this,dn);Yt(this,mt,new WeakMap);Yt(this,Dt);Yt(this,Qt);bn(this,Qt,e)}observe(e,n){var r=ut(this,mt).get(e)||new Set;return r.add(n),ut(this,mt).set(e,r),En(this,dn,ta).call(this).observe(e,ut(this,Qt)),()=>{var d=ut(this,mt).get(e);d.delete(n),d.size===0&&(ut(this,mt).delete(e),ut(this,Dt).unobserve(e))}}};mt=new WeakMap,Dt=new WeakMap,Qt=new WeakMap,dn=new WeakSet,ta=function(){return ut(this,Dt)??bn(this,Dt,new ResizeObserver(e=>{for(var n of e){un.entries.set(n.target,n);for(var r of ut(this,mt).get(n.target)||[])r(n)}}))},gn(un,"entries",new WeakMap);let Mn=un;var qa=new Mn({box:"border-box"});function On(a,e,n){var r=qa.observe(a,()=>n(a[e]));ya(()=>(xa(()=>n(a[e])),r))}function za(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"}],["path",{d:"M15 12h.01"}],["path",{d:"M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"}],["path",{d:"M9 12h.01"}]];xe(a,ke({name:"baby"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Rn(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["circle",{cx:"12",cy:"12",r:"10"}]];xe(a,ke({name:"circle"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Gn(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"}]];xe(a,ke({name:"diamond"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function La(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];xe(a,ke({name:"download"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Fa(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"}]];xe(a,ke({name:"hand"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ea(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2"}],["circle",{cx:"9",cy:"9",r:"2"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]];xe(a,ke({name:"image"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ta(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1"}]];xe(a,ke({name:"layout-grid"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function $a(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12"}]];xe(a,ke({name:"link-2"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ua(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]];xe(a,ke({name:"maximize"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Xa(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"}]];xe(a,ke({name:"mouse-pointer-2"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Da(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]];xe(a,ke({name:"pencil"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Oa(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]];xe(a,ke({name:"redo-2"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ms(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]];xe(a,ke({name:"save"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Yn(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]];xe(a,ke({name:"square"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ra(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]];xe(a,ke({name:"undo-2"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Is(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M12 3v12"}],["path",{d:"m17 8-5-5-5 5"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}]];xe(a,ke({name:"upload"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function In(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["circle",{cx:"9",cy:"7",r:"4"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11"}]];xe(a,ke({name:"user-plus"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ga(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{cx:"9",cy:"7",r:"4"}]];xe(a,ke({name:"users"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ya(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["circle",{cx:"11",cy:"11",r:"8"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11"}]];xe(a,ke({name:"zoom-in"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ba(a,e){const n=we(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["circle",{cx:"11",cy:"11",r:"8"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11"}]];xe(a,ke({name:"zoom-out"},()=>n,{get iconNode(){return r},children:(d,u)=>{var i=me(),c=j(i);_e(c,e,"default",{}),I(d,i)},$$slots:{default:!0}}))}function Ps(){return{individuals:[],partnerships:[],children:[]}}function ot(a){var p;const e=new Map,n=[];for(const f of a.individuals)e.set(f.id,f),n.push(f.id);const r=new Map,d=new Map,u=new Map,i=new Map;for(const f of a.partnerships){i.set(f.id,{id:f.id,parents:[f.parents[0],f.parents[1]]}),d.set(f.id,[]);for(const v of f.parents){const m=u.get(v)??[];m.push(f.id),u.set(v,m)}}for(const f of a.children){const v=i.get(f.partnershipId);!v||!e.has(f.childId)||r.has(f.childId)||(r.set(f.childId,{fatherId:v.parents[0],motherId:v.parents[1],partnershipId:v.id}),(p=d.get(v.id))==null||p.push(f.childId))}const c=[];for(const f of n)r.has(f)||c.push(f);return{individuals:e,order:n,parentsOf:r,childrenOf:d,partnershipsOf:u,partnershipById:i,founders:c}}function fn(a,e){const n=a.partnerships.find(i=>i.id===e);if(!n)return!1;const r=ot(a),d=r.individuals.get(n.parents[0]),u=r.individuals.get(n.parents[1]);return!d||!u?!1:d.sex!=="unknown"&&d.sex===u.sex}function _n(a,e,n,r){var c;const d=ot(a),u=d.partnershipById.get(e);if(!u)return{ok:!1,reason:"That relationship no longer exists."};if(!d.individuals.has(n))return{ok:!1,reason:"That individual no longer exists."};if(u.parents.includes(n))return{ok:!1,reason:"A partner cannot also be a child of the same relationship."};const i=d.parentsOf.get(n);if((i==null?void 0:i.partnershipId)===e)return{ok:!1,reason:"This individual is already a child of this couple."};if(i)return{ok:!1,reason:`${((c=d.individuals.get(n))==null?void 0:c.label)??"This individual"} already has parents. Remove the existing parent link first.`};if(fn(a,e))return{ok:!1,reason:"This couple is recorded as same-sex; this toolkit does not model same-sex biological parentage."};if(r!==void 0){const p=d.individuals.get(u.parents[0]),f=d.individuals.get(u.parents[1]),v=Math.max(bt((p==null?void 0:p.position.y)??0),bt((f==null?void 0:f.position.y)??0));if(r<=v)return{ok:!1,reason:"A child must come from a later generation row than the couple. Move the person down a row first."}}return cn(a,u.parents[0],n)||cn(a,u.parents[1],n)?{ok:!1,reason:"That would make an individual their own ancestor."}:{ok:!0}}function Wa(a){const e=[],n=ot(a);for(const c of a.partnerships){const[p,f]=c.parents;p===f&&e.push({severity:"error",message:"A partnership cannot link an individual to themselves.",individualIds:[p]});for(const v of c.parents)n.individuals.has(v)||e.push({severity:"error",message:"A partnership references an individual that no longer exists.",individualIds:[v]})}const r=new Set;for(const c of a.children)r.has(c.childId)&&e.push({severity:"error",message:"An individual is linked to more than one parent couple.",individualIds:[c.childId]}),r.add(c.childId);for(const c of a.partnerships){if(!a.children.some(v=>v.partnershipId===c.id)||!fn(a,c.id))continue;const p=n.individuals.get(c.parents[0]),f=n.individuals.get(c.parents[1]);e.push({severity:"error",message:`${(p==null?void 0:p.label)??"One partner"} and ${(f==null?void 0:f.label)??"the other partner"} are recorded as the same sex but have linked children. Remove those child links or correct the sexes.`,individualIds:[c.parents[0],c.parents[1]]})}const d=new Map,u=[],i=c=>{const p=d.get(c)??0;if(p===2)return;if(p===1){e.push({severity:"error",message:"Circular ancestry detected — an individual cannot be their own ancestor.",individualIds:[...u.slice(u.indexOf(c)),c]});return}d.set(c,1),u.push(c);const f=n.parentsOf.get(c);f&&(i(f.fatherId),i(f.motherId)),u.pop(),d.set(c,2)};for(const c of n.order)i(c);return e}function Ha(a,e){if(e!=="x-linked-dominant"&&e!=="x-linked-recessive"&&e!=="y-linked")return[];const n=ot(a),r=[];for(const[d,u]of n.parentsOf){const i=n.individuals.get(u.fatherId),c=n.individuals.get(u.motherId);(i==null?void 0:i.sex)==="female"&&r.push(`${i.label} is recorded as female but occupies the father role; under X-linked inheritance this pairing cannot produce a son.`),(c==null?void 0:c.sex)==="male"&&r.push(`${c.label} is recorded as male but occupies the mother role; under X-linked inheritance this pairing cannot produce a son.`),e==="y-linked"&&(c==null||c.sex)}return[...new Set(r)]}const An=46,Pn=74,Va=108,qn=56,na=An+Va,aa=qn;function yt(a){return aa+a*na}function bt(a){return Math.max(0,Math.round((a-aa)/na))}function rn(a,e){if(a.individuals.length===0)return yt(0);const n=Ot(a),r=Math.max(0,...n.values()),d=Math.min(Math.max(0,bt(e)),r+1);return yt(d)}const Za=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];function ra(a){return Za[a]??`G${a+1}`}function Ot(a){const e=ot(a),n=new Map;for(const r of e.order)n.set(r,0);for(let r=0;r<e.order.length+1;r++){let d=!1;for(const[u,i]of e.parentsOf){const c=n.get(i.fatherId)??0,p=n.get(i.motherId)??0,f=Math.max(c,p)+1;(n.get(u)??0)<f&&(n.set(u,f),d=!0)}if(!d)break}return n}function ja(a){const e=ot(a),n=Ot(a),r=new Map,d=new Map;for(const p of e.order){const f=n.get(p)??0,v=d.get(f)??[];v.push(p),d.set(f,v)}const u=new Map,i=Math.max(0,...d.keys()),c=p=>{const f=e.parentsOf.get(p);if(!f)return 0;const v=u.get(f.fatherId),m=u.get(f.motherId),k=[v,m].filter(_=>_!==void 0);return k.length===0?0:k.reduce((_,F)=>_+F,0)/k.length};for(let p=0;p<=i;p++){const f=d.get(p)??[];if(f.length===0)continue;const v=f.map((_,F)=>({id:_,score:c(_),index:F})).sort((_,F)=>_.score-F.score||_.index-F.index),m=[],k=new Set;for(const _ of v){if(k.has(_.id))continue;m.push(_.id),k.add(_.id);const F=e.partnershipsOf.get(_.id)??[];for(const E of F){const P=e.partnershipById.get(E);if(!P)continue;const b=P.parents[0]===_.id?P.parents[1]:P.parents[0];!k.has(b)&&(n.get(b)??0)===p&&(m.push(b),k.add(b))}}m.forEach((_,F)=>{u.set(_,qn+F*(An+Pn))})}for(const[p,f]of u){const v=n.get(p)??0;r.set(p,{x:f,y:yt(v)})}return r}function Ka(a){const e=new Set,n=a.individuals.filter(b=>e.has(b.id)?!1:(e.add(b.id),!0)),r=new Map(n.map(b=>[b.id,b])),d=new Set,u=a.partnerships.filter(b=>{const[z,O]=b.parents;return!r.has(z)||!r.has(O)||z===O||d.has([z,O].sort().join("|"))?!1:(d.add([z,O].sort().join("|")),!0)}),i=new Map(u.map(b=>[b.id,b])),c=new Set,p=a.children.filter(b=>{const z=i.get(b.partnershipId);return!z||!r.has(b.childId)||c.has(b.childId)||z.parents.includes(b.childId)?!1:(c.add(b.childId),!0)}),f={individuals:n,partnerships:u,children:p},v=Ot(f),m=ot(f),k=new Map,_=new Map;for(const b of m.order){const z=v.get(b)??0,O=_.get(z)??[];O.push(b),_.set(z,O)}const F=b=>{var z;return((z=m.individuals.get(b))==null?void 0:z.age)??-1},E=b=>{var z;return((z=m.individuals.get(b))==null?void 0:z.label)??""},P=Math.max(0,..._.keys());for(let b=0;b<=P;b++){const z=[..._.get(b)??[]];z.sort((U,be)=>F(be)-F(U)||E(U).localeCompare(E(be)));const O=new Set,Ee=[];for(const U of z){if(O.has(U))continue;const be=[U];O.add(U);for(const Be of m.partnershipsOf.get(U)??[]){const se=m.partnershipById.get(Be);if(!se)continue;const Re=se.parents[0]===U?se.parents[1]:se.parents[0];!O.has(Re)&&(v.get(Re)??0)===b&&(be.push(Re),O.add(Re))}Ee.push(be)}Ee.sort((U,be)=>Math.max(...be.map(F))-Math.max(...U.map(F)));let Y=qn;for(const U of Ee){for(const be of U)k.set(be,{x:Y,y:yt(b)}),Y+=An+Pn;Y+=Pn/2}}return f.individuals=n.map(b=>({...b,position:k.get(b.id)??b.position})),{pedigree:f,removedPartnerships:a.partnerships.length-u.length,removedLinks:a.children.length-p.length}}function Bn(a,e){const n=ra(e),r=new Set(a.individuals.map(u=>u.label).filter(u=>u.startsWith(`${n}-`)).map(u=>Number(u.split("-")[1])).filter(u=>Number.isFinite(u)));let d=1;for(;r.has(d);)d++;return`${n}-${d}`}function cn(a,e,n){const r=ot(a);let d=[e];const u=new Set;for(;d.length;){const i=[];for(const c of d){if(c===n)return!0;if(u.has(c))continue;u.add(c);const p=r.parentsOf.get(c);p&&i.push(p.fatherId,p.motherId)}d=i}return!1}class zn extends Error{constructor(n){super(`Exact inference requires a factor table of ${n.toLocaleString()} entries, which exceeds the safe limit.`);gn(this,"estimatedSize");this.name="InferenceTooLargeError",this.estimatedSize=n}}const Ln=4e6;function Ja(a,e){if(a===-1/0)return e;if(e===-1/0)return a;const n=a>e?a:e,r=a>e?e:a;return n+Math.log1p(Math.exp(r-n))}function sa(a){let e=-1/0;for(let r=0;r<a.length;r++)a[r]>e&&(e=a[r]);if(e===-1/0)return-1/0;let n=0;for(let r=0;r<a.length;r++)n+=Math.exp(a[r]-e);return e+Math.log(n)}function ia(a,e){let n=1;for(const r of a)n*=e[r]??1;return n}function Jt(a,e){const n=new Array(a.length).fill(1);for(let r=a.length-1,d=1;r>=0;r--)n[r]=d,d*=e[a[r]]??1;return n}function Wn(a,e,n){if(a.vars.length===0)return Hn(a,e);if(e.vars.length===0)return Hn(e,a);const r=[...a.vars];for(const _ of e.vars)r.includes(_)||r.push(_);const d=ia(r,n);if(d>Ln)throw new zn(d);const u=Jt(r,n),i=Jt(a.vars,n),c=Jt(e.vars,n),p=new Map;r.forEach((_,F)=>p.set(_,F));const f=a.vars.map(_=>p.get(_)??0),v=e.vars.map(_=>p.get(_)??0),m=new Float64Array(d),k=new Array(r.length).fill(0);for(let _=0;_<d;_++){let F=_;for(let b=0;b<r.length;b++){const z=u[b];k[b]=Math.floor(F/z),F-=k[b]*z}let E=0;for(let b=0;b<f.length;b++)E+=k[f[b]]*i[b];let P=0;for(let b=0;b<v.length;b++)P+=k[v[b]]*c[b];m[_]=a.log[E]+e.log[P]}return{vars:r,log:m}}function Hn(a,e){const n=a.log[0],r=new Float64Array(e.log.length);for(let d=0;d<r.length;d++)r[d]=e.log[d]+n;return{vars:[...e.vars],log:r}}function Qa(a,e,n){const r=a.vars.filter(v=>v!==e),d=ia(r,n);if(d>Ln)throw new zn(d);const u=new Float64Array(d).fill(-1/0),i=Jt(a.vars,n),c=Jt(r,n),p=new Map;r.forEach((v,m)=>p.set(v,m));const f=a.vars.map(v=>p.get(v)??-1);for(let v=0;v<a.log.length;v++){let m=v,k=0;for(let _=0;_<a.vars.length;_++){const F=i[_],E=Math.floor(m/F);m-=E*F;const P=f[_];P>=0&&(k+=E*c[P])}u[k]=Ja(u[k],a.log[v])}return{vars:r,log:u}}function er(a,e){var i;const n=new Map,r=c=>{let p=n.get(c);return p||(p=new Set,n.set(c,p)),p};for(const c of a){const p=c.vars.filter(f=>!e.has(f));for(let f=0;f<p.length;f++)for(let v=f+1;v<p.length;v++)r(p[f]).add(p[v]),r(p[v]).add(p[f])}const d=new Set(n.keys()),u=[];for(;d.size>0;){let c="",p=1/0;for(const m of d){const k=[...n.get(m)??[]].filter(F=>d.has(F));let _=0;for(let F=0;F<k.length;F++)for(let E=F+1;E<k.length;E++)(i=n.get(k[F]))!=null&&i.has(k[E])||_++;_<p&&(p=_,c=m)}const f=c||[...d][0],v=[...n.get(f)??[]].filter(m=>d.has(m));for(let m=0;m<v.length;m++)for(let k=m+1;k<v.length;k++)r(v[m]).add(v[k]),r(v[k]).add(v[m]);d.delete(f),u.push(f)}return u}function oa(a,e,n=[]){const r=new Set(n),d=er(a,r);let u=a.map(f=>({vars:[...f.vars],log:f.log}));for(const f of d){const v=u.filter(k=>k.vars.includes(f));if(v.length===0)continue;u=u.filter(k=>!k.vars.includes(f));let m=v[0];for(let k=1;k<v.length;k++)m=Wn(m,v[k],e);u.push(Qa(m,f,e))}let i;if(u.length===0)i={vars:[],log:new Float64Array([0])};else{i=u[0];for(let f=1;f<u.length;f++)i=Wn(i,u[f],e)}const c=sa(i.log);if(n.length===0||c===-1/0)return{logZ:c,factor:n.length>0?i:null};const p=new Float64Array(i.log.length);for(let f=0;f<i.log.length;f++)p[f]=Math.exp(i.log[f]-c);return{logZ:c,factor:{vars:i.vars,log:p}}}const hn=.01;function tr(a,e,n,r){const d=a.status==="carrier",u=a.carrier??(d?"carrier":"unknown"),i=u!=="unknown"?u:a.status==="unaffected"&&r?"non-carrier":"unknown",c=new Float64Array(n.length),p=a.genotype&&a.genotype.trim().length>0?sn(a.genotype,e,a.sex):null;for(let f=0;f<n.length;f++){const v=n[f];let m=!0;if(a.status==="affected"?m=on(e,v)==="affected":(a.status==="unaffected"||d)&&(m=on(e,v)!=="affected"),m&&i!=="unknown"){const k=Ma(e,v);m=i==="carrier"?k===1:k===0}m&&p&&p!==v&&(m=!1),c[f]=m?0:-1/0}return{vars:[a.id],log:c}}function nr(a,e,n){const r=Kn(e,a.sex),{probabilities:d}=ka(e,a.sex,n),u=new Float64Array(r.length);for(let i=0;i<r.length;i++)u[i]=d[i]>0?Math.log(d[i]):-1/0;return{vars:[a.id],log:u}}function la(a,e,n={}){const r=n.alleleFrequency??hn,d=n.unaffectedMeansNonCarrier??!1;if(!(r>0&&r<1))throw new Error("Allele frequency must be between 0 and 1 (exclusive).");const u=ot(a),i=[],c={},p={},f=[];for(const m of u.order){const k=u.individuals.get(m);if(!k)continue;const _=Kn(e,k.sex);p[m]=_,c[m]=_.length,f.push(m)}const v=[];for(const m of u.order){const k=u.individuals.get(m);k&&(u.parentsOf.has(m)||v.push(nr(k,e,r)),v.push(tr(k,e,p[m],d)))}for(const[m,k]of u.parentsOf){const _=u.individuals.get(m),F=u.individuals.get(k.fatherId),E=u.individuals.get(k.motherId);if(!_||!F||!E)continue;const P=p[F.id],b=p[E.id],z=p[_.id];if(!P||!b||!z)continue;const O=P.length*b.length*z.length;if(O>Ln)throw new Error(`Pedigree is too large to analyse exactly: one transmission table would need ${O.toLocaleString()} entries.`);const Ee=new Float64Array(O).fill(-1/0);for(let Y=0;Y<P.length;Y++)for(let U=0;U<b.length;U++){const be=wa(e,P[Y],b[U],_.sex);for(const[Be,se]of be){const Re=z.indexOf(Be);if(Re<0||se<=0)continue;const tt=(Y*b.length+U)*z.length+Re;Ee[tt]=Math.log(se)}}v.push({vars:[F.id,E.id,_.id],log:Ee})}return i.push(...Ha(a,e)),{model:e,pedigree:a,graph:u,variables:f,cards:c,factors:v,statesById:p,alleleFrequency:r,unaffectedMeansNonCarrier:d,warnings:[...new Set(i)]}}function ca(a){const{logZ:e}=oa(a.factors,a.cards,[]);return e}function ar(a,e){const n=a.statesById[e]??[];if(n.length===0)return{states:[],probabilities:[]};if(n.length===1)return{states:n,probabilities:[1]};const{logZ:r,factor:d}=oa(a.factors,a.cards,[e]);if(!d||r===-1/0)return{states:n,probabilities:n.map(()=>0)};const u=n.map(()=>0),i=d.vars.indexOf(e);if(i<0)return{states:n,probabilities:u};if(d.vars.length===1){for(let v=0;v<n.length;v++)u[v]=d.log[v]??0;return{states:n,probabilities:u}}const c=d.vars.slice(i+1).reduce((v,m)=>v*(a.cards[m]??1),1),p=d.vars.slice(0,i).reduce((v,m)=>v*(a.cards[m]??1),1);for(let v=0;v<p;v++)for(let m=0;m<n.length;m++){let k=0;for(let _=0;_<c;_++)k+=d.log[(v*n.length+m)*c+_]??0;u[m]+=k}const f=u.reduce((v,m)=>v+m,0)||1;return{states:n,probabilities:u.map(v=>v/f)}}const Vn={alleleFrequency:hn,equalModelPriors:!0,unaffectedMeaning:"Unaffected means not affected; a carrier is possible (carrier status is not excluded)",penetrance:"Complete penetrance (genotype fully determines phenotype)",deNovo:"No de novo mutations",phenocopies:"No phenocopies",sexDetermination:"Standard XX/XY inheritance for sex-linked models"};function da(a,e){return{...Vn,alleleFrequency:a,unaffectedMeaning:e?"Unaffected also means not a carrier (carrier status is excluded)":Vn.unaffectedMeaning}}function rr(a){const e=ot(a),n={totalObserved:0,affectedMales:0,affectedFemales:0,affectedUnknownSex:0,maleToMale:0,affectedFatherWithUnaffectedDaughter:0,affectedFatherWithAffectedDaughter:0,unaffectedParentsWithAffectedChild:0,affectedChildWithUnaffectedFather:0,affectedChildWithUnaffectedMother:0,consanguineous:0};for(const d of a.individuals)d.status!=="unknown"&&(n.totalObserved++,d.status==="affected"&&(d.sex==="male"?n.affectedMales++:d.sex==="female"?n.affectedFemales++:n.affectedUnknownSex++));const r=d=>{const u=new Set,i=[d];for(;i.length;){const c=i.pop(),p=e.parentsOf.get(c);if(p)for(const f of[p.fatherId,p.motherId])u.has(f)||(u.add(f),i.push(f))}return u};for(const[d,u]of e.parentsOf){const i=e.individuals.get(d),c=e.individuals.get(u.fatherId),p=e.individuals.get(u.motherId);!i||!c||!p||(i.status==="affected"&&(c.status==="unaffected"&&n.affectedChildWithUnaffectedFather++,p.status==="unaffected"&&n.affectedChildWithUnaffectedMother++,c.status!=="affected"&&p.status!=="affected"&&n.unaffectedParentsWithAffectedChild++,c.sex==="male"&&c.status==="affected"&&i.sex==="male"&&n.maleToMale++,c.status==="affected"&&i.sex==="female"&&n.affectedFatherWithAffectedDaughter++),c.status==="affected"&&i.sex==="female"&&i.status==="unaffected"&&n.affectedFatherWithUnaffectedDaughter++,(r(c.id).has(p.id)||r(p.id).has(c.id))&&n.consanguineous++)}return n}function sr(a){const e=[];return a.maleToMale>0&&e.push("Male-to-male transmission is present, which is incompatible with X-linked inheritance but compatible with autosomal and Y-linked models."),a.affectedFatherWithUnaffectedDaughter>0&&e.push("An affected father has an unaffected daughter, which X-linked dominant inheritance cannot explain."),a.unaffectedParentsWithAffectedChild>0&&e.push("An affected child has two unaffected parents, which points towards a recessive model."),a.affectedFemales>0&&e.push("Females are affected, which rules out strictly Y-linked inheritance."),a.affectedChildWithUnaffectedFather>0&&a.affectedFemales>0&&e.push("An affected female has an unaffected father, which X-linked recessive inheritance cannot explain."),a.consanguineous>0&&e.push("Consanguinity is present in the pedigree; recessive models gain support from shared ancestry."),a.affectedMales>0&&a.affectedFemales===0&&e.push("Only males are affected so far, which makes sex-linked and Y-linked models worth considering."),e}function ir(a,e){const n=[];return a==="x-linked-dominant"&&e.affectedFatherWithUnaffectedDaughter>0&&n.push("Contradicted by an affected father with an unaffected daughter."),a==="x-linked-recessive"&&e.affectedChildWithUnaffectedFather>0&&e.affectedFemales>0&&n.push("Contradicted by an affected female whose father is unaffected."),a==="y-linked"&&(e.affectedFemales>0&&n.push("Contradicted by affected females."),e.affectedUnknownSex>0&&n.push("Y-linked inheritance cannot explain affected individuals of unknown sex."),e.affectedMales===0&&e.totalObserved>0&&n.push("No affected males are recorded.")),(a==="autosomal-dominant"||a==="x-linked-dominant")&&e.unaffectedParentsWithAffectedChild>0&&n.push("Requires an unaffected parent to carry a variant that is fully dominant."),a==="autosomal-recessive"&&(e.unaffectedParentsWithAffectedChild>0&&n.push("Explained naturally by two carrier parents."),e.consanguineous>0&&n.push("Shared ancestry increases the chance of two carrier partners.")),n}const or=["autosomal-dominant","autosomal-recessive","x-linked-dominant","x-linked-recessive","y-linked"];function lr(a,e){return a>=.9?"strong":a>=.7?"moderate":"weak"}function Ss(a,e={}){var E;const n=((E=e.enabledModels)!=null&&E.length?e.enabledModels:or).slice(),r=e.alleleFrequency??hn,d=e.unaffectedMeansNonCarrier??!1,u=da(r,d),i=[],c=rr(a),p=sr(c),f=n.map(P=>{let b=-1/0;try{const O=la(a,P,{alleleFrequency:r,unaffectedMeansNonCarrier:d});b=ca(O),i.push(...O.warnings)}catch(O){(O instanceof zn||O instanceof Error)&&i.push(`${Jn(P).label}: ${O.message}`),b=Number.NaN}const z=Number.isFinite(b)&&b>-1/0;return{model:P,logLikelihood:Number.isNaN(b)?-1/0:b,likelihood:z?Math.exp(b):0,posterior:0,compatible:z,strength:z?"weak":"incompatible",notes:ir(P,c),approximate:!1}});if(!f.some(P=>P.compatible))return{results:f,enabledModels:n,incompatible:!0,inconclusive:!0,topModel:null,topPosterior:0,assumptions:u,observations:p,approximate:!1,warnings:[...new Set(i)]};const m=sa(f.map(P=>P.compatible?P.logLikelihood+Math.log(1/n.length):-1/0));for(const P of f){if(!P.compatible){P.posterior=0;continue}const b=P.logLikelihood+Math.log(1/n.length)-m;P.posterior=Math.exp(b),P.strength=lr(P.posterior)}const k=f.reduce((P,b)=>P+b.posterior,0);if(k>0)for(const P of f)P.posterior=P.posterior/k;const F=[...f].filter(P=>P.compatible).sort((P,b)=>b.posterior-P.posterior)[0]??null;return{results:f,enabledModels:n,incompatible:!1,inconclusive:F!==null&&F.posterior<.6,topModel:F?F.model:null,topPosterior:F?F.posterior:0,assumptions:u,observations:p,approximate:!1,warnings:[...new Set(i)]}}function cr(a,e){return on(a,e)}function dr(){return{affected:0,carrier:0,unaffected:0}}function Cs(a,e,n={}){const r=n.alleleFrequency??hn,d=n.unaffectedMeansNonCarrier??!1,u=da(r,d),i=[],c=[];let p=!0,f;try{f=la(a,e,{alleleFrequency:r,unaffectedMeansNonCarrier:d})}catch(v){return{model:e,solutions:[],compatible:!1,approximate:!1,warnings:[v.message],assumptions:u}}i.push(...f.warnings),ca(f)===-1/0&&(p=!1);for(const v of a.individuals){const m=ur(f,v,e);m&&c.push(m)}return p||i.push("The supplied observations cannot all be true under this model, so the distributions below are not normalised."),{model:e,solutions:c,compatible:p,approximate:!1,warnings:[...new Set(i)],assumptions:u}}function ur(a,e,n){var m;const{states:r,probabilities:d}=ar(a,e.id);if(r.length===0)return null;const u=dr(),i=[];for(let k=0;k<r.length;k++){const _=d[k]??0;if(_<=0)continue;const F=r[k];u[cr(n,F)]+=_;const{sex:E}=Ia(n,F);i.push({genotype:F,probability:_,sex:E??null})}i.sort((k,_)=>_.probability-k.probability);const c=u.affected+u.carrier+u.unaffected||1;u.affected/=c,u.carrier/=c,u.unaffected/=c;const p=i[0],f=[["affected",u.affected],["carrier",u.carrier],["unaffected",u.unaffected]];f.sort((k,_)=>_[1]-k[1]);const v=f.every(([,k])=>k<.5);return{individualId:e.id,label:(m=e.name)!=null&&m.trim()?`${e.label} · ${e.name}`:e.label,status:u,genotypes:i,mostLikelyGenotype:p?Qn(n,p.genotype):"—",mostLikelyGenotypeProbability:p?p.probability:0,mostLikelyStatus:f[0][0],confidence:p?p.probability:0,observed:e.status!=="unknown",inferred:e.status==="unknown",note:v?"Insufficient information to resolve this individual.":void 0}}function ft(a,e){return typeof document>"u"?e:getComputedStyle(document.documentElement).getPropertyValue(a).trim()||e}function fr(){const a=ft("--surface-2","#edf2ea"),e=ft("--text","#18382f"),n=ft("--text-muted","#718078"),r=ft("--border-strong","#c4d0c1"),d=ft("--accent","#80b77c"),u=ft("--accent-strong","#356b3f"),i=ft("--font-sans","system-ui, sans-serif"),c=ft("--font-mono","monospace");return`
svg { background: ${a}; }
.link { stroke: ${r}; stroke-width: 1.6; fill: none; }
.shape { fill: #fff; stroke: ${e}; stroke-width: 1.7; }
.shape.affected { fill: ${e}; }
.shape.unknown { stroke-dasharray: 4 3.5; }
.deceased-line { stroke: ${e}; stroke-width: 1.7; }
.divorce-mark { stroke: ${e}; stroke-width: 2; }
.carrier-half { fill: ${e}; }
.label { font-family: ${i}; font-size: 11px; font-weight: 600; fill: ${n}; }
.name { font-family: ${i}; font-size: 10px; fill: ${n}; }
.genotype { font-family: ${c}; font-size: 10px; fill: ${e}; }
.genotype.inferred { fill: ${u}; }
.select-ring { fill: none; stroke: ${d}; stroke-width: 2; }
`}function hr(a,e){ea(e,new Blob([a],{type:"image/svg+xml;charset=utf-8"}))}async function vr(a,e,n,r,d=2){const u=new Blob([a],{type:"image/svg+xml;charset=utf-8"}),i=URL.createObjectURL(u);try{const c=new Image;c.decoding="sync",await new Promise((m,k)=>{c.onload=()=>m(),c.onerror=()=>k(new Error("The diagram could not be rasterised.")),c.src=i});const p=document.createElement("canvas");p.width=Math.max(1,Math.round(n*d)),p.height=Math.max(1,Math.round(r*d));const f=p.getContext("2d");if(!f)throw new Error("Canvas is unavailable in this browser.");f.fillStyle=ft("--surface-2","#edf2ea"),f.fillRect(0,0,p.width,p.height),f.drawImage(c,0,0,p.width,p.height);const v=await new Promise(m=>p.toBlob(m,"image/png"));if(!v)throw new Error("The PNG could not be generated.");ea(e,v)}finally{URL.revokeObjectURL(i)}}var pr=Fe('<line class="generation-guide svelte-879lln" data-export="hide"></line><text class="generation-label svelte-879lln" data-export="hide"> </text>',1),gr=Fe('<line class="divorce-mark svelte-879lln"></line>'),mr=Fe('<line class="link svelte-879lln"></line>'),br=Fe('<line class="link svelte-879lln"></line><!>',1),yr=Fe('<line data-export="hide"></line><circle data-export="hide"></circle>',1),xr=Fe('<text class="union-tag svelte-879lln" text-anchor="middle" data-export="hide"> </text>'),_r=Fe('<!><line class="link svelte-879lln"></line><line></line><!><line class="link-hit svelte-879lln" data-export="hide" role="button" tabindex="0"><title> </title></line><!><!>',1),wr=Fe('<circle class="select-ring svelte-879lln"></circle>'),kr=Fe("<circle></circle>"),Mr=Fe('<rect rx="3"></rect>'),Ir=Fe("<path></path>"),Pr=Fe('<line class="deceased-line svelte-879lln"></line>'),Zn=Fe('<path class="carrier-half svelte-879lln"></path>'),Sr=Fe('<rect class="carrier-half svelte-879lln"></rect>'),Cr=Fe('<text text-anchor="middle"> </text>'),Nr=Fe('<text class="name svelte-879lln" text-anchor="middle"> </text>'),Ar=Fe('<g role="button" tabindex="0"><!><!><!><!><text class="label svelte-879lln" text-anchor="middle"> </text><!><!></g>'),Zt=te('<span class="menu-dot svelte-879lln" aria-hidden="true"></span>'),wn=te('<button type="button" class="menu-item svelte-879lln" role="menuitemradio"><!> </button>'),qr=te("<!> Mark as living",1),zr=te("<!> Mark as deceased",1),Lr=te('<p class="menu-title svelte-879lln"> <span class="menu-sub svelte-879lln"> </span></p> <button type="button" class="menu-item svelte-879lln" role="menuitem"><!> Edit details</button> <p class="menu-label svelte-879lln">Sex</p> <!> <p class="menu-label svelte-879lln">Phenotype</p> <!> <p class="menu-label svelte-879lln">Carrier status</p> <!> <div class="menu-sep svelte-879lln" role="separator"></div> <button type="button" class="menu-item svelte-879lln" role="menuitem"><!></button> <button type="button" class="menu-item svelte-879lln" role="menuitem"><!> Add a partner</button> <button type="button" class="menu-item danger svelte-879lln" role="menuitem"><!> Delete individual</button>',1),Fr=te('<p class="menu-note svelte-879lln">Same-sex relationship — this toolkit does not attach biological children.</p>'),Er=te('<p class="menu-title svelte-879lln"> <span class="menu-sub svelte-879lln"> </span></p> <button type="button" class="menu-item svelte-879lln" role="menuitemradio"><!> Married / partners</button> <button type="button" class="menu-item svelte-879lln" role="menuitemradio"><!> Divorced / separated</button> <!> <div class="menu-sep svelte-879lln" role="separator"></div> <button type="button" class="menu-item danger svelte-879lln" role="menuitem"><!> Remove relationship</button>',1),Tr=te('<div class="menu svelte-879lln" role="menu"><!></div>'),$r=te(`<div class="canvas-empty svelte-879lln"><p class="canvas-empty-title svelte-879lln">Start a pedigree</p> <p class="canvas-empty-text svelte-879lln">Pick a symbol from the toolbar and click anywhere on the canvas. Drag one person onto another to
				link them, then drag a person onto the <strong>branch below a couple</strong> to make them a child.
				Right-click a person or a link for quick actions.</p></div>`),Ur=te('<div class="canvas-wrap svelte-879lln"><svg class="canvas svelte-879lln" role="application" aria-label="Pedigree diagram. Drag people between generation rows, drag a person onto a relationship to make them a child, or right-click a person or link for quick actions."><g data-world=""><!><!><!></g></svg> <!> <!></div>');function Xr(a,e){Cn(e,!0);const n=46,r=n/2,d=40;let u,i=null,c=ze(null),p=ze(900),f=ze(560),v=ze(an({x:0,y:0,k:1})),m=ze(null),k=ze(!1),_=ze(null),F=ze(null),E=ze(null),P=ze(null);const b=le(()=>new Map(e.pedigree.individuals.map(o=>[o.id,o]))),z=le(()=>e.pedigree.partnerships.map(o=>{const s=t(b).get(o.parents[0]),C=t(b).get(o.parents[1]);if(!s||!C)return null;const N=e.pedigree.children.filter(he=>he.partnershipId===o.id).map(he=>t(b).get(he.childId)).filter(he=>!!he),X=Math.max(s.position.y,C.position.y),G=(s.position.x+C.position.x)/2,J=X+r+58,fe=N.map(he=>he.position.x);return{id:o.id,a:s,b:C,relationship:o.relationship??"married",blocked:fn(e.pedigree,o.id),y:X,midX:G,busY:J,children:N,minX:fe.length?Math.min(...fe):G,maxX:fe.length?Math.max(...fe):G}}).filter(o=>!!o)),O=le(()=>{if(e.pedigree.individuals.length===0)return[];const o=Ot(e.pedigree),s=Math.max(0,...o.values());return Array.from({length:s+2},(C,N)=>({index:N,label:ra(N),y:yt(N)}))}),Ee=le(()=>{if(e.pedigree.individuals.length===0)return{x1:0,x2:0};const o=e.pedigree.individuals.map(s=>s.position.x);return{x1:Math.min(...o)-115,x2:Math.max(...o)+110}}),Y=le(()=>{const o=t(E);return!o||o.kind!=="person"?null:t(b).get(o.id)??null}),U=le(()=>{const o=t(E);return!o||o.kind!=="union"?null:t(z).find(s=>s.id===o.id)??null}),be=le(()=>{if(!t(E))return"";const o=Wt(t(E).x,8,Math.max(8,t(p)-224)),s=Wt(t(E).y,8,Math.max(8,t(f)-340));return`left:${o}px; top:${s}px;`});function Be(o){if(!i)return{x:0,y:0};const s=i.getBoundingClientRect();return{x:(o.clientX-s.left-t(v).x)/t(v).k,y:(o.clientY-s.top-t(v).y)/t(v).k}}function se(o){var X;const s=e.inferred[o.id],C=(X=o.genotype)!=null&&X.trim()?o.genotype:null,N=C?sn(C,e.model,o.sex):null;return N?{text:kn($n(N,{sex:e.showSexInGenotype}),e.alleleLetter),inferred:!1,uncertain:!1}:s?{text:kn($n(s.genotype,{sex:e.showSexInGenotype}),e.alleleLetter),inferred:!0,uncertain:s.probability<.985}:{text:"",inferred:!1,uncertain:!1}}const Re=le(()=>e.model==="autosomal-recessive"||e.model==="x-linked-recessive");function tt(){return e.carrierDisplay==="never"?!1:e.carrierDisplay==="recessive-only"?t(Re):!0}function nt(o){if(!tt())return!1;const s=o.carrier??"unknown";if(s==="carrier")return!0;if(s==="non-carrier")return!1;const C=e.inferred[o.id];if(C)return Un(e.model,C.genotype);if(o.genotype){const N=sn(o.genotype,e.model,o.sex);return N?Un(e.model,N):!1}return!1}function Nt(o){const s=nt(o);if(o.status==="unknown")return s?"status unknown, carrier":"status unknown";if(o.status==="affected")return s?"affected carrier":"affected";const C=e.inferred[o.id];return C&&e.showGenotypes&&!s?`unaffected, inferred ${Pa(e.model,C.genotype,e.heterozygoteAsCarrier)}`:s?"unaffected carrier":"unaffected"}function We(o){const s=["shape"];return o.status==="affected"&&!nt(o)&&s.push("affected"),o.status==="unknown"&&s.push("unknown"),s.join(" ")}function Te(o,s){if(o.button===2)return;if(o.stopPropagation(),L(E,null),e.tool==="partner"){ht(s.id);return}if(e.tool==="male"||e.tool==="female"||e.tool==="unknown"){e.onselect(s.id);return}if(e.tool==="pan"){xt(o);return}e.onselect(s.id);const C=Be(o);L(P,{kind:"node",id:s.id,offset:{x:s.position.x-C.x,y:s.position.y-C.y},sourceRow:bt(s.position.y)},!0),i==null||i.setPointerCapture(o.pointerId)}function ht(o){if(!t(m)){L(m,o,!0),e.onselect(o),e.onnotice("Now click the second person. You will be asked what the relationship is.");return}if(t(m)===o){L(m,null);return}e.onlink(t(m),o),L(m,null)}function xt(o){L(E,null),L(P,{kind:"pan",startX:o.clientX,startY:o.clientY,originX:t(v).x,originY:t(v).y},!0),i==null||i.setPointerCapture(o.pointerId)}function At(o){if(o.button===2){L(E,null);return}if(o.button===1||e.tool==="pan"){xt(o);return}if(e.tool==="male"||e.tool==="female"||e.tool==="unknown"){const s=Be(o);e.oncreate(e.tool,{x:Math.round(s.x),y:rn(e.pedigree,s.y)});return}e.onselect(null),L(m,null),L(E,null)}function Ke(o,s,C){const N=C.x-s.x,X=C.y-s.y,G=N*N+X*X,J=G===0?0:Math.max(0,Math.min(1,((o.x-s.x)*N+(o.y-s.y)*X)/G));return Math.hypot(o.x-(s.x+J*N),o.y-(s.y+J*X))}function qt(o){let s=d,C=null;for(const N of t(z)){const X=Ke(o,{x:N.midX,y:N.y},{x:N.midX,y:N.busY});X<s&&(s=X,C=N.id)}L(_,C,!0)}function _t(o){if(!t(P))return;if(t(P).kind==="pan"){L(v,{...t(v),x:t(P).originX+(o.clientX-t(P).startX),y:t(P).originY+(o.clientY-t(P).startY)},!0);return}const s=Be(o),C=Math.round((s.x+t(P).offset.x)/2)*2,N=s.y+t(P).offset.y;e.onmove(t(P).id,{x:C,y:rn(e.pedigree,N)}),qt({x:C,y:N})}function wt(){var o;((o=t(P))==null?void 0:o.kind)==="node"&&t(_)&&e.ondropchild(t(_),t(P).id,t(P).sourceRow),L(P,null),L(_,null)}function lt(o,s,C){o.preventDefault(),o.stopPropagation(),L(m,null);const N=u.getBoundingClientRect();L(E,{kind:s,id:C,x:o.clientX-N.left,y:o.clientY-N.top},!0)}function kt(o){const s=t(z).find(C=>C.id===o);s&&L(E,{kind:"union",id:o,x:t(v).x+s.midX*t(v).k,y:t(v).y+s.y*t(v).k},!0)}function zt(o){L(E,null),e.onselect(o)}function He(o,s){L(E,null),e.onpatch(o,s)}function Mt(o){if(o.preventDefault(),!i)return;const s=i.getBoundingClientRect(),C=o.clientX-s.left,N=o.clientY-s.top,X=Math.exp(-o.deltaY*.0015),G=Wt(t(v).k*X,.25,2.6),J=(C-t(v).x)/t(v).k,fe=(N-t(v).y)/t(v).k;L(v,{k:G,x:C-J*G,y:N-fe*G},!0)}function Lt(o,s){if(o.key==="Enter"||o.key===" "){o.preventDefault(),e.onselect(s.id);return}const C=o.shiftKey?20:8,X={ArrowUp:{x:0,y:-C},ArrowDown:{x:0,y:C},ArrowLeft:{x:-C,y:0},ArrowRight:{x:C,y:0}}[o.key];X&&(o.preventDefault(),e.onmove(s.id,{x:s.position.x+X.x,y:rn(e.pedigree,s.position.y+X.y)}))}function Ft(){if(e.pedigree.individuals.length===0)return{x:0,y:0,w:640,h:480};let o=1/0,s=1/0,C=-1/0,N=-1/0;for(const G of e.pedigree.individuals)o=Math.min(o,G.position.x),C=Math.max(C,G.position.x),s=Math.min(s,G.position.y),N=Math.max(N,G.position.y);const X=76;return{x:o-X,y:s-X,w:C-o+X*2,h:N-s+X*2}}function Et(){const o=Ft();if(t(p)<=0||t(f)<=0)return;const s=Wt(Math.min(t(p)/o.w,t(f)/o.h),.25,1.5);L(v,{k:s,x:(t(p)-o.w*s)/2-o.x*s,y:(t(f)-o.h*s)/2-o.y*s},!0)}function It(o){L(m,o,!0),e.onnotice("Now click the second person. You will be asked what the relationship is.")}function Pt(o){const s=Wt(t(v).k*o,.25,2.6),C=t(p)/2,N=t(f)/2,X=(C-t(v).x)/t(v).k,G=(N-t(v).y)/t(v).k;L(v,{k:s,x:C-X*s,y:N-G*s},!0)}function St(){if(!i)return{markup:"",width:0,height:0};const o=Ft(),s=i.cloneNode(!0);s.setAttribute("xmlns","http://www.w3.org/2000/svg"),s.setAttribute("viewBox",`${o.x} ${o.y} ${o.w} ${o.h}`),s.setAttribute("width",String(Math.round(o.w))),s.setAttribute("height",String(Math.round(o.h)));const C=s.querySelector("[data-world]");C==null||C.setAttribute("transform","translate(0 0) scale(1)");for(const X of s.querySelectorAll('[data-export="hide"]'))X.remove();const N=document.createElementNS("http://www.w3.org/2000/svg","style");return N.textContent=fr(),s.insertBefore(N,s.firstChild),{markup:new XMLSerializer().serializeToString(s),width:Math.round(o.w),height:Math.round(o.h)}}jt(()=>{t(k)||t(p)>0&&e.pedigree.individuals.length>0&&(L(k,!0),Et())}),jt(()=>{e.pedigree.individuals.length===0&&L(k,!1)}),jt(()=>{var s,C;if(!t(E))return;(C=(s=t(c))==null?void 0:s.querySelector("button"))==null||C.focus();const o=N=>{if(N instanceof KeyboardEvent&&N.key==="Escape"){L(E,null);return}N instanceof PointerEvent&&t(c)&&N.target instanceof Node&&(t(c).contains(N.target)||L(E,null))};return window.addEventListener("keydown",o),window.addEventListener("pointerdown",o,!0),()=>{window.removeEventListener("keydown",o),window.removeEventListener("pointerdown",o,!0)}});const vt=le(()=>e.tool==="pan"?"grab":e.tool==="select"?"default":"crosshair"),Ct=[{value:"affected",label:"Affected"},{value:"unaffected",label:"Unaffected"},{value:"unknown",label:"Unknown"}],Tt=[{value:"carrier",label:"Carrier"},{value:"non-carrier",label:"Not a carrier"},{value:"unknown",label:"Carrier unknown"}],Rt=[{value:"male",label:"Male"},{value:"female",label:"Female"},{value:"unknown",label:"Unspecified"}];var $t={fit:Et,beginPartnerFrom:It,zoomBy:Pt,toSvgMarkup:St},at=Ur(),T=S(at);let D;var R=S(T),ue=S(R);Oe(ue,17,()=>t(O),o=>o.index,(o,s)=>{var C=pr(),N=j(C),X=g(N),G=ae(X);B(()=>{w(N,"x1",t(Ee).x1),w(N,"y1",t(s).y),w(N,"x2",t(Ee).x2),w(N,"y2",t(s).y),w(X,"x",t(Ee).x1+8),w(X,"y",t(s).y-9),H(G,`Generation ${t(s).label??""}`)}),I(o,C)});var pe=g(ue);Oe(pe,17,()=>t(z),o=>o.id,(o,s)=>{var C=_r(),N=j(C);{var X=V=>{var ne=gr();B(()=>{w(ne,"x1",t(s).midX-6),w(ne,"y1",t(s).y-10),w(ne,"x2",t(s).midX+6),w(ne,"y2",t(s).y+10)}),I(V,ne)};ee(N,V=>{t(s).relationship==="divorced"&&V(X)})}var G=g(N),J=g(G);let fe;var he=g(J);{var ct=V=>{var ne=br(),oe=j(ne),Ue=g(oe);Oe(Ue,17,()=>t(s).children,ye=>ye.id,(ye,Se)=>{var A=mr();B(()=>{w(A,"x1",t(Se).position.x),w(A,"y1",t(s).busY),w(A,"x2",t(Se).position.x),w(A,"y2",t(Se).position.y-r)}),I(ye,A)}),B(()=>{w(oe,"x1",t(s).minX),w(oe,"y1",t(s).busY),w(oe,"x2",t(s).maxX),w(oe,"y2",t(s).busY)}),I(V,ne)};ee(he,V=>{t(s).children.length>0&&V(ct)})}var ge=g(he),Me=S(ge),it=ae(Me);x(ge);var Ge=g(ge);{var Qe=V=>{var ne=yr(),oe=j(ne);let Ue;var ye=g(oe);let Se;B(()=>{Ue=De(oe,0,"drop-branch svelte-879lln",null,Ue,{hot:t(_)===t(s).id}),w(oe,"x1",t(s).midX),w(oe,"y1",t(s).y),w(oe,"x2",t(s).midX),w(oe,"y2",t(s).busY),Se=De(ye,0,"drop-target svelte-879lln",null,Se,{hot:t(_)===t(s).id,blocked:t(s).blocked}),w(ye,"cx",t(s).midX),w(ye,"cy",t(s).busY),w(ye,"r",t(_)===t(s).id?16:10)}),I(V,ne)};ee(Ge,V=>{var ne;((ne=t(P))==null?void 0:ne.kind)==="node"&&V(Qe)})}var Ae=g(Ge);{var Ve=V=>{var ne=xr(),oe=ae(ne,!0);B(()=>{w(ne,"x",t(s).midX),w(ne,"y",t(s).busY+18),H(oe,t(s).relationship==="divorced"?"divorced":"partners")}),I(V,ne)};ee(Ae,V=>{t(F)===t(s).id&&!t(P)&&V(Ve)})}B((V,ne)=>{w(G,"x1",t(s).a.position.x),w(G,"y1",t(s).y),w(G,"x2",t(s).b.position.x),w(G,"y2",t(s).y),fe=De(J,0,"link svelte-879lln",null,fe,{"drop-hot":t(_)===t(s).id}),w(J,"x1",t(s).midX),w(J,"y1",t(s).y),w(J,"x2",t(s).midX),w(J,"y2",t(s).busY),w(ge,"x1",V),w(ge,"y1",t(s).y),w(ge,"x2",ne),w(ge,"y2",t(s).y),w(ge,"aria-label",`Relationship between ${t(s).a.label} and ${t(s).b.label}. Press Enter for actions.`),H(it,`${t(s).a.label??""} and ${t(s).b.label??""} — ${t(s).relationship??""}. Right-click for actions.`)},[()=>Math.min(t(s).a.position.x,t(s).b.position.x),()=>Math.max(t(s).a.position.x,t(s).b.position.x)]),tn("pointerenter",ge,()=>L(F,t(s).id,!0)),tn("pointerleave",ge,()=>L(F,null)),$("contextmenu",ge,V=>lt(V,"union",t(s).id)),$("keydown",ge,V=>{(V.key==="Enter"||V.key===" ")&&(V.preventDefault(),kt(t(s).id))}),I(o,C)});var $e=g(pe);Oe($e,17,()=>e.pedigree.individuals,o=>o.id,(o,s)=>{const C=le(()=>se(t(s))),N=le(()=>t(m)===t(s).id);var X=Ar();let G;var J=S(X);{var fe=A=>{var q=wr();w(q,"r",r+6),B(()=>w(q,"data-export",e.selection===t(s).id?void 0:"hide")),I(A,q)};ee(J,A=>{(e.selection===t(s).id||t(N))&&A(fe)})}var he=g(J);{var ct=A=>{var q=kr();w(q,"r",r),B(W=>De(q,0,W,"svelte-879lln"),[()=>yn(We(t(s)))]),I(A,q)},ge=A=>{var q=Mr();w(q,"x",-r),w(q,"y",-r),w(q,"width",n),w(q,"height",n),B(W=>De(q,0,W,"svelte-879lln"),[()=>yn(We(t(s)))]),I(A,q)},Me=A=>{var q=Ir();w(q,"d","M0,-25 L25,0 L0,25 L-25,0 Z"),B(W=>De(q,0,W,"svelte-879lln"),[()=>yn(We(t(s)))]),I(A,q)};ee(he,A=>{t(s).sex==="female"?A(ct):t(s).sex==="male"?A(ge,1):A(Me,-1)})}var it=g(he);{var Ge=A=>{var q=Pr();w(q,"x1",-r-7),w(q,"y1",r+7),w(q,"x2",r+7),w(q,"y2",-r-7),I(A,q)};ee(it,A=>{t(s).vital==="deceased"&&A(Ge)})}var Qe=g(it);{var Ae=A=>{var q=me(),W=j(q);{var ie=qe=>{var Ie=Zn();w(Ie,"d",`M0,-${r} A ${r} ${r} 0 0 0 0,${r} Z`),I(qe,Ie)},Ze=qe=>{var Ie=Sr();w(Ie,"x",-r),w(Ie,"y",-r),w(Ie,"width",r),w(Ie,"height",n),I(qe,Ie)},dt=qe=>{var Ie=Zn();w(Ie,"d",`M0,-${r+2} L-${r+2},0 L0,${r+2} Z`),I(qe,Ie)};ee(W,qe=>{t(s).sex==="female"?qe(ie):t(s).sex==="male"?qe(Ze,1):qe(dt,-1)})}I(A,q)},Ve=le(()=>nt(t(s)));ee(Qe,A=>{t(Ve)&&A(Ae)})}var V=g(Qe);w(V,"y",-r-10);var ne=ae(V,!0),oe=g(V);{var Ue=A=>{var q=Cr();let W;w(q,"y",r+14);var ie=ae(q);B(()=>{W=De(q,0,"genotype svelte-879lln",null,W,{inferred:t(C).inferred}),H(ie,`${t(C).text??""}${t(C).uncertain?"*":""}`)}),I(A,q)};ee(oe,A=>{e.showGenotypes&&t(C).text&&A(Ue)})}var ye=g(oe);{var Se=A=>{var q=Nr(),W=ae(q,!0);B(()=>{w(q,"y",e.showGenotypes&&t(C).text?r+27:r+14),H(W,t(s).name)}),I(A,q)};ee(ye,A=>{t(s).name&&A(Se)})}x(X),B(A=>{G=De(X,0,"node svelte-879lln",null,G,{deceased:t(s).vital==="deceased"}),w(X,"transform",`translate(${t(s).position.x??""} ${t(s).position.y??""})`),w(X,"aria-label",`${t(s).label??""}: ${t(s).sex??""}, ${A??""}${t(s).vital==="deceased"?", deceased":""}`),H(ne,t(s).label)},[()=>Nt(t(s))]),$("pointerdown",X,A=>Te(A,t(s))),$("keydown",X,A=>Lt(A,t(s))),$("contextmenu",X,A=>lt(A,"person",t(s).id)),I(o,X)}),x(R),x(T),Kt(T,o=>i=o,()=>i);var ce=g(T,2);{var rt=o=>{var s=Tr(),C=S(s);{var N=G=>{var J=Lr(),fe=j(J),he=S(fe),ct=g(he),ge=ae(ct);x(fe);var Me=g(fe,2),it=S(Me);Da(it,{size:13,"aria-hidden":"true"}),Le(),x(Me);var Ge=g(Me,4);Oe(Ge,17,()=>Rt,q=>q.value,(q,W)=>{var ie=wn(),Ze=S(ie);{var dt=ve=>{Ht(ve,{size:13,"aria-hidden":"true"})},qe=ve=>{var l=Zt();I(ve,l)};ee(Ze,ve=>{t(Y).sex===t(W).value?ve(dt):ve(qe,-1)})}var Ie=g(Ze);x(ie),B(()=>{w(ie,"aria-checked",t(Y).sex===t(W).value),H(Ie,` ${t(W).label??""}`)}),$("click",ie,()=>He(t(Y).id,{sex:t(W).value,genotype:""})),I(q,ie)});var Qe=g(Ge,4);Oe(Qe,17,()=>Ct,q=>q.value,(q,W)=>{var ie=wn(),Ze=S(ie);{var dt=ve=>{Ht(ve,{size:13,"aria-hidden":"true"})},qe=ve=>{var l=Zt();I(ve,l)};ee(Ze,ve=>{t(Y).status===t(W).value?ve(dt):ve(qe,-1)})}var Ie=g(Ze);x(ie),B(()=>{w(ie,"aria-checked",t(Y).status===t(W).value),H(Ie,` ${t(W).label??""}`)}),$("click",ie,()=>He(t(Y).id,{status:t(W).value})),I(q,ie)});var Ae=g(Qe,4);Oe(Ae,17,()=>Tt,q=>q.value,(q,W)=>{var ie=wn(),Ze=S(ie);{var dt=ve=>{Ht(ve,{size:13,"aria-hidden":"true"})},qe=ve=>{var l=Zt();I(ve,l)};ee(Ze,ve=>{(t(Y).carrier??"unknown")===t(W).value?ve(dt):ve(qe,-1)})}var Ie=g(Ze);x(ie),B(()=>{w(ie,"aria-checked",(t(Y).carrier??"unknown")===t(W).value),H(Ie,` ${t(W).label??""}`)}),$("click",ie,()=>He(t(Y).id,{carrier:t(W).value})),I(q,ie)});var Ve=g(Ae,4),V=S(Ve);{var ne=q=>{var W=qr(),ie=j(W);Dn(ie,{size:13,"aria-hidden":"true"}),Le(),I(q,W)},oe=q=>{var W=zr(),ie=j(W);Dn(ie,{size:13,"aria-hidden":"true"}),Le(),I(q,W)};ee(V,q=>{t(Y).vital==="deceased"?q(ne):q(oe,-1)})}x(Ve);var Ue=g(Ve,2),ye=S(Ue);In(ye,{size:13,"aria-hidden":"true"}),Le(),x(Ue);var Se=g(Ue,2),A=S(Se);ln(A,{size:13,"aria-hidden":"true"}),Le(),x(Se),B(()=>{H(he,`${t(Y).label??""} `),H(ge,`${t(Y).sex==="male"?"male":t(Y).sex==="female"?"female":"sex unspecified"}${t(Y).vital==="deceased"?" · deceased":""}`)}),$("click",Me,()=>zt(t(Y).id)),$("click",Ve,()=>He(t(Y).id,{vital:t(Y).vital==="deceased"?"alive":"deceased"})),$("click",Ue,()=>{L(E,null),e.onrequestpartner(t(Y).id)}),$("click",Se,()=>{const q=t(Y).id;L(E,null),e.ondeleteindividual(q)}),I(G,J)},X=G=>{var J=Er(),fe=j(J),he=S(fe),ct=g(he),ge=ae(ct);x(fe);var Me=g(fe,2),it=S(Me);{var Ge=A=>{Ht(A,{size:13,"aria-hidden":"true"})},Qe=A=>{var q=Zt();I(A,q)};ee(it,A=>{t(U).relationship==="married"?A(Ge):A(Qe,-1)})}Le(),x(Me);var Ae=g(Me,2),Ve=S(Ae);{var V=A=>{Ht(A,{size:13,"aria-hidden":"true"})},ne=A=>{var q=Zt();I(A,q)};ee(Ve,A=>{t(U).relationship==="divorced"?A(V):A(ne,-1)})}Le(),x(Ae);var oe=g(Ae,2);{var Ue=A=>{var q=Fr();I(A,q)};ee(oe,A=>{t(U).blocked&&A(Ue)})}var ye=g(oe,4),Se=S(ye);ln(Se,{size:13,"aria-hidden":"true"}),Le(),x(ye),B(()=>{H(he,`${t(U).a.label??""} + ${t(U).b.label??""} `),H(ge,`${t(U).children.length??""} child${t(U).children.length===1?"":"ren"}`),w(Me,"aria-checked",t(U).relationship==="married"),w(Ae,"aria-checked",t(U).relationship==="divorced")}),$("click",Me,()=>{L(E,null),e.onrelationship(t(U).id,"married")}),$("click",Ae,()=>{L(E,null),e.onrelationship(t(U).id,"divorced")}),$("click",ye,()=>{const A=t(U).id;L(E,null),e.onremovepartnership(A)}),I(G,J)};ee(C,G=>{t(Y)?G(N):t(U)&&G(X,1)})}x(s),Kt(s,G=>L(c,G),()=>t(c)),B(()=>{Tn(s,t(be)),w(s,"aria-label",t(E).kind==="person"?"Individual actions":"Relationship actions")}),I(o,s)};ee(ce,o=>{t(E)&&o(rt)})}var st=g(ce,2);{var Je=o=>{var s=$r();I(o,s)};ee(st,o=>{e.pedigree.individuals.length===0&&o(Je)})}return x(at),Kt(at,o=>u=o,()=>u),B(()=>{D=Tn(T,"",D,{cursor:t(vt)}),w(R,"transform",`translate(${t(v).x??""} ${t(v).y??""}) scale(${t(v).k??""})`)}),$("pointerdown",T,At),$("pointermove",T,_t),$("pointerup",T,wt),tn("pointercancel",T,wt),tn("wheel",T,Mt),$("contextmenu",T,o=>o.preventDefault()),On(at,"clientWidth",o=>L(p,o)),On(at,"clientHeight",o=>L(f,o)),I(a,at),Nn($t)}Sn(["pointerdown","pointermove","pointerup","contextmenu","keydown","click"]);var Dr=te("<option> </option>"),jn=te('<button type="button"> </button>'),Or=te("<p><!> </p>"),Rr=te('<p class="hint svelte-1vlm7tl"> </p>'),Gr=te('<button type="button" class="btn btn-block"><!> Add a partner</button>'),Yr=te('<span class="partner-note svelte-1vlm7tl">Marked as divorced</span>'),Br=te('<button type="button" class="partner-row svelte-1vlm7tl"><span class="partner-name svelte-1vlm7tl"><!> </span> <span class="partner-plus svelte-1vlm7tl"> </span></button> <!>',1),Wr=te('<div class="partners svelte-1vlm7tl"></div> <button type="button" class="btn btn-sm btn-block"><!> Add another partner</button>',1),Hr=te('<div class="form svelte-1vlm7tl"><div class="form-head svelte-1vlm7tl"><div><p class="form-title svelte-1vlm7tl"> </p> <p class="form-sub svelte-1vlm7tl">Selected individual</p></div> <button type="button" class="icon-btn danger svelte-1vlm7tl" aria-label="Delete individual"><!></button></div> <div class="field"><label class="label" for="ind-label">Identifier</label> <input id="ind-label" class="input"/></div> <div class="field"><label class="label" for="ind-name">Name <span class="optional svelte-1vlm7tl">optional</span></label> <input id="ind-name" class="input" placeholder="e.g. Alex"/></div> <div class="field"><label class="label" for="ind-sex">Biological sex <!></label> <select id="ind-sex" class="select"></select></div> <div class="field"><span class="label">Phenotype <!></span> <div class="status-grid svelte-1vlm7tl" role="group" aria-label="Phenotype"></div></div> <div class="field"><span class="label">Carrier status <!></span> <div class="status-grid svelte-1vlm7tl" role="group" aria-label="Carrier status"></div></div> <div class="field"><span class="label">Life status <!></span> <div class="status-grid svelte-1vlm7tl" role="group" aria-label="Life status"><button type="button">Living</button> <button type="button">Deceased</button></div></div> <div class="field"><label class="label" for="ind-genotype">Known genotype <!></label> <input id="ind-genotype"/> <!></div> <div class="field"><label class="label" for="ind-age">Age <span class="optional svelte-1vlm7tl">optional</span></label> <input id="ind-age" class="input mono" type="number" min="0" max="130" placeholder="e.g. 42"/> <p class="hint svelte-1vlm7tl">Used by Clean up to order a generation, oldest first.</p></div> <div class="field"><label class="label" for="ind-notes">Notes <span class="optional svelte-1vlm7tl">optional</span></label> <textarea id="ind-notes" class="textarea" rows="2" placeholder="Clinical notes stay on this device."></textarea></div> <hr class="divider"/> <div class="field"><span class="label">Relationships</span> <!></div></div>');function Vr(a,e){Cn(e,!0);const n=[{value:"unknown",label:"Unknown",hint:"No phenotype information for this individual"},{value:"unaffected",label:"Unaffected",hint:"Not expressing the phenotype"},{value:"affected",label:"Affected",hint:"Expressing the phenotype"}],r=[{value:"unknown",label:"Unknown",hint:"Let the engine deduce carrier status from the family data."},{value:"carrier",label:"Carrier",hint:"Carries one variant allele: unaffected under recessive models, affected under dominant models."},{value:"non-carrier",label:"Not a carrier",hint:"Carries no variant allele."}],d=le(()=>Jn(e.model)),u=le(()=>{if(!e.individual.genotype||e.individual.genotype.trim()==="")return{ok:!0,message:""};const T=sn(e.individual.genotype,e.model,e.individual.sex);if(!T)return{ok:!1,message:t(d).sexLinked?"For sex-linked models, set the sex first and use one allele for males or two for females.":"Use two alleles, for example Gg or AA."};const D=on(e.model,T);return{ok:!0,message:`Reads as ${kn(Qn(e.model,T),e.alleleLetter)} — ${D} under ${t(d).label.toLowerCase()}.`}}),i=[{value:"unknown",label:"Unspecified"},{value:"female",label:"Female (XX)"},{value:"male",label:"Male (XY)"}];var c=Hr(),p=S(c),f=S(p),v=S(f),m=ae(v,!0);Le(2),x(f);var k=g(f,2),_=S(k);ln(_,{size:15,"aria-hidden":"true"}),x(k),x(p);var F=g(p,2),E=g(S(F),2);nn(E),x(F);var P=g(F,2),b=g(S(P),2);nn(b),x(P);var z=g(P,2),O=S(z),Ee=g(S(O));Vt(Ee,{text:"Sex is used by the inheritance calculations. Leave it unspecified if it is unknown — no sex will be assumed."}),x(O);var Y=g(O,2);Oe(Y,21,()=>i,T=>T.value,(T,D)=>{var R=Dr(),ue=ae(R,!0),pe={};B(()=>{H(ue,t(D).label),pe!==(pe=t(D).value)&&(R.value=(R.__value=pe)??"")}),I(T,R)}),x(Y);var U;ga(Y),x(z);var be=g(z,2),Be=S(be),se=g(S(Be));Vt(se,{text:"What was observed clinically. Carrier status is recorded separately, below."}),x(Be);var Re=g(Be,2);Oe(Re,21,()=>n,T=>T.value,(T,D)=>{var R=jn();let ue;var pe=ae(R,!0);B(()=>{ue=De(R,1,"status-button svelte-1vlm7tl",null,ue,{active:e.individual.status===t(D).value}),w(R,"aria-pressed",e.individual.status===t(D).value),w(R,"title",t(D).hint),H(pe,t(D).label)}),$("click",R,()=>e.onpatch({status:t(D).value})),I(T,R)}),x(Re),x(be);var tt=g(be,2),nt=S(tt),Nt=g(S(nt));Vt(Nt,{text:"Separate from the phenotype: a carrier is unaffected under a recessive model but affected under a dominant one. Unknown lets the engine deduce it, alone or alongside affected/unaffected."}),x(nt);var We=g(nt,2);Oe(We,21,()=>r,T=>T.value,(T,D)=>{var R=jn();let ue;var pe=ae(R,!0);B(()=>{ue=De(R,1,"status-button svelte-1vlm7tl",null,ue,{active:(e.individual.carrier??"unknown")===t(D).value}),w(R,"aria-pressed",(e.individual.carrier??"unknown")===t(D).value),w(R,"title",t(D).hint),H(pe,t(D).label)}),$("click",R,()=>e.onpatch({carrier:t(D).value})),I(T,R)}),x(We),x(tt);var Te=g(tt,2),ht=S(Te),xt=g(S(ht));Vt(xt,{text:"Deceased individuals are drawn with a diagonal strike. Their recorded data still takes part in the analysis."}),x(ht);var At=g(ht,2),Ke=S(At);let qt;var _t=g(Ke,2);let wt;x(At),x(Te);var lt=g(Te,2),kt=S(lt),zt=g(S(kt));{let T=le(()=>`Optional. Every pedigree uses the letter ${e.alleleLetter}: uppercase is the variant allele, lowercase the reference allele. Leave it empty to use the inferred genotype.`);Vt(zt,{get text(){return t(T)}})}x(kt);var He=g(kt,2);nn(He);let Mt;var Lt=g(He,2);{var Ft=T=>{var D=Or();let R;var ue=S(D);{var pe=ce=>{Ca(ce,{size:12,"aria-hidden":"true"})};ee(ue,ce=>{t(u).ok||ce(pe)})}var $e=g(ue);x(D),B(()=>{R=De(D,1,"hint svelte-1vlm7tl",null,R,{error:!t(u).ok}),H($e,` ${t(u).message??""}`)}),I(T,D)},Et=le(()=>e.individual.genotype&&e.individual.genotype.trim()!==""),It=T=>{var D=Rr(),R=ae(D);B(()=>H(R,`Leave empty to use the genotype inferred from the family. Everyone shares the letter
				${e.alleleLetter??""}, set in the analysis settings.`)),I(T,D)};ee(Lt,T=>{t(Et)?T(Ft):T(It,-1)})}x(lt);var Pt=g(lt,2),St=g(S(Pt),2);nn(St),Le(2),x(Pt);var vt=g(Pt,2),Ct=g(S(vt),2);_a(Ct),x(vt);var Tt=g(vt,4),Rt=g(S(Tt),2);{var $t=T=>{var D=Gr(),R=S(D);In(R,{size:14,"aria-hidden":"true"}),Le(),x(D),$("click",D,function(...ue){var pe;(pe=e.onrequestPartner)==null||pe.apply(this,ue)}),I(T,D)},at=T=>{var D=Wr(),R=j(D);Oe(R,21,()=>e.partners,$e=>$e.partnershipId,($e,ce)=>{var rt=Br(),st=j(rt),Je=S(st),o=S(Je);za(o,{size:13,"aria-hidden":"true"});var s=g(o);x(Je);var C=g(Je,2),N=ae(C,!0);x(st);var X=g(st,2);{var G=J=>{var fe=Yr();I(J,fe)};ee(X,J=>{t(ce).relationship==="divorced"&&J(G)})}B(()=>{st.disabled=!t(ce).canHaveChildren,w(st,"title",t(ce).canHaveChildren?`Add a child with ${t(ce).name||t(ce).label}`:"This couple is recorded as same-sex; children are not modelled."),H(s,` ${t(ce).canHaveChildren?`Add child with ${t(ce).name||t(ce).label}`:`No children with ${t(ce).name||t(ce).label}`}`),H(N,t(ce).canHaveChildren?"+":"—")}),$("click",st,()=>e.onaddChild(t(ce).partnershipId)),I($e,rt)}),x(R);var ue=g(R,2),pe=S(ue);In(pe,{size:13,"aria-hidden":"true"}),Le(),x(ue),$("click",ue,function(...$e){var ce;(ce=e.onrequestPartner)==null||ce.apply(this,$e)}),I(T,D)};ee(Rt,T=>{e.partners.length===0?T($t):T(at,-1)})}x(Tt),x(c),B(T=>{H(m,e.individual.label),Bt(E,e.individual.label),Bt(b,e.individual.name??""),U!==(U=e.individual.sex)&&(Y.value=(Y.__value=U)??"",ma(Y,U)),qt=De(Ke,1,"status-button svelte-1vlm7tl",null,qt,{active:e.individual.vital!=="deceased"}),w(Ke,"aria-pressed",e.individual.vital!=="deceased"),wt=De(_t,1,"status-button svelte-1vlm7tl",null,wt,{active:e.individual.vital==="deceased"}),w(_t,"aria-pressed",e.individual.vital==="deceased"),Mt=De(He,1,"input mono",null,Mt,{"input-invalid":!t(u).ok}),w(He,"placeholder",T),Bt(He,e.individual.genotype??""),Bt(St,e.individual.age??""),Bt(Ct,e.individual.notes??"")},[()=>t(d).sexLinked&&e.individual.sex==="male"?`e.g. ${e.alleleLetter}`:`e.g. ${e.alleleLetter}${e.alleleLetter.toLowerCase()}`]),$("click",k,function(...T){var D;(D=e.ondelete)==null||D.apply(this,T)}),$("input",E,T=>e.onpatch({label:T.currentTarget.value})),$("input",b,T=>e.onpatch({name:T.currentTarget.value})),$("change",Y,T=>e.onpatch({sex:T.currentTarget.value,genotype:""})),$("click",Ke,()=>e.onpatch({vital:"alive"})),$("click",_t,()=>e.onpatch({vital:"deceased"})),$("input",He,T=>e.onpatch({genotype:T.currentTarget.value})),$("input",St,T=>{const D=T.currentTarget.value,R=D===""?void 0:Number(D);e.onpatch({age:R!==void 0&&Number.isFinite(R)?R:void 0})}),$("input",Ct,T=>e.onpatch({notes:T.currentTarget.value})),I(a,c),Nn()}Sn(["click","input","change"]);var Zr=te('<button type="button" class="icon-btn svelte-ss71nq"><!></button>'),jr=te('<p class="editor-hint svelte-ss71nq"> </p>'),Kr=te("<p> </p>"),Jr=te('<div class="editor-errors svelte-ss71nq" role="alert"></div>'),Qr=te('<button type="button" class="btn btn-sm"><!> Add male</button> <button type="button" class="btn btn-sm"><!> Add female</button> <button type="button" class="btn btn-sm"><!> Unspecified</button>',1),es=te('<li><button type="button"><span class="individual-label svelte-ss71nq"> </span> <span class="individual-meta svelte-ss71nq"> </span></button></li>'),ts=te('<div class="individuals svelte-ss71nq"><p class="individuals-title svelte-ss71nq"><!> </p> <ul class="individuals-list svelte-ss71nq"></ul></div>'),ns=te('<button type="button" class="dialog-option svelte-ss71nq"><span class="dialog-option-title svelte-ss71nq"> </span> <span class="dialog-option-text svelte-ss71nq"> </span></button>'),as=te('<h2 id="link-title" class="dialog-title svelte-ss71nq"> </h2> <p class="dialog-text svelte-ss71nq"> </p> <div class="dialog-options svelte-ss71nq"></div> <div class="dialog-actions svelte-ss71nq"><button type="button" class="btn btn-sm">Cancel</button></div>',1),rs=te(`<h2 id="link-title" class="dialog-title svelte-ss71nq"> </h2> <p class="dialog-text svelte-ss71nq">This sets the line drawn between them, or makes one person the child of
						the other's couple. You can change a partnership later by right-clicking the
						link.</p> <div class="dialog-options svelte-ss71nq"><button type="button" class="dialog-option svelte-ss71nq"><span class="dialog-option-title svelte-ss71nq">Married or partners</span> <span class="dialog-option-text svelte-ss71nq">A plain mating line. Children can be attached to this couple.</span></button> <button type="button" class="dialog-option svelte-ss71nq"><span class="dialog-option-title svelte-ss71nq">Divorced or separated</span> <span class="dialog-option-text svelte-ss71nq">The link is marked with a strike. Children stay attached.</span></button> <button type="button" class="dialog-option svelte-ss71nq"><span class="dialog-option-title svelte-ss71nq"> </span> <span class="dialog-option-text svelte-ss71nq"> </span></button> <button type="button" class="dialog-option svelte-ss71nq"><span class="dialog-option-title svelte-ss71nq"> </span> <span class="dialog-option-text svelte-ss71nq"> </span></button></div> <div class="dialog-actions svelte-ss71nq"><button type="button" class="btn btn-sm">Cancel</button></div>`,1),ss=te('<div class="dialog-backdrop svelte-ss71nq" role="presentation"><div class="dialog svelte-ss71nq" role="dialog" aria-modal="true" aria-labelledby="link-title"><!></div></div>'),is=te('<section class="editor panel svelte-ss71nq"><div class="toolbar svelte-ss71nq"><div class="tool-group svelte-ss71nq" role="toolbar" aria-label="Pedigree tools"></div> <span class="toolbar-sep svelte-ss71nq" aria-hidden="true"></span> <div class="tool-group svelte-ss71nq"><button type="button" class="icon-btn svelte-ss71nq" aria-label="Undo" title="Undo (Ctrl+Z)"><!></button> <button type="button" class="icon-btn svelte-ss71nq" aria-label="Redo" title="Redo (Ctrl+Shift+Z)"><!></button> <button type="button" class="icon-btn svelte-ss71nq" aria-label="Auto-arrange diagram" title="Auto-arrange diagram"><!></button> <button type="button" class="icon-btn svelte-ss71nq" aria-label="Clean up and sort by age" title="Clean up and sort by age"><!></button></div> <span class="toolbar-sep svelte-ss71nq" aria-hidden="true"></span> <div class="tool-group svelte-ss71nq"><button type="button" class="icon-btn svelte-ss71nq" aria-label="Zoom out" title="Zoom out"><!></button> <button type="button" class="icon-btn svelte-ss71nq" aria-label="Fit to screen" title="Fit to screen"><!></button> <button type="button" class="icon-btn svelte-ss71nq" aria-label="Zoom in" title="Zoom in"><!></button></div> <span class="toolbar-spacer svelte-ss71nq"></span> <div class="tool-group svelte-ss71nq"><button type="button" class="btn btn-sm" title="Export the diagram as SVG"><!> SVG</button> <button type="button" class="btn btn-sm" title="Export the diagram as PNG"><!> PNG</button> <button type="button" class="icon-btn svelte-ss71nq" aria-label="Clear pedigree" title="Clear pedigree"><!></button></div></div> <!> <!> <div class="editor-body svelte-ss71nq"><div class="canvas-col svelte-ss71nq"><!></div> <aside class="inspector svelte-ss71nq" aria-label="Individual details"><!> <!></aside></div> <!></section>');function Ns(a,e){Cn(e,!0);let n=et(e,"pedigree",31,()=>an({individuals:[],partnerships:[],children:[]})),r=et(e,"selection",15,null),d=et(e,"model",3,"autosomal-dominant"),u=et(e,"showGenotypes",3,!0),i=et(e,"carrierDisplay",3,"recessive-only"),c=et(e,"alleleLetter",3,"G"),p=et(e,"showSexInGenotype",3,!1),f=et(e,"heterozygoteAsCarrier",3,!1),v=et(e,"inferred",19,()=>({})),m=et(e,"projectName",3,"pedigree"),k=et(e,"hint",3,""),_=ze("select"),F=ze(null),E=ze(an([])),P=ze(an([])),b={id:"",at:0},z=ze(null),O=ze(null),Ee=ze(null);const Y=[{id:"select",label:"Select and move",icon:Xa},{id:"pan",label:"Pan the canvas",icon:Fa},{id:"male",label:"Add male",icon:Yn},{id:"female",label:"Add female",icon:Rn},{id:"unknown",label:"Add unspecified sex",icon:Gn},{id:"partner",label:"Link two people (asks the relationship)",icon:$a}],U=le(()=>new Map(n().individuals.map(h=>[h.id,h]))),be=le(()=>r()?t(U).get(r())??null:null),Be=le(()=>{const l=r();return l?n().partnerships.filter(h=>h.parents.includes(l)).map(h=>{const M=h.parents[0]===l?h.parents[1]:h.parents[0],y=t(U).get(M),K=t(U).get(l);return{partnershipId:h.id,label:(y==null?void 0:y.label)??"Unknown",name:y==null?void 0:y.name,relationship:h.relationship??"married",canHaveChildren:!!(y&&K&&!(y.sex!=="unknown"&&y.sex===K.sex))}}):[]}),se=le(()=>{var l,h;return t(z)?{a:((l=t(U).get(t(z).a))==null?void 0:l.label)??t(z).a,b:((h=t(U).get(t(z).b))==null?void 0:h.label)??t(z).b}:null}),Re=le(()=>{const l=t(O);return l?n().partnerships.filter(h=>h.parents.includes(l.parentId)).map(h=>{var y;const M=h.parents[0]===l.parentId?h.parents[1]:h.parents[0];return{id:h.id,other:((y=t(U).get(M))==null?void 0:y.label)??"Unknown",check:_n(n(),h.id,l.childId)}}):[]}),tt=le(()=>{var h;const l=t(O);return l?((h=t(U).get(l.parentId))==null?void 0:h.label)??"Parent":""}),nt=le(()=>{var h,M;const l=t(O);return!l||!t(z)?"the child":l.parentId===t(z).a?((h=t(se))==null?void 0:h.b)??"the child":((M=t(se))==null?void 0:M.a)??"the child"}),Nt=le(()=>Wa(n()).filter(l=>l.severity==="error"));function We(l){return JSON.parse(JSON.stringify(l))}function Te(l){const h=We(n());l(h),L(E,[...t(E).slice(-49),We(n())],!0),L(P,[],!0),n(h)}function ht(){const l=t(E).at(-1);l&&(L(E,t(E).slice(0,-1),!0),L(P,[We(n()),...t(P)].slice(0,50),!0),n(l))}function xt(){const l=t(P)[0];l&&(L(P,t(P).slice(1),!0),L(E,[...t(E),We(n())].slice(-50),!0),n(l))}function At(){if(n().individuals.length===0)return{x:160,y:110};const l=n().individuals.map(M=>M.position.x),h=n().individuals.map(M=>M.position.y);return{x:Math.round((Math.min(...l)+Math.max(...l))/2),y:yt(bt(Math.max(...h))+1)}}function Ke(l,h){const M=xn("ind"),y=h??At(),K=rn(n(),y.y),Q=bt(K);Te(Z=>{Z.individuals.push({id:M,label:Bn(Z,Q),sex:l,status:"unknown",position:{x:y.x,y:K}})}),r(M)}function qt(l){const h=n().partnerships.find(de=>de.id===l);if(!h)return;const M=t(U).get(h.parents[0]),y=t(U).get(h.parents[1]);if(!M||!y)return;if(fn(n(),l)){Pe("This couple is recorded as same-sex. This toolkit does not model same-sex biological parentage.","error");return}const K=Ot(n()),Q=Math.max(K.get(M.id)??0,K.get(y.id)??0)+1,Z=n().children.filter(de=>de.partnershipId===l).map(de=>t(U).get(de.childId)).filter(de=>!!de),Ce=(M.position.x+y.position.x)/2,Ne=Z.length?Math.max(...Z.map(de=>de.position.x))+96:Ce,Ye=yt(Q),Xe=xn("ind");Te(de=>{de.individuals.push({id:Xe,label:Bn(de,Q),sex:"unknown",status:"unknown",position:{x:Ne,y:Ye}}),de.children.push({childId:Xe,partnershipId:l})}),r(Xe)}function _t(l,h){if(l===h){Pe("An individual cannot partner with themselves.","error");return}if(n().partnerships.some(y=>y.parents.includes(l)&&y.parents.includes(h))){Pe("These two individuals are already linked.","info");return}if(cn(n(),l,h)||cn(n(),h,l)){Pe("These individuals are direct ancestors of one another and cannot be partners.","error");return}L(z,{a:l,b:h},!0)}function wt(l,h,M){const y=t(U).get(l),K=t(U).get(h),Q=(K==null?void 0:K.sex)==="male"&&(y==null?void 0:y.sex)!=="male"?[h,l]:[l,h];Te(Z=>{Z.partnerships.push({id:xn("pair"),parents:Q,relationship:M})}),Pe(M==="divorced"?"Divorced partnership recorded.":"Partnership created.","success")}function lt(l){if(!t(z))return;const{a:h,b:M}=t(z);L(z,null),wt(h,M,l)}function kt(l,h){const M=Date.now();(b.id!==l||M-b.at>700)&&(L(E,[...t(E).slice(-49),We(n())],!0),L(P,[],!0)),b={id:l,at:M},n({...n(),individuals:n().individuals.map(y=>y.id===l?{...y,position:h}:y)})}function zt(l,h){Te(M=>{M.individuals=M.individuals.map(y=>y.id===l?{...y,...h}:y)})}function He(l){r()&&zt(r(),l)}function Mt(l){Te(h=>{const M=h.partnerships.filter(y=>y.parents.includes(l)).map(y=>y.id);h.individuals=h.individuals.filter(y=>y.id!==l),h.partnerships=h.partnerships.filter(y=>!y.parents.includes(l)),h.children=h.children.filter(y=>y.childId!==l&&!M.includes(y.partnershipId))}),r()===l&&r(null)}function Lt(){r()&&(Mt(r()),Pe("Individual removed.","info"))}function Ft(l,h){Te(M=>{M.partnerships=M.partnerships.map(y=>y.id===l?{...y,relationship:h}:y)}),Pe(h==="divorced"?"Relationship marked as divorced.":"Relationship marked as married.","success")}function Et(l){const h=n().children.filter(M=>M.partnershipId===l).length;Te(M=>{M.partnerships=M.partnerships.filter(y=>y.id!==l),M.children=M.children.filter(y=>y.partnershipId!==l)}),Pe(h>0?`Relationship removed. ${h} child link${h===1?"":"s"} detached.`:"Relationship removed.","info")}function It(l,h,M){var de;const y=_n(n(),l,h,M);if(!y.ok)return Pe(y.reason??"That person cannot be attached as a child.","error"),!1;const K=n().partnerships.find(re=>re.id===l);if(!K)return!1;const Q=K.parents.map(re=>t(U).get(re)).filter(re=>!!re);if(Q.length<2)return!1;const Z=Ot(n()),Ce=Math.max(...Q.map(re=>Z.get(re.id)??0))+1,Ne=n().children.filter(re=>re.partnershipId===l).map(re=>t(U).get(re.childId)).filter(re=>!!re),Ye=yt(Ce),Xe=Ne.length?Math.max(...Ne.map(re=>re.position.x))+96:Math.round((Q[0].position.x+Q[1].position.x)/2);return Te(re=>{re.children.push({childId:h,partnershipId:l}),re.individuals=re.individuals.map(je=>je.id===h?{...je,position:{x:Xe,y:Ye}}:je)}),r(h),Pe(`${((de=t(U).get(h))==null?void 0:de.label)??"Person"} linked as a child.`,"success"),!0}function Pt(l,h,M){It(l,h,M)}function St(l){const h=t(O);if(!h)return;L(O,null),L(z,null);const M=t(U).get(h.childId);It(l,h.childId,M?bt(M.position.y):void 0)}function vt(l){var K;if(!t(z))return;const h=l==="a"?t(z).a:t(z).b,M=l==="a"?t(z).b:t(z).a,y=n().partnerships.filter(Q=>Q.parents.includes(h)).filter(Q=>_n(n(),Q.id,M).ok);if(y.length===0){const Q=n().partnerships.some(Z=>Z.parents.includes(h));Pe(Q?"No eligible couple for this parent. Check the couple sexes and whether the child already has parents.":`${((K=t(U).get(h))==null?void 0:K.label)??"This person"} needs a partner first — every child in this model has two parents.`,"error");return}if(y.length===1){const Q=t(U).get(M);L(z,null),It(y[0].id,M,Q?bt(Q.position.y):void 0);return}L(O,{parentId:h,childId:M},!0)}function Ct(){n().individuals.length!==0&&window.confirm("Clear the entire pedigree? This cannot be undone with the undo button.")&&(L(E,[...t(E).slice(-49),We(n())],!0),L(P,[],!0),n({individuals:[],partnerships:[],children:[]}),r(null),Pe("Pedigree cleared.","info"))}function Tt(){var M;if(n().individuals.length===0)return;const l=Ka(n());Te(y=>{y.individuals=l.pedigree.individuals,y.partnerships=l.pedigree.partnerships,y.children=l.pedigree.children});const h=l.removedPartnerships+l.removedLinks;Pe(h>0?`Pedigree cleaned up by age. Removed ${h} dangling link${h===1?"":"s"}.`:"Pedigree cleaned up and sorted by age.","success"),(M=t(F))==null||M.fit()}function Rt(){var h;if(n().individuals.length===0)return;const l=ja(n());Te(M=>{M.individuals=M.individuals.map(y=>({...y,position:l.get(y.id)??y.position}))}),(h=t(F))==null||h.fit()}function $t(){var l;r()&&(L(_,"partner"),(l=t(F))==null||l.beginPartnerFrom(r()))}function at(){var h;const l=(h=t(F))==null?void 0:h.toSvgMarkup();if(!l||!l.markup){Pe("There is nothing to export yet.","error");return}hr(l.markup,`${Xn(m())}.svg`),Pe("Diagram exported as SVG.","success")}async function T(){var h;const l=(h=t(F))==null?void 0:h.toSvgMarkup();if(!l||!l.markup){Pe("There is nothing to export yet.","error");return}try{await vr(l.markup,`${Xn(m())}.png`,l.width,l.height),Pe("Diagram exported as PNG.","success")}catch(M){Pe(M instanceof Error?M.message:"PNG export failed.","error")}}jt(()=>{if(typeof window>"u")return;const l=h=>{const M=h.target;if(!(M&&M.closest('input, textarea, select, [contenteditable="true"]'))){if((h.metaKey||h.ctrlKey)&&h.key.toLowerCase()==="z"){h.preventDefault(),h.shiftKey?xt():ht();return}(h.key==="Delete"||h.key==="Backspace")&&r()&&(h.preventDefault(),Lt()),h.key==="Escape"&&(L(z,null),L(O,null),r(null))}};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)}),jt(()=>{var l,h;t(z)&&((h=(l=t(Ee))==null?void 0:l.querySelector("button"))==null||h.focus())});var D=is(),R=S(D),ue=S(R);Oe(ue,21,()=>Y,l=>l.id,(l,h)=>{const M=le(()=>t(h).icon);var y=Zr(),K=S(y);Sa(K,()=>t(M),(Q,Z)=>{Z(Q,{size:16,strokeWidth:1.9,"aria-hidden":"true"})}),x(y),B(()=>{w(y,"aria-pressed",t(_)===t(h).id),w(y,"aria-label",t(h).label),w(y,"title",t(h).label)}),$("click",y,()=>L(_,t(h).id,!0)),I(l,y)}),x(ue);var pe=g(ue,4),$e=S(pe),ce=S($e);Ra(ce,{size:16,"aria-hidden":"true"}),x($e);var rt=g($e,2),st=S(rt);Oa(st,{size:16,"aria-hidden":"true"}),x(rt);var Je=g(rt,2),o=S(Je);Ta(o,{size:16,"aria-hidden":"true"}),x(Je);var s=g(Je,2),C=S(s);Aa(C,{size:16,"aria-hidden":"true"}),x(s),x(pe);var N=g(pe,4),X=S(N),G=S(X);Ba(G,{size:16,"aria-hidden":"true"}),x(X);var J=g(X,2),fe=S(J);Ua(fe,{size:15,"aria-hidden":"true"}),x(J);var he=g(J,2),ct=S(he);Ya(ct,{size:16,"aria-hidden":"true"}),x(he),x(N);var ge=g(N,4),Me=S(ge),it=S(Me);La(it,{size:13,"aria-hidden":"true"}),Le(),x(Me);var Ge=g(Me,2),Qe=S(Ge);Ea(Qe,{size:13,"aria-hidden":"true"}),Le(),x(Ge);var Ae=g(Ge,2),Ve=S(Ae);ln(Ve,{size:15,"aria-hidden":"true"}),x(Ae),x(ge),x(R);var V=g(R,2);{var ne=l=>{var h=jr(),M=ae(h,!0);B(()=>H(M,k())),I(l,h)};ee(V,l=>{k()&&l(ne)})}var oe=g(V,2);{var Ue=l=>{var h=Jr();Oe(h,21,()=>t(Nt),ba,(M,y)=>{var K=Kr(),Q=ae(K,!0);B(()=>H(Q,t(y).message)),I(M,K)}),x(h),I(l,h)};ee(oe,l=>{t(Nt).length>0&&l(Ue)})}var ye=g(oe,2),Se=S(ye),A=S(Se);Kt(Xr(A,{get pedigree(){return n()},get selection(){return r()},get tool(){return t(_)},get model(){return d()},get showGenotypes(){return u()},get carrierDisplay(){return i()},get alleleLetter(){return c()},get showSexInGenotype(){return p()},get heterozygoteAsCarrier(){return f()},get inferred(){return v()},onselect:l=>r(l),onmove:kt,oncreate:Ke,onlink:_t,ondropchild:Pt,onpatch:zt,onrelationship:Ft,onremovepartnership:Et,ondeleteindividual:Mt,onrequestpartner:$t,onnotice:l=>Pe(l,"info")}),l=>L(F,l,!0),()=>t(F)),x(Se);var q=g(Se,2),W=S(q);{var ie=l=>{Vr(l,{get individual(){return t(be)},get model(){return d()},get alleleLetter(){return c()},get partners(){return t(Be)},onpatch:He,ondelete:Lt,onaddChild:qt,onrequestPartner:$t})},Ze=l=>{Na(l,{title:"Nothing selected",description:"Select an individual to edit their sex, status, genotype, and relationships, or add the first person to the pedigree.",children:(h,M)=>{var y=Qr(),K=j(y),Q=S(K);Yn(Q,{size:13,"aria-hidden":"true"}),Le(),x(K);var Z=g(K,2),Ce=S(Z);Rn(Ce,{size:13,"aria-hidden":"true"}),Le(),x(Z);var Ne=g(Z,2),Ye=S(Ne);Gn(Ye,{size:13,"aria-hidden":"true"}),Le(),x(Ne),$("click",K,()=>Ke("male")),$("click",Z,()=>Ke("female")),$("click",Ne,()=>Ke("unknown")),I(h,y)}})};ee(W,l=>{t(be)?l(ie):l(Ze,-1)})}var dt=g(W,2);{var qe=l=>{var h=ts(),M=S(h),y=S(M);Ga(y,{size:13,"aria-hidden":"true"});var K=g(y);x(M);var Q=g(M,2);Oe(Q,21,()=>n().individuals,Z=>Z.id,(Z,Ce)=>{var Ne=es(),Ye=S(Ne);let Xe;var de=S(Ye),re=ae(de,!0),je=g(de,2),Ut=ae(je);x(Ye),x(Ne),B(()=>{Xe=De(Ye,1,"individual-row svelte-ss71nq",null,Xe,{active:r()===t(Ce).id}),H(re,t(Ce).label),H(Ut,`${t(Ce).sex==="male"?"male":t(Ce).sex==="female"?"female":"unspecified"}
										· ${t(Ce).status??""}`)}),$("click",Ye,()=>r(t(Ce).id)),I(Z,Ne)}),x(Q),x(h),B(()=>H(K,` Individuals (${n().individuals.length??""})`)),I(l,h)};ee(dt,l=>{n().individuals.length>0&&l(qe)})}x(q),x(ye);var Ie=g(ye,2);{var ve=l=>{var h=ss(),M=S(h),y=S(M);{var K=Z=>{var Ce=as(),Ne=j(Ce),Ye=ae(Ne),Xe=g(Ne,2),de=ae(Xe),re=g(Xe,2);Oe(re,21,()=>t(Re),Gt=>Gt.id,(Gt,pt)=>{var gt=ns(),Xt=S(gt),en=ae(Xt),vn=g(Xt,2),pn=ae(vn,!0);x(gt),B(()=>{gt.disabled=!t(pt).check.ok,w(gt,"title",t(pt).check.reason??""),H(en,`${t(tt)??""} + ${t(pt).other??""}`),H(pn,t(pt).check.ok?"Attach the child to this couple.":t(pt).check.reason)}),$("click",gt,()=>St(t(pt).id)),I(Gt,gt)}),x(re);var je=g(re,2),Ut=ae(je);B(()=>{H(Ye,`Attach ${t(nt)??""} to which of ${t(tt)??""}'s couples?`),H(de,`A child needs two parents in this model, so choose the couple that should
						become ${t(nt)??""}'s parents.`)}),$("click",Ut,()=>{L(O,null),L(z,null)}),I(Z,Ce)},Q=Z=>{var Ce=rs(),Ne=j(Ce),Ye=ae(Ne),Xe=g(Ne,4),de=S(Xe),re=g(de,2),je=g(re,2),Ut=S(je),Gt=ae(Ut),pt=g(Ut,2),gt=ae(pt);x(je);var Xt=g(je,2),en=S(Xt),vn=ae(en),pn=g(en,2),ua=ae(pn);x(Xt),x(Xe);var fa=g(Xe,2),ha=ae(fa);B(()=>{H(Ye,`How are ${t(se).a??""} and ${t(se).b??""} related?`),H(Gt,`${t(se).a??""} is a parent of ${t(se).b??""}`),H(gt,`${t(se).b??""} joins ${t(se).a??""}'s couple as a child. ${t(se).a??""} needs a
								partner already.`),H(vn,`${t(se).b??""} is a parent of ${t(se).a??""}`),H(ua,`${t(se).a??""} joins ${t(se).b??""}'s couple as a child. ${t(se).b??""} needs a
								partner already.`)}),$("click",de,()=>lt("married")),$("click",re,()=>lt("divorced")),$("click",je,()=>vt("a")),$("click",Xt,()=>vt("b")),$("click",ha,()=>{L(z,null),L(O,null)}),I(Z,Ce)};ee(y,Z=>{t(O)?Z(K):Z(Q,-1)})}x(M),Kt(M,Z=>L(Ee,Z),()=>t(Ee)),x(h),$("click",h,Z=>{Z.target===Z.currentTarget&&(L(z,null),L(O,null))}),I(l,h)};ee(Ie,l=>{t(z)&&t(se)&&l(ve)})}x(D),B(()=>{$e.disabled=t(E).length===0,rt.disabled=t(P).length===0,Je.disabled=n().individuals.length===0,s.disabled=n().individuals.length===0,Ae.disabled=n().individuals.length===0}),$("click",$e,ht),$("click",rt,xt),$("click",Je,Rt),$("click",s,Tt),$("click",X,()=>{var l;return(l=t(F))==null?void 0:l.zoomBy(1/1.18)}),$("click",J,()=>{var l;return(l=t(F))==null?void 0:l.fit()}),$("click",he,()=>{var l;return(l=t(F))==null?void 0:l.zoomBy(1.18)}),$("click",Me,at),$("click",Ge,T),$("click",Ae,Ct),I(a,D),Nn()}Sn(["click"]);export{La as D,Ns as P,Ms as S,Is as U,Ss as a,Ps as e,Cs as s};
