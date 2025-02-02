/* eslint-disable @typescript-eslint/naming-convention */
import { readFileSync } from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';



export function activate(context: vscode.ExtensionContext) {
  var currentEditor: any = undefined;
  var currentSelection: any = undefined;
  
  vscode.window.onDidChangeTextEditorSelection((e) => {
    currentEditor = e.textEditor;
    currentSelection = currentEditor.selection.active;
  });

  
  const disposable = vscode.commands.registerCommand('insert-color.insertColor', () => {

    const panel = vscode.window.createWebviewPanel(
      'colorwheel',
      'Color Wheel',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview')),
          vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'color-picker.html')),
          vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'color-picker.css'))
        ]
      }
    );

    /* const htmlDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'color-picker.html'));
    const htmlPath = panel.webview.asWebviewUri(htmlDiskPath);

    const styleDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'color-picker.css'));
    const stylePath = panel.webview.asWebviewUri(styleDiskPath);

    const colorisStylePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'coloris.min.css'));
    const colorisStyle = panel.webview.asWebviewUri(colorisStylePath);

    const colorisScriptPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'coloris.min.js'));
    const colorisScript = panel.webview.asWebviewUri(colorisScriptPath);

    const SCRIPTS = [
      {name: "color-picker.css", path: stylePath},
      {name: "coloris.min.css", path: colorisStyle},
      {name: "coloris.min.js", path: colorisScript},
    ]; */

    panel.webview.html = getWebviewContent([]);
    panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'icon.png'))

    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'export':
            if (!currentEditor) {
              vscode.window.showErrorMessage('No editor is active');
              return;
            }
            if (!currentEditor.selection) {
              vscode.window.showErrorMessage('No location selected');
              return;
            }

            currentEditor.edit((editBuilder: vscode.TextEditorEdit) => {
              currentEditor.selections.forEach((sel: vscode.Position | vscode.Range | vscode.Selection) => {
                editBuilder.replace(sel, message.text);
              });
            });

            break;
          case 'copy':
            vscode.env.clipboard.writeText(message.text);
            break;
        }

      },
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }



