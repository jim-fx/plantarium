!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n(require("@plantarium/geometry"),require("@plantarium/helpers")):"function"==typeof define&&define.amd?define(["@plantarium/geometry","@plantarium/helpers"],n):(t=t||self).nodes=n(t.geometry,t.helpers)}(this,function(t,n){var i={title:"Branches",type:"branch",outputs:["plant"],parameters:{input:{type:"plant",label:"plant",internal:!1},length:{type:["number","parameter","curve"],inputType:"slider",min:0,max:10,step:.05,value:0},thiccness:{type:"number",inputType:"slider",min:0,max:1,step:.01,value:.8},amount:{type:"number",min:0,max:20,value:1}},computeNode:function(t){return{type:"branch",parameters:t}},computeSkeleton:function(n){var i=n.parameters.input.result.skeletons.map(function(n){for(var i=[],r=0;r<2;r++){for(var e=t.interpolateSkeleton(n,.5+r/2*.5),s=e[0],o=e[1],u=e[2],h=e[3],a=new Float32Array(200),c=0;c<200;c++){var f=c/50;a[4*c+0]=s+1*f,a[4*c+1]=o,a[4*c+2]=u,a[4*c+3]=.2*h*(1-f)}i.push(a)}return i}).flat();return console.log("BRANCH",i),{skeletons:i}},computeGeometry:function(n,i){var r=i.getSetting("stemResX");return{geometry:t.join.apply(void 0,[n.parameters.input.result.geometry].concat(n.result.skeletons.map(function(n){return t.tube(n,r)})))}}};function r(t,n){for(var i=0;i<n.length;i++){var r=n[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function e(t,n,i){return n&&r(t.prototype,n),i&&r(t,i),t}function s(t,n){t.prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n}function o(t){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,n){return(u=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function a(t,n,i){return(a=h()?Reflect.construct:function(t,n,i){var r=[null];r.push.apply(r,n);var e=new(Function.bind.apply(t,r));return i&&u(e,i.prototype),e}).apply(null,arguments)}function c(t){var n="function"==typeof Map?new Map:void 0;return(c=function(t){if(null===t||-1===Function.toString.call(t).indexOf("[native code]"))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,i)}function i(){return a(t,arguments,o(this).constructor)}return i.prototype=Object.create(t.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),u(i,t)})(t)}function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function v(t){var n=t[0],i=t[1],r=t[2];return Math.sqrt(n*n+i*i+r*r)}function p(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t}function l(t,n,i){return t[0]=n[0]+i[0],t[1]=n[1]+i[1],t[2]=n[2]+i[2],t}function y(t,n,i){return t[0]=n[0]-i[0],t[1]=n[1]-i[1],t[2]=n[2]-i[2],t}function d(t,n,i){return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t}function m(t){var n=t[0],i=t[1],r=t[2];return n*n+i*i+r*r}function g(t,n){var i=n[0],r=n[1],e=n[2],s=i*i+r*r+e*e;return s>0&&(s=1/Math.sqrt(s)),t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t}function w(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}function M(t,n,i){var r=n[0],e=n[1],s=n[2],o=i[0],u=i[1],h=i[2];return t[0]=e*h-s*u,t[1]=s*o-r*h,t[2]=r*u-e*o,t}var b,k,q=(b=[0,0,0],k=[0,0,0],function(t,n){p(b,t),p(k,n),g(b,b),g(k,k);var i=w(b,k);return i>1?0:i<-1?Math.PI:Math.acos(i)}),x=function(t){function n(n,i,r){var e;return void 0===n&&(n=0),void 0===i&&(i=n),void 0===r&&(r=n),(e=t.call(this,n,i,r)||this).constant=void 0,f(e)||f(e)}s(n,t);var i=n.prototype;return i.set=function(t,n,i){return void 0===n&&(n=t),void 0===i&&(i=t),t.length?this.copy(t):(function(t,n,i,r){t[0]=n,t[1]=i,t[2]=r}(this,t,n,i),this)},i.copy=function(t){return p(this,t),this},i.add=function(t,n){return n?l(this,t,n):l(this,this,t),this},i.sub=function(t,n){return n?y(this,t,n):y(this,this,t),this},i.multiply=function(t){var n,i;return t.length?((n=this)[0]=this[0]*(i=t)[0],n[1]=this[1]*i[1],n[2]=this[2]*i[2]):d(this,this,t),this},i.divide=function(t){var n,i;return t.length?((n=this)[0]=this[0]/(i=t)[0],n[1]=this[1]/i[1],n[2]=this[2]/i[2]):d(this,this,1/t),this},i.inverse=function(t){var n,i;return void 0===t&&(t=this),(n=this)[0]=1/(i=t)[0],n[1]=1/i[1],n[2]=1/i[2],this},i.len=function(){return v(this)},i.distance=function(t){return t?(i=(n=t)[0]-this[0],r=n[1]-this[1],e=n[2]-this[2],Math.sqrt(i*i+r*r+e*e)):v(this);var n,i,r,e},i.squaredLen=function(){return m(this)},i.squaredDistance=function(t){return t?(i=(n=t)[0]-this[0])*i+(r=n[1]-this[1])*r+(e=n[2]-this[2])*e:m(this);var n,i,r,e},i.negate=function(t){var n,i;return void 0===t&&(t=this),(n=this)[0]=-(i=t)[0],n[1]=-i[1],n[2]=-i[2],this},i.cross=function(t,n){return n?M(this,t,n):M(this,this,t),this},i.scale=function(t){return d(this,this,t),this},i.normalize=function(){return g(this,this),this},i.dot=function(t){return w(this,t)},i.equals=function(t){return this[0]===(n=t)[0]&&this[1]===n[1]&&this[2]===n[2];var n},i.applyMatrix4=function(t){var n,i,r,e,s,o;return(n=this)[0]=((i=t)[0]*(r=this[0])+i[4]*(e=this[1])+i[8]*(s=this[2])+i[12])/(o=(o=i[3]*r+i[7]*e+i[11]*s+i[15])||1),n[1]=(i[1]*r+i[5]*e+i[9]*s+i[13])/o,n[2]=(i[2]*r+i[6]*e+i[10]*s+i[14])/o,this},i.scaleRotateMatrix4=function(t){var n,i,r,e,s,o;return(n=this)[0]=((i=t)[0]*(r=this[0])+i[4]*(e=this[1])+i[8]*(s=this[2]))/(o=(o=i[3]*r+i[7]*e+i[11]*s+i[15])||1),n[1]=(i[1]*r+i[5]*e+i[9]*s)/o,n[2]=(i[2]*r+i[6]*e+i[10]*s)/o,this},i.applyQuaternion=function(t){return function(t,n,i){var r=n[0],e=n[1],s=n[2],o=i[0],u=i[1],h=i[2],a=u*s-h*e,c=h*r-o*s,f=o*e-u*r,v=u*f-h*c,p=h*a-o*f,l=o*c-u*a,y=2*i[3];c*=y,f*=y,p*=2,l*=2,t[0]=r+(a*=y)+(v*=2),t[1]=e+c+p,t[2]=s+f+l}(this,this,t),this},i.angle=function(t){return q(this,t)},i.lerp=function(t,n){return function(t,n,i,r){var e=n[0],s=n[1],o=n[2];t[0]=e+r*(i[0]-e),t[1]=s+r*(i[1]-s),t[2]=o+r*(i[2]-o)}(this,this,t,n),this},i.clone=function(){return new n(this[0],this[1],this[2])},i.fromArray=function(t,n){return void 0===n&&(n=0),this[0]=t[n],this[1]=t[n+1],this[2]=t[n+2],this},i.toArray=function(t,n){return void 0===t&&(t=[]),void 0===n&&(n=0),t[n]=this[0],t[n+1]=this[1],t[n+2]=this[2],t},i.transformDirection=function(t){var n=this[0],i=this[1],r=this[2];return this[0]=t[0]*n+t[4]*i+t[8]*r,this[1]=t[1]*n+t[5]*i+t[9]*r,this[2]=t[2]*n+t[6]*i+t[10]*r,this.normalize()},e(n,[{key:"x",get:function(){return this[0]},set:function(t){this[0]=t}},{key:"y",get:function(){return this[1]},set:function(t){this[1]=t}},{key:"z",get:function(){return this[2]},set:function(t){this[2]=t}}]),n}(c(Array));function A(t,n,i){var r=n[0],e=n[1],s=n[2],o=n[3],u=n[4],h=n[5],a=n[6],c=n[7],f=n[8],v=n[9],p=n[10],l=n[11],y=n[12],d=n[13],m=n[14],g=n[15],w=i[0],M=i[1],b=i[2],k=i[3];return t[0]=w*r+M*u+b*f+k*y,t[1]=w*e+M*h+b*v+k*d,t[2]=w*s+M*a+b*p+k*m,t[3]=w*o+M*c+b*l+k*g,t[4]=(w=i[4])*r+(M=i[5])*u+(b=i[6])*f+(k=i[7])*y,t[5]=w*e+M*h+b*v+k*d,t[6]=w*s+M*a+b*p+k*m,t[7]=w*o+M*c+b*l+k*g,t[8]=(w=i[8])*r+(M=i[9])*u+(b=i[10])*f+(k=i[11])*y,t[9]=w*e+M*h+b*v+k*d,t[10]=w*s+M*a+b*p+k*m,t[11]=w*o+M*c+b*l+k*g,t[12]=(w=i[12])*r+(M=i[13])*u+(b=i[14])*f+(k=i[15])*y,t[13]=w*e+M*h+b*v+k*d,t[14]=w*s+M*a+b*p+k*m,t[15]=w*o+M*c+b*l+k*g,t}function C(t,n){var i=n[4],r=n[5],e=n[6],s=n[8],o=n[9],u=n[10];return t[0]=Math.hypot(n[0],n[1],n[2]),t[1]=Math.hypot(i,r,e),t[2]=Math.hypot(s,o,u),t}new x,new x;var O,_=(O=[0,0,0],function(t,n){var i=O;C(i,n);var r=1/i[0],e=1/i[1],s=1/i[2],o=n[0]*r,u=n[1]*e,h=n[2]*s,a=n[4]*r,c=n[5]*e,f=n[6]*s,v=n[8]*r,p=n[9]*e,l=n[10]*s,y=o+c+l,d=0;return y>0?(d=2*Math.sqrt(y+1),t[3]=.25*d,t[0]=(f-p)/d,t[1]=(v-h)/d,t[2]=(u-a)/d):o>c&&o>l?(d=2*Math.sqrt(1+o-c-l),t[3]=(f-p)/d,t[0]=.25*d,t[1]=(u+a)/d,t[2]=(v+h)/d):c>l?(d=2*Math.sqrt(1+c-o-l),t[3]=(v-h)/d,t[0]=(u+a)/d,t[1]=.25*d,t[2]=(f+p)/d):(d=2*Math.sqrt(1+l-o-c),t[3]=(u-a)/d,t[0]=(v+h)/d,t[1]=(f+p)/d,t[2]=.25*d),t}),S=function(t){function n(n,i,r,e,s,o,u,h,a,c,v,p,l,y,d,m){var g;return void 0===n&&(n=1),void 0===i&&(i=0),void 0===r&&(r=0),void 0===e&&(e=0),void 0===s&&(s=0),void 0===o&&(o=1),void 0===u&&(u=0),void 0===h&&(h=0),void 0===a&&(a=0),void 0===c&&(c=0),void 0===v&&(v=1),void 0===p&&(p=0),void 0===l&&(l=0),void 0===y&&(y=0),void 0===d&&(d=0),void 0===m&&(m=1),f(g=t.call(this,n,i,r,e,s,o,u,h,a,c,v,p,l,y,d,m)||this)||f(g)}s(n,t);var i=n.prototype;return i.set=function(t,n,i,r,e,s,o,u,h,a,c,f,v,p,l,y){return t.length?this.copy(t):(function(t,n,i,r,e,s,o,u,h,a,c,f,v,p,l,y,d){t[0]=n,t[1]=i,t[2]=r,t[3]=e,t[4]=s,t[5]=o,t[6]=u,t[7]=h,t[8]=a,t[9]=c,t[10]=f,t[11]=v,t[12]=p,t[13]=l,t[14]=y,t[15]=d}(this,t,n,i,r,e,s,o,u,h,a,c,f,v,p,l,y),this)},i.translate=function(t,n){return void 0===n&&(n=this),function(t,n,i){var r,e,s,o,u,h,a,c,f,v,p,l,y=i[0],d=i[1],m=i[2];n===t?(t[12]=n[0]*y+n[4]*d+n[8]*m+n[12],t[13]=n[1]*y+n[5]*d+n[9]*m+n[13],t[14]=n[2]*y+n[6]*d+n[10]*m+n[14],t[15]=n[3]*y+n[7]*d+n[11]*m+n[15]):(e=n[1],s=n[2],o=n[3],u=n[4],h=n[5],a=n[6],c=n[7],f=n[8],v=n[9],p=n[10],l=n[11],t[0]=r=n[0],t[1]=e,t[2]=s,t[3]=o,t[4]=u,t[5]=h,t[6]=a,t[7]=c,t[8]=f,t[9]=v,t[10]=p,t[11]=l,t[12]=r*y+u*d+f*m+n[12],t[13]=e*y+h*d+v*m+n[13],t[14]=s*y+a*d+p*m+n[14],t[15]=o*y+c*d+l*m+n[15])}(this,n,t),this},i.rotate=function(t,n,i){return void 0===i&&(i=this),function(t,n,i,r){var e,s,o,u,h,a,c,f,v,p,l,y,d,m,g,w,M,b,k,q,x,A,C,O,_=r[0],S=r[1],R=r[2],j=Math.hypot(_,S,R);Math.abs(j)<1e-6||(_*=j=1/j,S*=j,R*=j,e=Math.sin(i),s=Math.cos(i),h=n[1],a=n[2],c=n[3],v=n[5],p=n[6],l=n[7],d=n[9],m=n[10],g=n[11],k=_*S*(o=1-s)-R*e,q=S*S*o+s,x=R*S*o+_*e,A=_*R*o+S*e,C=S*R*o-_*e,O=R*R*o+s,t[0]=(u=n[0])*(w=_*_*o+s)+(f=n[4])*(M=S*_*o+R*e)+(y=n[8])*(b=R*_*o-S*e),t[1]=h*w+v*M+d*b,t[2]=a*w+p*M+m*b,t[3]=c*w+l*M+g*b,t[4]=u*k+f*q+y*x,t[5]=h*k+v*q+d*x,t[6]=a*k+p*q+m*x,t[7]=c*k+l*q+g*x,t[8]=u*A+f*C+y*O,t[9]=h*A+v*C+d*O,t[10]=a*A+p*C+m*O,t[11]=c*A+l*C+g*O,n!==t&&(t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]))}(this,i,t,n),this},i.scale=function(t,n){return void 0===n&&(n=this),function(t,n,i){var r=i[0],e=i[1],s=i[2];t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*e,t[5]=n[5]*e,t[6]=n[6]*e,t[7]=n[7]*e,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=n[11]*s,t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]}(this,n,"number"==typeof t?[t,t,t]:t),this},i.multiply=function(t,n){return n?A(this,t,n):A(this,this,t),this},i.identity=function(){var t;return(t=this)[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this},i.copy=function(t){var n,i;return(n=this)[0]=(i=t)[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this},i.fromPerspective=function(t){var n,i,r,e,s,o,u=void 0===t?{}:t;return n=this,i=u.aspect,r=u.near,e=u.far,s=1/Math.tan(u.fov/2),o=1/(r-e),n[0]=s/i,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=s,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=(e+r)*o,n[11]=-1,n[12]=0,n[13]=0,n[14]=2*e*r*o,n[15]=0,this},i.fromOrthogonal=function(t){return a=1/((e=t.bottom)-(s=t.top)),c=1/((o=t.near)-(u=t.far)),(n=this)[0]=-2*(h=1/((i=t.left)-(r=t.right))),n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=-2*a,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=2*c,n[11]=0,n[12]=(i+r)*h,n[13]=(s+e)*a,n[14]=(u+o)*c,n[15]=1,this;var n,i,r,e,s,o,u,h,a,c},i.fromQuaternion=function(t){return function(t,n){var i=n[0],r=n[1],e=n[2],s=n[3],o=i+i,u=r+r,h=e+e,a=i*o,c=r*o,f=r*u,v=e*o,p=e*u,l=e*h,y=s*o,d=s*u,m=s*h;t[0]=1-f-l,t[1]=c+m,t[2]=v-d,t[3]=0,t[4]=c-m,t[5]=1-a-l,t[6]=p+y,t[7]=0,t[8]=v+d,t[9]=p-y,t[10]=1-a-f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1}(this,t),this},i.setPosition=function(t){return this.x=t[0],this.y=t[1],this.z=t[2],this},i.inverse=function(t){var n,i,r,e,s,o,u,h,a,c,f,v,p,l,y,d,m,g,w,M,b,k,q,x,A,C,O,_,S,R,j;return void 0===t&&(t=this),n=this,(j=(w=(r=(i=t)[0])*(h=i[5])-(e=i[1])*(u=i[4]))*(R=(p=i[10])*(g=i[15])-(l=i[11])*(m=i[14]))-(M=r*(a=i[6])-(s=i[2])*u)*(S=(v=i[9])*g-l*(d=i[13]))+(b=r*(c=i[7])-(o=i[3])*u)*(_=v*m-p*d)+(k=e*a-s*h)*(O=(f=i[8])*g-l*(y=i[12]))-(q=e*c-o*h)*(C=f*m-p*y)+(x=s*c-o*a)*(A=f*d-v*y))&&(n[0]=(h*R-a*S+c*_)*(j=1/j),n[1]=(s*S-e*R-o*_)*j,n[2]=(d*x-m*q+g*k)*j,n[3]=(p*q-v*x-l*k)*j,n[4]=(a*O-u*R-c*C)*j,n[5]=(r*R-s*O+o*C)*j,n[6]=(m*b-y*x-g*M)*j,n[7]=(f*x-p*b+l*M)*j,n[8]=(u*S-h*O+c*A)*j,n[9]=(e*O-r*S-o*A)*j,n[10]=(y*q-d*b+g*w)*j,n[11]=(v*b-f*q-l*w)*j,n[12]=(h*C-u*_-a*A)*j,n[13]=(r*_-e*C+s*A)*j,n[14]=(d*M-y*k-m*w)*j,n[15]=(f*k-v*M+p*w)*j),this},i.compose=function(t,n,i){return function(t,n,i,r){var e=n[0],s=n[1],o=n[2],u=n[3],h=e+e,a=s+s,c=o+o,f=e*h,v=e*a,p=e*c,l=s*a,y=s*c,d=o*c,m=u*h,g=u*a,w=u*c,M=r[0],b=r[1],k=r[2];t[0]=(1-(l+d))*M,t[1]=(v+w)*M,t[2]=(p-g)*M,t[3]=0,t[4]=(v-w)*b,t[5]=(1-(f+d))*b,t[6]=(y+m)*b,t[7]=0,t[8]=(p+g)*k,t[9]=(y-m)*k,t[10]=(1-(f+l))*k,t[11]=0,t[12]=i[0],t[13]=i[1],t[14]=i[2],t[15]=1}(this,t,n,i),this},i.getRotation=function(t){return _(t,this),this},i.getTranslation=function(t){var n;return(n=t)[0]=this[12],n[1]=this[13],n[2]=this[14],this},i.getScaling=function(t){return C(t,this),this},i.getMaxScaleOnAxis=function(){return t=this[0],n=this[1],i=this[2],r=this[4],e=this[5],s=this[6],o=this[8],u=this[9],h=this[10],Math.sqrt(Math.max(t*t+n*n+i*i,r*r+e*e+s*s,o*o+u*u+h*h));var t,n,i,r,e,s,o,u,h},i.lookAt=function(t,n,i){return function(t,n,i,r){var e=n[0],s=n[1],o=n[2],u=r[0],h=r[1],a=r[2],c=e-i[0],f=s-i[1],v=o-i[2],p=c*c+f*f+v*v;0===p?v=1:(c*=p=1/Math.sqrt(p),f*=p,v*=p);var l=h*v-a*f,y=a*c-u*v,d=u*f-h*c;0==(p=l*l+y*y+d*d)&&(a?u+=1e-6:h?a+=1e-6:h+=1e-6,p=(l=h*v-a*f)*l+(y=a*c-u*v)*y+(d=u*f-h*c)*d),y*=p=1/Math.sqrt(p),d*=p,t[0]=l*=p,t[1]=y,t[2]=d,t[3]=0,t[4]=f*d-v*y,t[5]=v*l-c*d,t[6]=c*y-f*l,t[7]=0,t[8]=c,t[9]=f,t[10]=v,t[11]=0,t[12]=e,t[13]=s,t[14]=o,t[15]=1}(this,t,n,i),this},i.determinant=function(){return((n=(t=this)[0])*(o=t[5])-(i=t[1])*(s=t[4]))*((f=t[10])*(d=t[15])-(v=t[11])*(y=t[14]))-(n*(u=t[6])-(r=t[2])*s)*((c=t[9])*d-v*(l=t[13]))+(n*(h=t[7])-(e=t[3])*s)*(c*y-f*l)+(i*u-r*o)*((a=t[8])*d-v*(p=t[12]))-(i*h-e*o)*(a*y-f*p)+(r*h-e*u)*(a*l-c*p);var t,n,i,r,e,s,o,u,h,a,c,f,v,p,l,y,d},i.fromArray=function(t,n){return void 0===n&&(n=0),this[0]=t[n],this[1]=t[n+1],this[2]=t[n+2],this[3]=t[n+3],this[4]=t[n+4],this[5]=t[n+5],this[6]=t[n+6],this[7]=t[n+7],this[8]=t[n+8],this[9]=t[n+9],this[10]=t[n+10],this[11]=t[n+11],this[12]=t[n+12],this[13]=t[n+13],this[14]=t[n+14],this[15]=t[n+15],this},i.toArray=function(t,n){return void 0===t&&(t=[]),void 0===n&&(n=0),t[n]=this[0],t[n+1]=this[1],t[n+2]=this[2],t[n+3]=this[3],t[n+4]=this[4],t[n+5]=this[5],t[n+6]=this[6],t[n+7]=this[7],t[n+8]=this[8],t[n+9]=this[9],t[n+10]=this[10],t[n+11]=this[11],t[n+12]=this[12],t[n+13]=this[13],t[n+14]=this[14],t[n+15]=this[15],t},e(n,[{key:"x",get:function(){return this[12]},set:function(t){this[12]=t}},{key:"y",get:function(){return this[13]},set:function(t){this[13]=t}},{key:"z",get:function(){return this[14]},set:function(t){this[14]=t}},{key:"w",get:function(){return this[15]},set:function(t){this[15]=t}}]),n}(c(Array));function R(t,n,i){var r=n[0],e=n[1],s=n[2],o=n[3],u=i[0],h=i[1],a=i[2],c=i[3];return t[0]=r*c+o*u+e*a-s*h,t[1]=e*c+o*h+s*u-r*a,t[2]=s*c+o*a+r*h-e*u,t[3]=o*c-r*u-e*h-s*a,t}var j=function(t){function n(n,i,r,e){var s;return void 0===n&&(n=0),void 0===i&&(i=0),void 0===r&&(r=0),void 0===e&&(e=1),(s=t.call(this,n,i,r,e)||this).onChange=void 0,s.onChange=function(){},f(s)||f(s)}s(n,t);var i=n.prototype;return i.identity=function(){var t;return(t=this)[0]=0,t[1]=0,t[2]=0,t[3]=1,this.onChange(),this},i.set=function(t,n,i,r){return t.length?this.copy(t):(function(t,n,i,r,e){t[0]=n,t[1]=i,t[2]=r,t[3]=e}(this,t,n,i,r),this.onChange(),this)},i.rotateX=function(t){return function(t,n,i){i*=.5;var r=n[0],e=n[1],s=n[2],o=n[3],u=Math.sin(i),h=Math.cos(i);t[0]=r*h+o*u,t[1]=e*h+s*u,t[2]=s*h-e*u,t[3]=o*h-r*u}(this,this,t),this.onChange(),this},i.rotateY=function(t){return function(t,n,i){i*=.5;var r=n[0],e=n[1],s=n[2],o=n[3],u=Math.sin(i),h=Math.cos(i);t[0]=r*h-s*u,t[1]=e*h+o*u,t[2]=s*h+r*u,t[3]=o*h-e*u}(this,this,t),this.onChange(),this},i.rotateZ=function(t){return function(t,n,i){i*=.5;var r=n[0],e=n[1],s=n[2],o=n[3],u=Math.sin(i),h=Math.cos(i);t[0]=r*h+e*u,t[1]=e*h-r*u,t[2]=s*h+o*u,t[3]=o*h-s*u}(this,this,t),this.onChange(),this},i.inverse=function(t){var n,i,r,e,s,o,u,h;return void 0===t&&(t=this),(n=this)[0]=-(r=(i=t)[0])*(h=(u=r*r+(e=i[1])*e+(s=i[2])*s+(o=i[3])*o)?1/u:0),n[1]=-e*h,n[2]=-s*h,n[3]=o*h,this.onChange(),this},i.conjugate=function(t){var n,i;return void 0===t&&(t=this),(n=this)[0]=-(i=t)[0],n[1]=-i[1],n[2]=-i[2],n[3]=i[3],this.onChange(),this},i.copy=function(t){return(n=this)[0]=(i=t)[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],this.onChange(),this;var n,i},i.normalize=function(t){return void 0===t&&(t=this),(o=(i=(n=t)[0])*i+(r=n[1])*r+(e=n[2])*e+(s=n[3])*s)>0&&(o=1/Math.sqrt(o)),this[0]=i*o,this[1]=r*o,this[2]=e*o,this[3]=s*o,this.onChange(),this;var n,i,r,e,s,o},i.multiply=function(t,n){return n?R(this,t,n):R(this,this,t),this.onChange(),this},i.dot=function(t){return(n=this)[0]*(i=t)[0]+n[1]*i[1]+n[2]*i[2]+n[3]*i[3];var n,i},i.fromMatrix3=function(t){return function(t,n){var i,r=n[0]+n[4]+n[8];if(r>0)i=Math.sqrt(r+1),t[3]=.5*i,t[0]=(n[5]-n[7])*(i=.5/i),t[1]=(n[6]-n[2])*i,t[2]=(n[1]-n[3])*i;else{var e=0;n[4]>n[0]&&(e=1),n[8]>n[3*e+e]&&(e=2);var s=(e+1)%3,o=(e+2)%3;i=Math.sqrt(n[3*e+e]-n[3*s+s]-n[3*o+o]+1),t[e]=.5*i,t[3]=(n[3*s+o]-n[3*o+s])*(i=.5/i),t[s]=(n[3*s+e]+n[3*e+s])*i,t[o]=(n[3*o+e]+n[3*e+o])*i}}(this,t),this.onChange(),this},i.fromEuler=function(t){return function(t,n,i){void 0===i&&(i="YXZ");var r=Math.sin(.5*n[0]),e=Math.cos(.5*n[0]),s=Math.sin(.5*n[1]),o=Math.cos(.5*n[1]),u=Math.sin(.5*n[2]),h=Math.cos(.5*n[2]);"XYZ"===i?(t[0]=r*o*h+e*s*u,t[1]=e*s*h-r*o*u,t[2]=e*o*u+r*s*h,t[3]=e*o*h-r*s*u):"YXZ"===i?(t[0]=r*o*h+e*s*u,t[1]=e*s*h-r*o*u,t[2]=e*o*u-r*s*h,t[3]=e*o*h+r*s*u):"ZXY"===i?(t[0]=r*o*h-e*s*u,t[1]=e*s*h+r*o*u,t[2]=e*o*u+r*s*h,t[3]=e*o*h-r*s*u):"ZYX"===i?(t[0]=r*o*h-e*s*u,t[1]=e*s*h+r*o*u,t[2]=e*o*u-r*s*h,t[3]=e*o*h+r*s*u):"YZX"===i?(t[0]=r*o*h+e*s*u,t[1]=e*s*h+r*o*u,t[2]=e*o*u-r*s*h,t[3]=e*o*h-r*s*u):"XZY"===i&&(t[0]=r*o*h-e*s*u,t[1]=e*s*h-r*o*u,t[2]=e*o*u+r*s*h,t[3]=e*o*h+r*s*u)}(this,t,t.order),this},i.fromAxisAngle=function(t,n){return function(t,n,i){i*=.5;var r=Math.sin(i);t[0]=r*n[0],t[1]=r*n[1],t[2]=r*n[2],t[3]=Math.cos(i)}(this,t,n),this},i.slerp=function(t,n){return function(t,n,i,r){var e,s,o,u,h,a=n[0],c=n[1],f=n[2],v=n[3],p=i[0],l=i[1],y=i[2],d=i[3];(s=a*p+c*l+f*y+v*d)<0&&(s=-s,p=-p,l=-l,y=-y,d=-d),1-s>1e-6?(e=Math.acos(s),o=Math.sin(e),u=Math.sin((1-r)*e)/o,h=Math.sin(r*e)/o):(u=1-r,h=r),t[0]=u*a+h*p,t[1]=u*c+h*l,t[2]=u*f+h*y,t[3]=u*v+h*d}(this,this,t,n),this},i.fromArray=function(t,n){return void 0===n&&(n=0),this[0]=t[n],this[1]=t[n+1],this[2]=t[n+2],this[3]=t[n+3],this},i.toArray=function(t,n){return void 0===t&&(t=[]),void 0===n&&(n=0),t[n]=this[0],t[n+1]=this[1],t[n+2]=this[2],t[n+3]=this[3],t},e(n,[{key:"x",get:function(){return this[0]},set:function(t){this[0]=t,this.onChange()}},{key:"y",get:function(){return this[1]},set:function(t){this[1]=t,this.onChange()}},{key:"z",get:function(){return this[2]},set:function(t){this[2]=t,this.onChange()}},{key:"w",get:function(){return this[3]},set:function(t){this[3]=t,this.onChange()}}]),n}(c(Array));function X(t,n,i){return t[0]=n[0]+i[0],t[1]=n[1]+i[1],t}function P(t,n,i){return t[0]=n[0]-i[0],t[1]=n[1]-i[1],t}function Y(t,n,i){return t[0]=n[0]*i,t[1]=n[1]*i,t}function z(t){var n=t[0],i=t[1];return Math.sqrt(n*n+i*i)}function Z(t,n){return t[0]*n[1]-t[1]*n[0]}new S,new S,new x,new x;var D=function(t){function n(n,i){var r;return void 0===n&&(n=0),void 0===i&&(i=n),f(r=t.call(this,n,i)||this)||f(r)}s(n,t);var i=n.prototype;return i.set=function(t,n){return void 0===n&&(n=t),t.length?this.copy(t):(function(t,n,i){t[0]=n,t[1]=i}(this,t,n),this)},i.copy=function(t){var n,i;return(n=this)[0]=(i=t)[0],n[1]=i[1],this},i.add=function(t,n){return n?X(this,t,n):X(this,this,t),this},i.sub=function(t,n){return n?P(this,t,n):P(this,this,t),this},i.multiply=function(t){var n,i;return t.length?((n=this)[0]=this[0]*(i=t)[0],n[1]=this[1]*i[1]):Y(this,this,t),this},i.divide=function(t){var n,i;return t.length?((n=this)[0]=this[0]/(i=t)[0],n[1]=this[1]/i[1]):Y(this,this,1/t),this},i.inverse=function(t){var n,i;return void 0===t&&(t=this),(n=this)[0]=1/(i=t)[0],n[1]=1/i[1],this},i.len=function(){return z(this)},i.distance=function(t){return t?(i=(n=t)[0]-this[0],r=n[1]-this[1],Math.sqrt(i*i+r*r)):z(this);var n,i,r},i.squaredLen=function(){return this.squaredDistance()},i.squaredDistance=function(t){return t?(i=(n=t)[0]-this[0])*i+(r=n[1]-this[1])*r:function(t){var n=t[0],i=t[1];return n*n+i*i}(this);var n,i,r},i.negate=function(t){var n,i;return void 0===t&&(t=this),(n=this)[0]=-(i=t)[0],n[1]=-i[1],this},i.cross=function(t,n){return n?Z(t,n):Z(this,t)},i.scale=function(t){return Y(this,this,t),this},i.normalize=function(){var t,n,i,r;return(r=(n=(t=this)[0])*n+(i=t[1])*i)>0&&(r=1/Math.sqrt(r)),this[0]=t[0]*r,this[1]=t[1]*r,this},i.dot=function(t){return this[0]*(n=t)[0]+this[1]*n[1];var n},i.equals=function(t){return this[0]===(n=t)[0]&&this[1]===n[1];var n},i.applyMatrix3=function(t){var n,i,r,e;return(n=this)[0]=(i=t)[0]*(r=this[0])+i[3]*(e=this[1])+i[6],n[1]=i[1]*r+i[4]*e+i[7],this},i.applyMatrix4=function(t){var n,i,r,e;return(n=this)[0]=(i=t)[0]*(r=this[0])+i[4]*(e=this[1])+i[12],n[1]=i[1]*r+i[5]*e+i[13],this},i.lerp=function(t,n){!function(t,n,i,r){var e=n[0],s=n[1];t[0]=e+r*(i[0]-e),t[1]=s+r*(i[1]-s)}(this,this,t,n)},i.clone=function(){return new n(this[0],this[1])},i.fromArray=function(t,n){return void 0===n&&(n=0),this[0]=t[n],this[1]=t[n+1],this},i.toArray=function(t,n){return void 0===t&&(t=[]),void 0===n&&(n=0),t[n]=this[0],t[n+1]=this[1],t},e(n,[{key:"x",get:function(){return this[0]},set:function(t){this[0]=t}},{key:"y",get:function(){return this[1]},set:function(t){this[1]=t}}]),n}(c(Array)),N=(new x,new D,new D,new D,new D,new D,new x,new x,new x,new x,new x,new x,new x,new x,new x,new x,new x,new S,new x,new x,new x,new x,new x,new j,new x,new x,new j,new x,new S,new x,new x,new x,new x,new x,new j,new j,new j,new j,new S,new S,n.logger("node.gravity"));return Object.values({__proto__:null,Branch:i,Gravity:{title:"Gravity",type:"gravity",outputs:["plant"],parameters:{input:{type:"plant"}},computeNode:function(t){return{type:"gravity",parameters:t}},computeSkeleton:function(n){var i=n.parameters,r=i.input,e=i.type;N(e,.5);var s=r.result.skeletons;return"simple"===e?{skeletons:s.map(function(n,i){for(var r=n.length/4,e=1;e<r;e++){var s=n[4*e+0],o=n[4*e+1],u=n[4*e+2],h=[n[0],n[1],n[2]],a=e/r,c=.5*t.noise.n1d(200*i)*a;n[4*e+0]=Math.cos(c)*(s-h[0])-Math.sin(c)*(o-h[1])+h[0],n[4*e+1]=Math.sin(c)*(s-h[0])+Math.cos(c)*(o-h[1])+h[1],n[4*e+2]=u}return n})}:{skeletons:s.map(function(n){for(var i=n.length/4,r=1;r<i;r++)for(var e=n[4*r+0],s=n[4*r+1],o=n[4*r+2],u=new x(5,0,0).cross(new x(e,s,o),new x(0,1,0)),h=r;h<i;h++){var a=t.arbitraryRotate([e,s,o],0,u);n[4*h+0]=a[0],n[4*h+1]=a[1],n[4*h+2]=a[2]}return n})}}},Stem:{title:"Stem",type:"stem",outputs:["plant"],parameters:{origin:{type:"vec3",internal:!1},height:{type:"number",inputType:"slider",min:0,max:5,step:.05,value:0},thiccness:{type:"number",inputType:"slider",min:0,max:.2,step:.01,value:0},amount:{type:"number",min:0,max:20,value:1}},computeNode:function(t){return{type:"stem",parameters:t}},computeSkeleton:function(t,n){var i=n.getSetting("stemResY",50);console.log(i);for(var r=[],e=0;e<1;e++){for(var s=new Float32Array(4*i),o=0;o<i;o++){var u=o/i,h=0+3*u;s[4*o+0]=0,s[4*o+1]=h,s[4*o+2]=0,s[4*o+3]=.4*(1-u)}r.push(s)}return{skeletons:r}},computeGeometry:function(n,i){var r=i.getSetting("stemResX");return{geometry:t.join.apply(void 0,n.result.skeletons.map(function(n){return t.tube(n,r)}))}}},Output:{title:"Output",type:"output",outputs:[],parameters:{main:{type:"plant",label:"plant",internal:!1}},computeNode:function(t){return void 0===t&&(t={}),t.main}}}).map(function(t){return t.compute=t.computeNode,t})});
//# sourceMappingURL=index.umd.js.map
