"use strict";(this.webpackChunkWidget=this.webpackChunkWidget||[]).push([[784],{9784:(e,r,n)=>{n.r(r),n.d(r,{default:()=>h});var t=n(6540),a=n(7403),c=n(7622),s=n(222),l=n(9731),i=n(4848);function o(e){let{inline:r,className:n,children:a,...l}=e;const o=/language-(\w+)/.exec(n||""),[d,u]=(0,t.useState)(!1);return!r&&o?(0,i.jsxs)("div",{className:"relative my-4",children:[(0,i.jsx)("button",{onClick:async()=>{const e=String(a).replace(/\n$/,"");try{await navigator.clipboard.writeText(e),u(!0),setTimeout((()=>u(!1)),2e3)}catch(e){console.error("Failed to copy code: ",e)}},className:"absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded",children:d?"Copied":"Copy"}),(0,i.jsx)(c.A,{language:o[1],style:s.A,PreTag:"div",className:"rounded-lg overflow-x-auto",...l,children:String(a).replace(/\n$/,"")})]}):(0,i.jsx)("code",{className:n,...l,children:a})}function d(e){let{href:r,children:n,...t}=e;return(0,i.jsx)("a",{href:r,target:"_blank",rel:"noopener noreferrer",className:"underline cursor-pointer text-blue-500",...t,children:n})}function u(e){let{children:r}=e;return(0,i.jsx)("div",{children:(0,i.jsx)("p",{className:"mb-4",children:r})})}function h(e){let{content:r}=e;return(0,i.jsx)("div",{className:"prose max-w-none break-words whitespace-normal mb-2",children:(0,i.jsx)(a.o,{remarkPlugins:[l.A],components:{code:o,a:d,p:u},children:r})})}}}]);