function getWebviewContent(scripts: any[]): string {
  let text = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <!-- <meta
        http-equiv="Content-Security-Policy"
        content="default-src self; img-src vscode-resource:; script-src vscode-resource: 'self' 'unsafe-inline'; style-src vscode-resource: 'self' 'unsafe-inline'; "
      /> -->
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  
      <title>Color Picker</title>
      <link rel="stylesheet" href="color-picker.css" type="text/css" />
  
      <style>
        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 300,
          'GRAD' 0,
          'opsz' 1;
          font-size: 20px;
        }
        .center{
          display: flex;
          align-items: center;
        }
        .clr-field{
          display:none !important;
        }
        #clr-picker{
          margin: 20px;
          width: 475px;
        }
        .clr-format{
          margin: 0px 20px 20px !important;
          width: calc(50% - 40px) !important;
        }
        #export{
          height: 65px;
          position: absolute;
          bottom: 0;
          right: 0;
          width: calc(50% - 40px) !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #export>button{
          height: 50%;
          border: 1px solid #777;
          background-color: transparent;
          fill: white;
          color: white;
          outline: none;
          line-height: 10px;
        }
        #export>button:hover{
          background-color: rgba(0,0,0,0.1);
          cursor: pointer;
        }
        .clr-segmented>label:hover{
          background-color: rgba(0,0,0,0.1);
          cursor: pointer;
        }
        #exportBtn{
          border-radius: 25px 0 0 25px;
        }
        #copyBtn{
          border-radius: 0 25px 25px 0;
          border-left: none !important;
        }
        html{
          height: 100%;
        }
        body{
          display: flex;
          height: 100%;
          color: black;
          align-items: center;
          flex-direction: row;
          justify-content: center;
        }
        .clr-picker{display:none;flex-wrap:wrap;position:absolute;width:200px;z-index:1000;border-radius:10px;background-color:#fff;justify-content:space-between;box-shadow:0 0 5px rgba(0,0,0,.05),0 5px 20px rgba(0,0,0,.1);-moz-user-select:none;-webkit-user-select:none;user-select:none}.clr-picker.clr-open,.clr-picker[data-inline=true]{display:flex}.clr-picker[data-inline=true]{position:relative}.clr-gradient{position:relative;width:100%;height:100px;margin-bottom:15px;border-radius:3px 3px 0 0;background-image:linear-gradient(rgba(0,0,0,0),#000),linear-gradient(90deg,#fff,currentColor);cursor:pointer}.clr-marker{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border:1px solid #fff;border-radius:50%;background-color:currentColor;cursor:pointer}.clr-picker input[type=range]::-webkit-slider-runnable-track{width:100%;height:8px}.clr-picker input[type=range]::-webkit-slider-thumb{width:8px;height:8px;-webkit-appearance:none}.clr-picker input[type=range]::-moz-range-track{width:100%;height:8px;border:0}.clr-picker input[type=range]::-moz-range-thumb{width:8px;height:8px;border:0}.clr-hue{background-image:linear-gradient(to right,red 0,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red 100%)}.clr-alpha,.clr-hue{position:relative;width:calc(100% - 40px);height:8px;margin:5px 20px;border-radius:4px}.clr-alpha span{display:block;height:100%;width:100%;border-radius:inherit;background-image:linear-gradient(90deg,rgba(0,0,0,0),currentColor)}.clr-alpha input,.clr-hue input{position:absolute;width:calc(100% + 16px);height:16px;left:-8px;top:-4px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.clr-alpha div,.clr-hue div{position:absolute;width:16px;height:16px;left:0;top:50%;margin-left:-8px;transform:translateY(-50%);border:2px solid #fff;border-radius:50%;background-color:currentColor;box-shadow:0 0 1px #888;pointer-events:none}.clr-alpha div:before{content:'';position:absolute;height:100%;width:100%;left:0;top:0;border-radius:50%;background-color:currentColor}.clr-format{display:none;order:1;width:calc(100% - 40px);margin:0 20px 20px}.clr-segmented{display:flex;position:relative;width:100%;margin:0;padding:0;border:1px solid #ddd;border-radius:15px;box-sizing:border-box;color:#999;font-size:12px}.clr-segmented input,.clr-segmented legend{position:absolute;width:100%;height:100%;margin:0;padding:0;border:0;left:0;top:0;opacity:0;pointer-events:none}.clr-segmented label{flex-grow:1;padding:4px 0;text-align:center;cursor:pointer}.clr-segmented label:first-of-type{border-radius:10px 0 0 10px}.clr-segmented label:last-of-type{border-radius:0 10px 10px 0}.clr-segmented input:checked+label{color:#fff;background-color:#666}.clr-swatches{order:2;width:calc(100% - 32px);margin:0 16px}.clr-swatches div{display:flex;flex-wrap:wrap;padding-bottom:12px;justify-content:center}.clr-swatches button{position:relative;width:20px;height:20px;margin:0 4px 6px 4px;border:0;border-radius:50%;color:inherit;text-indent:-1000px;white-space:nowrap;overflow:hidden;cursor:pointer}.clr-swatches button:after{content:'';display:block;position:absolute;width:100%;height:100%;left:0;top:0;border-radius:inherit;background-color:currentColor;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}input.clr-color{order:1;width:calc(100% - 80px);height:32px;margin:15px 20px 20px 0;padding:0 10px;border:1px solid #ddd;border-radius:16px;color:#444;background-color:#fff;font-family:sans-serif;font-size:14px;text-align:center;box-shadow:none}input.clr-color:focus{outline:0;border:1px solid #1e90ff}.clr-clear{display:none;order:2;height:24px;margin:0 20px 20px auto;padding:0 20px;border:0;border-radius:12px;color:#fff;background-color:#666;font-family:inherit;font-size:12px;font-weight:400;cursor:pointer}.clr-preview{position:relative;width:32px;height:32px;margin:15px 0 20px 20px;border:0;border-radius:50%;overflow:hidden;cursor:pointer}.clr-preview:after,.clr-preview:before{content:'';position:absolute;height:100%;width:100%;left:0;top:0;border:1px solid #fff;border-radius:50%}.clr-preview:after{border:0;background-color:currentColor;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.clr-alpha div,.clr-color,.clr-hue div,.clr-marker{box-sizing:border-box}.clr-field{display:inline-block;position:relative;color:transparent}.clr-field button{position:absolute;width:30px;height:100%;right:0;top:50%;transform:translateY(-50%);border:0;color:inherit;text-indent:-1000px;white-space:nowrap;overflow:hidden;pointer-events:none}.clr-field button:after{content:'';display:block;position:absolute;width:100%;height:100%;left:0;top:0;border-radius:inherit;background-color:currentColor;box-shadow:inset 0 0 1px rgba(0,0,0,.5)}.clr-alpha,.clr-alpha div,.clr-field button,.clr-preview:before,.clr-swatches button{background-image:repeating-linear-gradient(45deg,#aaa 25%,transparent 25%,transparent 75%,#aaa 75%,#aaa),repeating-linear-gradient(45deg,#aaa 25%,#fff 25%,#fff 75%,#aaa 75%,#aaa);background-position:0 0,4px 4px;background-size:8px 8px}.clr-marker:focus{outline:0}.clr-keyboard-nav .clr-alpha input:focus+div,.clr-keyboard-nav .clr-hue input:focus+div,.clr-keyboard-nav .clr-marker:focus,.clr-keyboard-nav .clr-segmented input:focus+label{outline:0;box-shadow:0 0 0 2px #1e90ff,0 0 2px 2px #fff}.clr-picker[data-alpha=false] .clr-alpha{display:none}.clr-picker[data-minimal=true]{padding-top:16px}.clr-picker[data-minimal=true] .clr-alpha,.clr-picker[data-minimal=true] .clr-color,.clr-picker[data-minimal=true] .clr-gradient,.clr-picker[data-minimal=true] .clr-hue,.clr-picker[data-minimal=true] .clr-preview{display:none}.clr-dark{background-color:#444}.clr-dark .clr-segmented{border-color:#777}.clr-dark .clr-swatches button:after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}.clr-dark input.clr-color{color:#fff;border-color:#777;background-color:#555}.clr-dark input.clr-color:focus{border-color:#1e90ff}.clr-dark .clr-preview:after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}.clr-dark .clr-alpha,.clr-dark .clr-alpha div,.clr-dark .clr-preview:before,.clr-dark .clr-swatches button{background-image:repeating-linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#888 75%,#888),repeating-linear-gradient(45deg,#888 25%,#444 25%,#444 75%,#888 75%,#888)}.clr-picker.clr-polaroid{border-radius:6px;box-shadow:0 0 5px rgba(0,0,0,.1),0 5px 30px rgba(0,0,0,.2)}.clr-picker.clr-polaroid:before{content:'';display:block;position:absolute;width:16px;height:10px;left:20px;top:-10px;border:solid transparent;border-width:0 8px 10px 8px;border-bottom-color:currentColor;box-sizing:border-box;color:#fff;filter:drop-shadow(0 -4px 3px rgba(0,0,0,.1));pointer-events:none}.clr-picker.clr-polaroid.clr-dark:before{color:#444}.clr-picker.clr-polaroid.clr-left:before{left:auto;right:20px}.clr-picker.clr-polaroid.clr-top:before{top:auto;bottom:-10px;transform:rotateZ(180deg)}.clr-polaroid .clr-gradient{width:calc(100% - 20px);height:120px;margin:10px;border-radius:3px}.clr-polaroid .clr-alpha,.clr-polaroid .clr-hue{width:calc(100% - 30px);height:10px;margin:6px 15px;border-radius:5px}.clr-polaroid .clr-alpha div,.clr-polaroid .clr-hue div{box-shadow:0 0 5px rgba(0,0,0,.2)}.clr-polaroid .clr-format{width:calc(100% - 20px);margin:0 10px 15px}.clr-polaroid .clr-swatches{width:calc(100% - 12px);margin:0 6px}.clr-polaroid .clr-swatches div{padding-bottom:10px}.clr-polaroid .clr-swatches button{width:22px;height:22px}.clr-polaroid input.clr-color{width:calc(100% - 60px);margin:10px 10px 15px 0}.clr-polaroid .clr-clear{margin:0 10px 15px auto}.clr-polaroid .clr-preview{margin:10px 0 15px 10px}.clr-picker.clr-large{width:275px}.clr-large .clr-gradient{height:150px}.clr-large .clr-swatches button{width:22px;height:22px}.clr-picker.clr-pill{width:380px;padding-left:180px;box-sizing:border-box}.clr-pill .clr-gradient{position:absolute;width:180px;height:100%;left:0;top:0;margin-bottom:0;border-radius:3px 0 0 3px}.clr-pill .clr-hue{margin-top:20px}
        </style>
       <link rel="stylesheet" href="coloris.min.css" />
       <script src="coloris.min.js"></script>
      <script>
      /*!
 * Copyright (c) 2021 Momo Bassit.
 * Licensed under the MIT License (MIT)
 * https://github.com/mdbassit/Coloris
 */
!function(u,p,s){var d,f,h,b,c,v,y,i,g,l,m,w,k,x,a,r=p.createElement("canvas").getContext("2d"),L={r:0,g:0,b:0,h:0,s:0,v:0,a:1},E={el:"[data-coloris]",parent:"body",theme:"default",themeMode:"light",wrap:!0,margin:2,format:"hex",formatToggle:!1,swatches:[],swatchesOnly:!1,alpha:!0,forceAlpha:!1,focusInput:!0,selectInput:!1,inline:!1,defaultColor:"#000000",clearButton:!1,clearLabel:"Clear",a11y:{open:"Open color picker",close:"Close color picker",marker:"Saturation: {s}. Brightness: {v}.",hueSlider:"Hue slider",alphaSlider:"Opacity slider",input:"Color value field",format:"Color format",swatch:"Color swatch",instruction:"Saturation and brightness selector. Use up, down, left and right arrow keys to select."}},n={},o="",S={},A=!1;function T(e){if("object"==typeof e)for(var t in e)switch(t){case"el":H(e.el),!1!==e.wrap&&N(e.el);break;case"parent":(d=p.querySelector(e.parent))&&(d.appendChild(f),E.parent=e.parent,d===p.body&&(d=null));break;case"themeMode":E.themeMode=e.themeMode,"auto"===e.themeMode&&u.matchMedia&&u.matchMedia("(prefers-color-scheme: dark)").matches&&(E.themeMode="dark");case"theme":e.theme&&(E.theme=e.theme),f.className="clr-picker clr-"+E.theme+" clr-"+E.themeMode,E.inline&&O();break;case"margin":e.margin*=1,E.margin=(isNaN(e.margin)?E:e).margin;break;case"wrap":e.el&&e.wrap&&N(e.el);break;case"formatToggle":E.formatToggle=!!e.formatToggle,X("clr-format").style.display=E.formatToggle?"block":"none",E.formatToggle&&(E.format="auto");break;case"swatches":Array.isArray(e.swatches)&&function(){var a=[];e.swatches.forEach(function(e,t){a.push('<button type="button" id="clr-swatch-'+t+'" aria-labelledby="clr-swatch-label clr-swatch-'+t+'" style="color: '+e+';">'+e+"</button>")}),X("clr-swatches").innerHTML=a.length?"<div>"+a.join("")+"</div>":"",E.swatches=e.swatches.slice()}();break;case"swatchesOnly":E.swatchesOnly=!!e.swatchesOnly,f.setAttribute("data-minimal",E.swatchesOnly);break;case"alpha":E.alpha=!!e.alpha,f.setAttribute("data-alpha",E.alpha);break;case"inline":E.inline=!!e.inline,f.setAttribute("data-inline",E.inline),E.inline&&(l=e.defaultColor||E.defaultColor,x=D(l),O(),j(l));break;case"clearButton":"object"==typeof e.clearButton&&(e.clearButton.label&&(E.clearLabel=e.clearButton.label,i.innerHTML=E.clearLabel),e.clearButton=e.clearButton.show),E.clearButton=!!e.clearButton,i.style.display=E.clearButton?"block":"none";break;case"clearLabel":E.clearLabel=e.clearLabel,i.innerHTML=E.clearLabel;break;case"a11y":var a,l,r=e.a11y,n=!1;if("object"==typeof r)for(var o in r)r[o]&&E.a11y[o]&&(E.a11y[o]=r[o],n=!0);n&&(a=X("clr-open-label"),l=X("clr-swatch-label"),a.innerHTML=E.a11y.open,l.innerHTML=E.a11y.swatch,v.setAttribute("aria-label",E.a11y.close),g.setAttribute("aria-label",E.a11y.hueSlider),m.setAttribute("aria-label",E.a11y.alphaSlider),y.setAttribute("aria-label",E.a11y.input),h.setAttribute("aria-label",E.a11y.instruction));default:E[t]=e[t]}}function C(e,t){"string"==typeof e&&"object"==typeof t&&(n[e]=t,A=!0)}function M(e){delete n[e],0===Object.keys(n).length&&(A=!1,e===o&&B())}function t(l){if(A){var e,r=["el","wrap","inline","defaultColor","a11y"];for(e in n)if("break"===function(e){var t=n[e];if(l.matches(e)){for(var a in o=e,S={},r.forEach(function(e){return delete t[e]}),t)S[a]=Array.isArray(E[a])?E[a].slice():E[a];return T(t),"break"}}(e))break}}function B(){0<Object.keys(S).length&&(T(S),o="",S={})}function H(e){U(p,"click",e,function(e){E.inline||(t(e.target),k=e.target,a=k.value,x=D(a),f.classList.add("clr-open"),O(),j(a),(E.focusInput||E.selectInput)&&y.focus({preventScroll:!0}),E.selectInput&&y.select(),k.dispatchEvent(new Event("open",{bubbles:!0})))}),U(p,"input",e,function(e){var t=e.target.parentNode;t.classList.contains("clr-field")&&(t.style.color=e.target.value)})}function O(){var e,t,a,l,r=d,n=u.scrollY,o=f.offsetWidth,i=f.offsetHeight,c={left:!1,top:!1},s={x:0,y:0};r&&(a=u.getComputedStyle(r),e=parseFloat(a.marginTop),l=parseFloat(a.borderTopWidth),(s=r.getBoundingClientRect()).y+=l+n),E.inline||(a=(t=k.getBoundingClientRect()).x,l=n+t.y+t.height+E.margin,r?(a-=s.x,l-=s.y,a+o>r.clientWidth&&(a+=t.width-o,c.left=!0),l+i>r.clientHeight-e&&i+E.margin<=t.top-(s.y-n)&&(l-=t.height+i+2*E.margin,c.top=!0),l+=r.scrollTop):(a+o>p.documentElement.clientWidth&&(a+=t.width-o,c.left=!0),l+i-n>p.documentElement.clientHeight&&i+E.margin<=t.top&&(l=n+t.y-i-E.margin,c.top=!0)),f.classList.toggle("clr-left",c.left),f.classList.toggle("clr-top",c.top),f.style.left=a+"px",f.style.top=l+"px"),b={width:h.offsetWidth,height:h.offsetHeight,x:f.offsetLeft+h.offsetLeft+s.x,y:f.offsetTop+h.offsetTop+s.y}}function N(e){p.querySelectorAll(e).forEach(function(e){var t,a=e.parentNode;a.classList.contains("clr-field")||((t=p.createElement("div")).innerHTML='<button type="button" aria-labelledby="clr-open-label"></button>',a.insertBefore(t,e),t.setAttribute("class","clr-field"),t.style.color=e.value,t.appendChild(e))})}function I(e){var t;k&&!E.inline&&(t=k,e&&(k=null,a!==t.value&&(t.value=a,t.dispatchEvent(new Event("input",{bubbles:!0})))),setTimeout(function(){a!==t.value&&t.dispatchEvent(new Event("change",{bubbles:!0}))}),f.classList.remove("clr-open"),A&&B(),t.dispatchEvent(new Event("close",{bubbles:!0})),E.focusInput&&t.focus({preventScroll:!0}),k=null)}function j(e){var t=function(e){var t;r.fillStyle="#000",r.fillStyle=e,(e=/^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i.exec(r.fillStyle))?(t={r:+e[3],g:+e[4],b:+e[5],a:+e[6]}).a=+t.a.toFixed(2):(e=r.fillStyle.replace("#","").match(/.{2}/g).map(function(e){return parseInt(e,16)}),t={r:e[0],g:e[1],b:e[2],a:1});return t}(e),e=function(e){var t=e.r/255,a=e.g/255,l=e.b/255,r=s.max(t,a,l),n=s.min(t,a,l),o=r-n,i=r,c=0,n=0;o&&(r===t&&(c=(a-l)/o),r===a&&(c=2+(l-t)/o),r===l&&(c=4+(t-a)/o),r&&(n=o/r));return{h:(c=s.floor(60*c))<0?c+360:c,s:s.round(100*n),v:s.round(100*i),a:e.a}}(t);R(e.s,e.v),q(t,e),g.value=e.h,f.style.color="hsl("+e.h+", 100%, 50%)",l.style.left=e.h/360*100+"%",c.style.left=b.width*e.s/100+"px",c.style.top=b.height-b.height*e.v/100+"px",m.value=100*e.a,w.style.left=100*e.a+"%"}function D(e){e=e.substring(0,3).toLowerCase();return"rgb"===e||"hsl"===e?e:"hex"}function F(e){e=void 0!==e?e:y.value,k&&(k.value=e,k.dispatchEvent(new Event("input",{bubbles:!0}))),p.dispatchEvent(new CustomEvent("coloris:pick",{detail:{color:e}}))}function W(e,t){e={h:+g.value,s:e/b.width*100,v:100-t/b.height*100,a:m.value/100},t=function(e){var t=e.s/100,a=e.v/100,l=t*a,r=e.h/60,n=l*(1-s.abs(r%2-1)),o=a-l;l+=o,n+=o;t=s.floor(r)%6,a=[l,n,o,o,n,l][t],r=[n,l,l,n,o,o][t],t=[o,o,n,l,l,n][t];return{r:s.round(255*a),g:s.round(255*r),b:s.round(255*t),a:e.a}}(e);R(e.s,e.v),q(t,e),F()}function R(e,t){var a=E.a11y.marker;e=+e.toFixed(1),t=+t.toFixed(1),a=(a=a.replace("{s}",e)).replace("{v}",t),c.setAttribute("aria-label",a)}function Y(e){var t={pageX:((a=e).changedTouches?a.changedTouches[0]:a).pageX,pageY:(a.changedTouches?a.changedTouches[0]:a).pageY},a=t.pageX-b.x,t=t.pageY-b.y;d&&(t+=d.scrollTop),a=a<0?0:a>b.width?b.width:a,t=t<0?0:t>b.height?b.height:t,c.style.left=a+"px",c.style.top=t+"px",W(a,t),e.preventDefault(),e.stopPropagation()}function q(e,t){void 0===t&&(t={});var a,l,r=E.format;for(a in e=void 0===e?{}:e)L[a]=e[a];for(l in t)L[l]=t[l];var n,o=function(e){var t=e.r.toString(16),a=e.g.toString(16),l=e.b.toString(16),r="";e.r<16&&(t="0"+t);e.g<16&&(a="0"+a);e.b<16&&(l="0"+l);E.alpha&&(e.a<1||E.forceAlpha)&&(e=255*e.a|0,r=e.toString(16),e<16&&(r="0"+r));return"#"+t+a+l+r}(L),i=o.substring(0,7);switch(c.style.color=i,w.parentNode.style.color=i,w.style.color=o,v.style.color=o,h.style.display="none",h.offsetHeight,h.style.display="",w.nextElementSibling.style.display="none",w.nextElementSibling.offsetHeight,w.nextElementSibling.style.display="","mixed"===r?r=1===L.a?"hex":"rgb":"auto"===r&&(r=x),r){case"hex":y.value='Color3.fromHex("'+o+'")';break;case"rgb":y.value=(n=L,!E.alpha||1===n.a&&!E.forceAlpha?"Color3.fromRGB("+n.r+", "+n.g+", "+n.b+")":"rgba("+n.r+", "+n.g+", "+n.b+", "+n.a+")");break;case"hsl":y.value=(n=function(e){var t,a=e.v/100,l=a*(1-e.s/100/2);0<l&&l<1&&(t=s.round((a-l)/s.min(l,1-l)*100));return{h:e.h,s:t||0,l:s.round(100*l),a:e.a}}(L),!E.alpha||1===n.a&&!E.forceAlpha?"Color3.fromHSV("+Math.round((n.h/360 + Number.EPSILON) * 100) / 100+", "+n.s/100+", "+n.l/100+")":"hsla("+n.h+", "+n.s+"%, "+n.l+"%, "+n.a+")")}p.querySelector('.clr-format [value="'+r+'"]').checked=!0}function e(){var e=+g.value,t=+c.style.left.replace("px",""),a=+c.style.top.replace("px","");f.style.color="hsl("+e+", 100%, 50%)",l.style.left=e/360*100+"%",W(t,a)}function P(){var e=m.value/100;w.style.left=100*e+"%",q({a:e}),F()}function X(e){return p.getElementById(e)}function U(e,t,a,l){var r=Element.prototype.matches||Element.prototype.msMatchesSelector;"string"==typeof a?e.addEventListener(t,function(e){r.call(e.target,a)&&l.call(e.target,e)}):(l=a,e.addEventListener(t,l))}function G(e,t){t=void 0!==t?t:[],"loading"!==p.readyState?e.apply(void 0,t):p.addEventListener("DOMContentLoaded",function(){e.apply(void 0,t)})}void 0!==NodeList&&NodeList.prototype&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),u.Coloris=function(){var r={set:T,wrap:N,close:I,setInstance:C,removeInstance:M,updatePosition:O};function e(e){G(function(){e&&("string"==typeof e?H:T)(e)})}for(var t in r)!function(l){e[l]=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];G(r[l],t)}}(t);return e}(),G(function(){d=null,(f=p.createElement("div")).setAttribute("id","clr-picker"),f.className="clr-picker",f.innerHTML='<input id="clr-color-value" class="clr-color" type="text" value="" spellcheck="false" aria-label="'+E.a11y.input+'"><div id="clr-color-area" class="clr-gradient" role="application" aria-label="'+E.a11y.instruction+'"><div id="clr-color-marker" class="clr-marker" tabindex="0"></div></div><div class="clr-hue"><input id="clr-hue-slider" type="range" min="0" max="360" step="1" aria-label="'+E.a11y.hueSlider+'"><div id="clr-hue-marker"></div></div><div class="clr-alpha"><input id="clr-alpha-slider" type="range" min="0" max="100" step="1" aria-label="'+E.a11y.alphaSlider+'"><div id="clr-alpha-marker"></div><span></span></div><div id="clr-format" class="clr-format"><fieldset class="clr-segmented"><legend>'+E.a11y.format+'</legend><input id="clr-f1" type="radio" name="clr-format" value="hex"><label for="clr-f1">Hex</label><input id="clr-f2" type="radio" name="clr-format" value="rgb"><label for="clr-f2">RGB</label><input id="clr-f3" type="radio" name="clr-format" value="hsl"><label for="clr-f3">HSV</label><span></span></fieldset></div><div id="clr-swatches" class="clr-swatches"></div><button type="button" id="clr-clear" class="clr-clear">'+E.clearLabel+'</button><button type="button" id="clr-color-preview" class="clr-preview" aria-label="'+E.a11y.close+'"></button><span id="clr-open-label" hidden>'+E.a11y.open+'</span><span id="clr-swatch-label" hidden>'+E.a11y.swatch+"</span>",p.body.appendChild(f),h=X("clr-color-area"),c=X("clr-color-marker"),i=X("clr-clear"),v=X("clr-color-preview"),y=X("clr-color-value"),g=X("clr-hue-slider"),l=X("clr-hue-marker"),m=X("clr-alpha-slider"),w=X("clr-alpha-marker"),H(E.el),N(E.el),U(f,"mousedown",function(e){f.classList.remove("clr-keyboard-nav"),e.stopPropagation()}),U(h,"mousedown",function(e){U(p,"mousemove",Y)}),U(h,"touchstart",function(e){p.addEventListener("touchmove",Y,{passive:!1})}),U(c,"mousedown",function(e){U(p,"mousemove",Y)}),U(c,"touchstart",function(e){p.addEventListener("touchmove",Y,{passive:!1})}),U(y,"change",function(e){(k||E.inline)&&(j(y.value),F())}),U(i,"click",function(e){F(""),I()}),U(v,"click",function(e){F(),I()}),U(p,"click",".clr-format input",function(e){x=e.target.value,q(),F()}),U(f,"click",".clr-swatches button",function(e){j(e.target.textContent),F(),E.swatchesOnly&&I()}),U(p,"mouseup",function(e){p.removeEventListener("mousemove",Y)}),U(p,"touchend",function(e){p.removeEventListener("touchmove",Y)}),U(p,"mousedown",function(e){f.classList.remove("clr-keyboard-nav"),I()}),U(p,"keydown",function(e){"Escape"===e.key?I(!0):"Tab"===e.key&&f.classList.add("clr-keyboard-nav")}),U(p,"click",".clr-field button",function(e){A&&B(),e.target.nextElementSibling.dispatchEvent(new Event("click",{bubbles:!0}))}),U(c,"keydown",function(e){var t={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};-1!==Object.keys(t).indexOf(e.key)&&(!function(e,t){e=+c.style.left.replace("px","")+e,t=+c.style.top.replace("px","")+t,c.style.left=e+"px",c.style.top=t+"px",W(e,t)}.apply(void 0,t[e.key]),e.preventDefault())}),U(h,"click",Y),U(g,"input",e),U(m,"input",P)})}(window,document,Math);    
</script>
      <script>
        Coloris({
          inline: true,
          format: "auto",
          formatToggle: true,
          theme: '',
          themeMode: 'auto'
        });
  
        try {
          vscode = acquireVsCodeApi();
        } catch (e) {
          vscode = undefined;
        }
        var color = undefined;
  
        function exportColor(){
          exportValue(color);
        }
        function copyColor(){
          copyValue(color);
        }
        
  
        document.addEventListener("DOMContentLoaded", function () {
          let exportElement = document.createElement("div");
          exportElement.id = "export";
          exportElement.innerHTML = '<button id="exportBtn" onclick="exportColor()"><span class="material-symbols-outlined">ios_share</button><button id="copyBtn" onclick="copyColor()"><span class="material-symbols-outlined">content_copy</span></button>';
          document.getElementById("clr-picker").append(exportElement);
        });
  
        document.addEventListener("coloris:pick", (event) => {
          color = event.detail.color;
        });
  
        function exportValue(val) {
          vscode.postMessage({
            command: "export",
            text: val,
          });
        }
        
        function copyValue(val) {
          vscode.postMessage({
            command: "copy",
            text: val,
          });
        }
      </script>
    </head>
    <body>
      <input type="text" data-coloris />
    </body>
  </html>`;

  /*let text = readFileSync(htmlPath.fsPath, 'utf8');
  
  scripts.forEach((script) => {
    text = text.replace(script.name, String(script.path));
  });*/

  console.log(text);
  return text;
}
