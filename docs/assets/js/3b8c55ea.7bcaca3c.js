"use strict";(self.webpackChunkmemlab_website=self.webpackChunkmemlab_website||[]).push([[217],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),c=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(t),d=a,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return t?r.createElement(f,i(i({ref:n},p),{},{components:t})):r.createElement(f,i({ref:n},p))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},9803:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return u}});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),i=["components"],l={},s="Installation",c={unversionedId:"installation",id:"installation",title:"Installation",description:"Prequisites",source:"@site/docs/installation.md",sourceDirName:".",slug:"/installation",permalink:"/docs/installation",draft:!1,editUrl:"https://github.com/facebookincubator/memlab/blob/main/website/docs/installation.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"Introduction",permalink:"/docs/intro"},next:{title:"Getting Started",permalink:"/docs/getting-started"}},p={},u=[{value:"Prequisites",id:"prequisites",level:2},{value:"Install",id:"install",level:2},{value:"Commands:",id:"commands",level:2}],m={toc:u};function d(e){var n=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"installation"},"Installation"),(0,o.kt)("h2",{id:"prequisites"},"Prequisites"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://nodejs.org/en/download/"},"Node.js")," version 14 or above:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"When installing Node.js, you are recommended to check all checkboxes related to dependencies."))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.npmjs.com/"},"Npm"))),(0,o.kt)("h2",{id:"install"},"Install"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"npm install -g @memlab/cli\n")),(0,o.kt)("h2",{id:"commands"},"Commands:"),(0,o.kt)("p",null,"To check if the installation complete, run ",(0,o.kt)("inlineCode",{parentName:"p"},"memlab help")," in your console, you should see helper text as follows:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ memlab help\n\n  memlab: memory leak detector for front-end JS\n\n  COMMON COMMANDS\n\n    memlab run --app=comet --interaction=watch\n    Find memory leaks in web apps\n    Options: --work-dir --app --interaction --run-mode\n             --local-puppeteer --scenario --device --disable-xvfb\n             --skip-warmup --full --skip-snapshot --skip-screenshot\n             --skip-gc --skip-scroll --skip-extra-ops --baseline\n             --target --final --snapshot-dir --engine\n             --oversize-threshold --trace-all-objects\n             --save-trace-as-unclassified-cluster\n\n    memlab list\n    List all test scenarios\n\n    memlab report --nodeId=@3123123\n    Report retainer trace of a specific node, use with --nodeId\n    Options: --snapshot --snapshot-dir --engine --nodeId\n\n    memlab explore\n    Find memory leaks in heap snapshots\n    Options: --baseline --target --final --snapshot-dir --engine\n             --oversize-threshold --trace-all-objects\n             --save-trace-as-unclassified-cluster --work-dir\n\n    memlab analyze <PLUGIN_NAME> [PLUGIN_OPTIONS]\n    Run heap analysis plugins\n    Options: --work-dir\n\n    memlab help <COMMAND> [SUB-COMMANDS]\n    List all memlab CLI commands or print helper text for a specific command\n")))}d.isMDXComponent=!0}}]);