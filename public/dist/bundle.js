!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){var n,o=[];function r(){var e=o.reduce((function(e,t){return e+parseInt(t.value)}),0);document.querySelector("#total").textContent=e}function a(){var e=document.querySelector("#tbody");e.innerHTML="",o.forEach((function(t){var n=document.createElement("tr");n.innerHTML="\n      <td>".concat(t.name,"</td>\n      <td>").concat(t.value,"</td>\n    "),e.appendChild(n)}))}function c(){var e=o.slice().reverse(),t=0,r=e.map((function(e){var t=new Date(e.date);return"".concat(t.getMonth()+1,"/").concat(t.getDate(),"/").concat(t.getFullYear())})),a=e.map((function(e){return t+=parseInt(e.value)}));n&&n.destroy();var c=document.getElementById("myChart").getContext("2d");n=new Chart(c,{type:"line",data:{labels:r,datasets:[{label:"Total Over Time",fill:!0,backgroundColor:"#6666ff",data:a}]}})}fetch("/api/transaction").then((function(e){return e.json()})).then((function(e){o=e,r(),a(),c()}));var u=indexedDB.open("budget",2);function i(e){var t=document.querySelector("#t-name"),n=document.querySelector("#t-amount"),u=document.querySelector(".form .error");if(""!==t.value&&""!==n.value){u.textContent="";var i={name:t.value,value:n.value,date:(new Date).toISOString()};e||(i.value*=-1),o.unshift(i),c(),a(),r(),fetch("/api/transaction",{method:"POST",body:JSON.stringify(i),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){e.errors?u.textContent="Missing Information":(t.value="",n.value="")})).catch((function(e){saveRecord(i),t.value="",n.value=""}))}else u.textContent="Missing Information"}u.onerror=function(e){console.log("Whoops indexddb error:",error)},u.onsuccess=function(e){db=e.target.result,navigator.onLine&&checkDatabase()},u.onupgradeneeded=function(e){e.target.result.createObjectStore("budget",{autoIncrement:!0}).createIndex("pendingIndex","pending")},saveRecord=function(e){db.transaction(["budget"],"readwrite").objectStore("budget").add(e)},checkDatabase=function(){transaction=db.transaction(["budget"],"readwrite");var e=transaction.objectStore("budget").getAll();e.onsuccess=function(){e.result.length>0&&fetch("/api/transaction/bulk",{method:"POST",body:JSON.stringify(e.result),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(){db.transaction(["budget"],"readwrite").objectStore("budget").clear()}))}},window.addEventListener("online",checkDatabase),document.querySelector("#add-btn").onclick=function(){i(!0)},document.querySelector("#sub-btn").onclick=function(){i(!1)}}]);