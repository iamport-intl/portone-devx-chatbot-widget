"use strict";(this.webpackChunkWidget=this.webpackChunkWidget||[]).push([[784],{9784:(e,r,n)=>{n.r(r),n.d(r,{default:()=>h});var t=n(6540),a=n(7403),c=n(7622),s=n(222),i=n(9731),l=n(4848);function o(e){let{inline:r,className:n,children:a,...i}=e;const o=/language-(\w+)/.exec(n||""),[d,u]=(0,t.useState)(!1);return!r&&o?(0,l.jsxs)("div",{className:"relative my-4",children:[(0,l.jsx)("button",{onClick:async()=>{const e=String(a).replace(/\n$/,"");try{await navigator.clipboard.writeText(e),u(!0),setTimeout((()=>u(!1)),2e3)}catch(e){console.error("Failed to copy code: ",e)}},className:"absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded",children:d?"Copied":"Copy"}),(0,l.jsx)(c.A,{language:o[1],style:s.A,PreTag:"div",className:"rounded-lg overflow-x-auto",...i,children:String(a).replace(/\n$/,"")})]}):(0,l.jsx)("code",{className:n,...i,children:a})}function d(e){let{href:r,children:n,...t}=e;return(0,l.jsx)("a",{href:r,target:"_blank",rel:"noopener noreferrer",className:"underline cursor-pointer",...t,children:n})}function u(e){let{children:r}=e;return(0,l.jsx)("div",{children:(0,l.jsx)("p",{className:"mb-4",children:r})})}function h(e){let{content:r}=e;return(0,l.jsx)("div",{className:"prose max-w-none break-words whitespace-normal mb-2",children:(0,l.jsx)(a.o,{remarkPlugins:[i.A],components:{code:o,a:d,p:u},children:r})})}}}]);