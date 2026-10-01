(function(){
  "use strict";
  var share=document.getElementById("share-app"),box=document.getElementById("sharebox"),copy=document.getElementById("copy-link"),close=document.getElementById("close-share"),input=document.getElementById("app-link"),status=document.getElementById("share-status");
  if(!share||!box||!copy||!close||!input||!status)return;
  var url="https://apps.apple.com/app/my-family-world/id6790840913",busy=false,alive=true,generation=0;
  function message(key){return box.getAttribute("data-"+key)||"";}
  function setBusy(on){busy=on;share.disabled=on;copy.disabled=on;close.disabled=on;share.setAttribute("aria-busy",String(on));copy.setAttribute("aria-busy",String(on));}
  function current(token){return alive&&token===generation;}
  function fallback(text){box.hidden=false;status.textContent=text||message("unavailable");try{input.focus({preventScroll:true});}catch(_){input.focus();}}
  function reset(){generation++;setBusy(false);status.textContent="";box.hidden=true;}
  window.addEventListener("pagehide",function(){alive=false;reset();});
  window.addEventListener("pageshow",function(){alive=true;reset();});
  share.addEventListener("click",function(){
    if(busy)return;
    var token=++generation;status.textContent="";setBusy(true);
    if(typeof navigator.share!=="function"){setBusy(false);fallback(message("unavailable"));return;}
    var request;
    try{request=navigator.share({title:document.body.getAttribute("data-app-name")||"My Family World",text:document.body.getAttribute("data-share-text")||"",url:url});}
    catch(error){setBusy(false);if(!error||error.name!=="AbortError")fallback(message("unavailable"));return;}
    Promise.resolve(request).then(function(){if(current(token)){box.hidden=true;status.textContent="";}}).catch(function(error){if(current(token)&&(!error||error.name!=="AbortError"))fallback(message("unavailable"));}).finally(function(){if(current(token))setBusy(false);});
  });
  copy.addEventListener("click",function(){
    if(busy)return;
    var token=++generation;status.textContent="";setBusy(true);
    var request;
    try{if(!navigator.clipboard||typeof navigator.clipboard.writeText!=="function")throw new Error("Clipboard unavailable");request=navigator.clipboard.writeText(url);}
    catch(_){setBusy(false);input.focus();input.select();status.textContent=message("manual");return;}
    Promise.resolve(request).then(function(){if(current(token))status.textContent=message("copied");}).catch(function(){if(current(token)){input.focus();input.select();status.textContent=message("manual");}}).finally(function(){if(current(token))setBusy(false);});
  });
  close.addEventListener("click",function(){reset();share.focus();});
  box.addEventListener("keydown",function(event){if(event.key==="Escape"&&!busy){event.preventDefault();reset();share.focus();}});
})();
