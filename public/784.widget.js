"use strict";(this.webpackChunkWidget=this.webpackChunkWidget||[]).push([[784],{9784:(e,r,n)=>{n.r(r),n.d(r,{default:()=>u});var t=n(6540),a=n(7403),s=n(7622),c=n(222),o=n(9731),i=n(4848);function l(e){let{inline:r,className:n,children:a,...o}=e;const l=/language-(\w+)/.exec(n||""),[d,u]=(0,t.useState)(!1);return!r&&l?(0,i.jsxs)("div",{className:"relative my-4",children:[(0,i.jsx)("button",{onClick:async()=>{const e=String(a).replace(/\n$/,"");try{await navigator.clipboard.writeText(e),u(!0),setTimeout((()=>u(!1)),2e3)}catch(e){console.error("Failed to copy code: ",e)}},className:"absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded",children:d?"Copied":"Copy"}),(0,i.jsx)(s.A,{language:l[1],style:c.A,PreTag:"div",className:"rounded-lg overflow-x-auto",...o,children:String(a).replace(/\n$/,"")})]}):(0,i.jsx)("code",{className:n,...o,children:a})}function d(e){let{href:r,children:n,...t}=e;return(0,i.jsx)("a",{href:r,target:"_blank",rel:"noopener noreferrer",className:"underline cursor-pointer",...t,children:n})}function u(e){let{content:r}=e;return(0,i.jsx)("div",{className:"prose max-w-none break-words whitespace-normal mb-2",children:(0,i.jsx)(a.o,{remarkPlugins:[o.A],components:{code:l,a:d},children:r})})}}}]);