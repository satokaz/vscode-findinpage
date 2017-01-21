'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as nls from 'vscode-nls';

var fse = require('fs-extra');

// var localize = nls.loadMessageBundle(__filename);
let localize = nls.loadMessageBundle();
nls.config(process.env['VSCODE_NLS_CONFIG']);

interface MyMessageItem extends vscode.MessageItem {
	id: number;
}

var execPath = process.execPath;
var pathname = path.dirname(execPath).split(path.sep);
if (process.platform == 'win32') {
	var webviewPreJsPath = path.join(path.parse(execPath).root, pathname[1], pathname[2], '\\resources\\app\\out\\vs\\workbench\\parts\\html\\browser');
} else {
	var webviewPreJsPath = path.join(path.parse(execPath).root, pathname[0], pathname[1], pathname[2], pathname[3], '/Resources/app/out/vs/workbench/parts/html/browser');
}


export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-findinpage" is now active!');

    let disposable = vscode.commands.registerCommand('extension.findinpage', () => {

		const mediaPath = context.asAbsolutePath(path.join('media'));
		
		// debug
		// const webviewPreJs = context.asAbsolutePath(path.join('media', 'webview-pre_previewtools.js'));;
		// const find6Js = context.asAbsolutePath(path.join('media', 'find6.js'));;
		// const textchangerJs = context.asAbsolutePath(path.join('media', 'textchanger.js'));;
		// console.log('webviewPreJs =', context.asAbsolutePath(path.join('media', 'webview-pre_previewtools.js')));
		// console.log('find6Js =', context.asAbsolutePath(path.join('media', 'find6.js')));
		// console.log('textchangerJs =', context.asAbsolutePath(path.join('media', 'textchanger.js')));
		// console.log(path.join(webviewPreJsPath, 'webview-pre.js' + '.orig'));
		// End of debug

		webviewPreJsToggle(mediaPath);
	});

    context.subscriptions.push(disposable);
}


function webviewPreJsToggle(mediaPath: string) {

	console.log('mediaPath =', mediaPath);

	let fileWebviewPreJs = path.join(webviewPreJsPath, 'webview-pre.js');

	let fileBeing: string;
	 if(!statPath(fileWebviewPreJs + '.orig')) {
		// console.log('file/dir not found: ' + webviewPreJsPath + '.orig');
		fileBeing = "Disabled";
	} else {
		// console.log('file/dir exists: ' + webviewPreJsPath + '.orig');
		fileBeing = "Enabled"; 
	}
	vscode.window.showInformationMessage<MyMessageItem>(
		localize('toggle', 'Would you like to Enable the "Find in page" in the preview editor? (Currently {0})', fileBeing),
			{
				title: localize('install', 'Install'),
				id: 1
			},
			{
				title: localize('uninstall', 'UnInstall'),
				id: 2
			},
			{
				title: localize('close', 'Close'),
				id: 3,
				isCloseAffordance: true
			}
	).then((selected) => {
		// console.log(selected);
		if (!selected || selected.id === 3) {
			// console.log("case 3");
			return;
		}
		switch (selected.id) {
			case 1:
				// console.log("case 1");
				if (fileBeing === "Enabled"){
					vscode.window.showInformationMessage('Please with peace of mind. It has already been installed.');
					break;
				} else {
					// fs-extra
					fse.ensureDir(path.join(webviewPreJsPath, 'extra'), function (err: any) {
						if (err) {
							console.error(err);
						} else {
							fse.copySync(path.join(mediaPath, 'extra'), path.join(webviewPreJsPath, 'extra'));
							console.log("success!");
						}
					});
					// console.log(webviewPreJsPath + '.orig is not exist');
					fs.writeFileSync(fileWebviewPreJs + '.orig', fs.readFileSync(fileWebviewPreJs, "utf-8"), 'utf8');
					fs.writeFileSync(fileWebviewPreJs, fs.readFileSync(path.join(mediaPath, 'webview-pre_previewtools.js'),"utf-8"), 'utf8');
					vscode.window.showInformationMessage('Install to "Find in Page" in Preview Editor has been completed');
				}
				break;
			case 2:
				// console.log("case 2");
				if (fileBeing === "Enabled"){
					// console.log(webviewPreJsPath + '.orig is  exists.');
					fs.writeFileSync(fileWebviewPreJs, fs.readFileSync(fileWebviewPreJs + '.orig', "utf-8"), 'utf8');
					fs.unlinkSync(fileWebviewPreJs + '.orig');
					fse.removeSync(path.join(webviewPreJsPath, 'extra'));
					vscode.window.showInformationMessage('Uninstall is complete.');
					break;
				} else {
					vscode.window.showInformationMessage('No "Find in Page" in Preview Editor has been installed.');
				}
		}
	});
	return ;
}

function statPath(path: string) {
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return false;
}
