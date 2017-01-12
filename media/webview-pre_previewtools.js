/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

function styleBody(e) {
    e && (e.classList.remove("vscode-light", "vscode-dark", "vscode-high-contrast"), e.classList.add(initData.activeTheme))
}

function getTarget() {
    return document.getElementById("_target")
}
var initData = {};
const ipcRenderer = require("electron").ipcRenderer;
document.addEventListener("DOMContentLoaded", function (e) {
    ipcRenderer.on("baseUrl", function (e, t) {
        initData.baseUrl = t
    }), ipcRenderer.on("styles", function (e, t, n) {
        initData.styles = t, initData.activeTheme = n;
        var o = document.getElementById("_defaultStyles");
        o.innerHTML = initData.styles;
        var a = getTarget().contentDocument.getElementsByTagName("body");
        styleBody(a[0]), o = getTarget().contentDocument.getElementById("_defaultStyles"), o && (o.innerHTML = initData.styles)
    }), ipcRenderer.on("focus", function () {
        getTarget().contentWindow.focus()
    }), ipcRenderer.on("content", function (e, t) {
        const n = t.join("\n"),
            o = (new DOMParser).parseFromString(n, "text/html"),
            a = {
                scriptTags: o.documentElement.querySelectorAll("script").length,
                inputTags: o.documentElement.querySelectorAll("input").length,
                styleTags: o.documentElement.querySelectorAll("style").length,
                linkStyleSheetTags: o.documentElement.querySelectorAll("link[rel=stylesheet]").length,
                stringLen: n.length
            };
        if (initData.baseUrl && 0 === o.head.getElementsByTagName("base").length) {
            const r = document.createElement("base");
            r.href = initData.baseUrl, o.head.appendChild(r)
        }
        const l = o.createElement("style");
        l.id = "_defaultStyles", l.innerHTML = initData.styles, o.head.hasChildNodes() ? o.head.insertBefore(l, o.head.firstChild) : o.head.appendChild(l);
        const d = o.createElement("script");
        d.innerHTML = ['document.body.addEventListener("click", function(event) {', "\tlet node = event.target;", "\twhile (node) {", '\t\tif (node.tagName === "A" && node.href) {', '\t\t\tlet baseElement = window.document.getElementsByTagName("base")[0];', "\t\t\tif (baseElement && node.href.indexOf(baseElement.href) >= 0 && node.hash) {", "\t\t\t\tlet scrollTarget = window.document.getElementById(node.hash.substr(1, node.hash.length - 1));", "\t\t\t\tif (scrollTarget) {", "\t\t\t\t\tscrollTarget.scrollIntoView();", "\t\t\t\t}", "\t\t\t} else {", '\t\t\t\twindow.parent.postMessage({ command: "did-click-link", data: node.href }, "file://");', "\t\t\t}", "\t\t\tevent.preventDefault();", "\t\t\tbreak;", "\t\t}", "\t\tnode = node.parentNode;", "\t}", "});"].join("\n"), o.body.appendChild(d), styleBody(o.body);
        const s = getTarget().contentDocument.body.scrollTop;
        getTarget().contentDocument.open("text/html", "replace"), getTarget().contentDocument.write("<!DOCTYPE html>"), 
        getTarget().contentDocument.write(`<body><script type="text/javascript" id="cool_find_script" src="extra/find6.js"></script>`),
        getTarget().contentDocument.write(`<body><script type="text/javascript" id="cool_textchanger_script" src="extra/textchanger.js"></script></body>`),
        getTarget().contentDocument.write(o.documentElement.innerHTML), getTarget().contentDocument.close(), setTimeout(function () {
            s !== getTarget().contentDocument.body.scrollTop && (getTarget().contentDocument.body.scrollTop = s)
        }, 0), ipcRenderer.sendToHost("did-set-content", a)
    }), window.onmessage = function (e) {
        ipcRenderer.sendToHost(e.data.command, e.data.data)
    }, ipcRenderer.sendToHost("webview-ready", process.pid)
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d384271ffb5655cee1ddf8f93f51cd892ee2cc40/core/vs/workbench/parts/html/browser/webview-pre.js.map