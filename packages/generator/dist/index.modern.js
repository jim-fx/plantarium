import{logger as e}from"@plantarium/helpers";import{calculateNormals as t}from"@plantarium/geometry";export{ground}from"@plantarium/geometry";import r from"@plantarium/nodes";const o={};r.forEach(e=>{o[e.type]=e});const n={};r.forEach(e=>{n[e.type]=e});var s=(e,t)=>e.type in n?n[e.type].computeGeometry(e,t):e.result;let a,p="";const m=e("gen.plant"),l=e=>"object"==typeof e&&"type"in e,c=(e,t)=>{m("skeleton."+e.type,e);const r={};return Object.entries(e.parameters).forEach(([e,o])=>{r[e]=l(o)?c(o,t):o}),e.parameters=r,e.result=((e,t)=>e.type in o?o[e.type].computeSkeleton(e,t):e.result)(e,t),m("skeleton."+e.type,e.result),e},u=(e,t)=>{m("geometry."+e.type,e);const r={};return Object.entries(e.parameters).forEach(([e,o])=>{r[e]=l(o)?u(o,t):o}),e.parameters=r,e.result={...e.result,...s(e,t)},m("geometry."+e.type,e.result),e};function y(e,r){const o=(e=>{const t=JSON.stringify(e);return t!==p&&(p=t,a=(e=>({handleParameter:(e,t)=>t,getSetting:(t,r)=>(console.log("CTX GET",t,e[t]),e[t]??r),get seed(){return Math.random()},refresh:()=>Math.random()}))(e)),a})(r);console.log(e,o);const n=c(e,o);m("final skeleton",n);const s=u(n,o);m("geo",s);const{result:l}=s;return l.geometry=t(l.geometry),l}export{y as plant};
//# sourceMappingURL=index.modern.js.map
