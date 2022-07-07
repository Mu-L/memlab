"use strict";(self.webpackChunkmemlab_website=self.webpackChunkmemlab_website||[]).push([[162],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>u});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(n),u=i,h=d["".concat(s,".").concat(u)]||d[u]||m[u]||r;return n?a.createElement(h,o(o({ref:t},p),{},{components:n})):a.createElement(h,o({ref:t},p))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9390:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>m,frontMatter:()=>r,metadata:()=>l,toc:()=>c});var a=n(7462),i=(n(7294),n(3905));const r={sidebar_position:2},o="Getting Started",l={unversionedId:"getting-started",id:"getting-started",title:"Getting Started",description:"In this section, you will learn how to use memlab to detect a memory leak. Please make sure you have completed a installation step in your local machine. We start with defining the scenario file where we specify how memlab should interact with our page.",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started",permalink:"/docs/getting-started",draft:!1,editUrl:"https://github.com/facebookincubator/memlab/blob/main/website/docs/getting-started.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"sidebar",previous:{title:"Installation",permalink:"/docs/installation"},next:{title:"Detached DOM",permalink:"/docs/guides/guides-detached-dom"}},s={},c=[{value:"Write a Test Scenario",id:"write-a-test-scenario",level:3},{value:"Running memlab",id:"running-memlab",level:3}],p={toc:c};function m(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"getting-started"},"Getting Started"),(0,i.kt)("p",null,"In this section, you will learn how to use ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," to detect a memory leak. Please make sure you have completed a ",(0,i.kt)("a",{parentName:"p",href:"/docs/installation"},"installation")," step in your local machine. We start with defining the scenario file where we specify how ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," should interact with our page."),(0,i.kt)("h3",{id:"write-a-test-scenario"},"Write a Test Scenario"),(0,i.kt)("p",null,"A scenario file is a ",(0,i.kt)("inlineCode",{parentName:"p"},"js")," file that exports functions to provide details about how to navigate to and interact with your page. Now let's copy the following example and save it as ",(0,i.kt)("inlineCode",{parentName:"p"},"~/memlab/scenraio.js")," file somewhere we can find later."),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Feel free to save the scenario file anywhere. We will be using this file in ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," shortly."))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'// initial page load\'s url\nfunction url() {\n  return "https://www.youtube.com";\n}\n\n// action where you suspect the memory leak might be happening\nasync function action(page) {\n  await page.click(\'[id="video-title-link"]\');\n}\n\n// how to go back to the state before action\nasync function back(page) {\n  await page.click(\'[id="logo-icon"]\');\n}\n\nmodule.exports = { action, back, url };\n')),(0,i.kt)("p",null,"For more to learn, head over to see API definition of ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/interfaces/core_src.IScenario"},"scenario"),"."),(0,i.kt)("h3",{id:"running-memlab"},"Running memlab"),(0,i.kt)("p",null,"Run ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," in your console to make sure it is installed. You should see the help instructions in console."),(0,i.kt)("p",null,"Now let's pass the ",(0,i.kt)("inlineCode",{parentName:"p"},"~/memlab/scenario.js")," file we created to ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," as shown below:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"$ memlab run --scenario ~/memlab/scenario.js\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," will lively update a breadcrumb showing the progress of interaction with the target web page:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"page-load(baseline)[s1] > action-on-page(target)[s2] > revert(final)[s3]\nConnecting to web server...\n")),(0,i.kt)("p",null,"After ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," finishes running, the console will show the JavaScript heap size of each navigation step and all leak objects grouped by their potential root causes. The details may differ in your case but it will be something like:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"page-load[23MB](baseline)[s1] > action-on-page[37.3MB](target)[s2] > revert[35.9MB](final)[s3]\n")),(0,i.kt)("p",null,"A breakdown of each step in the breadcrumb:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"page-load (baseline)")," - this is our starting point where we see how much memory was allocated when the page is loaded"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"action-on-page(target)")," - after performing the action - in our case, it is clicking the link with id ",(0,i.kt)("inlineCode",{parentName:"li"},'"video-title-link"')," - we see how much memory was allocated"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"revert(final)")," - this is when we perform the back/reverse action. In this example, it is going back to the home page.")),(0,i.kt)("p",null,"If you would like to learn about how ",(0,i.kt)("inlineCode",{parentName:"p"},"memlab")," detects memory leak, please head over to ",(0,i.kt)("a",{parentName:"p",href:"/docs/how-memlab-works"},"How memlab works")," section."))}m.isMDXComponent=!0}}]);