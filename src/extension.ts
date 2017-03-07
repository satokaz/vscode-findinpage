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

const execPath: string = process.execPath;
const pathname: string[] = path.dirname(execPath).split(path.sep);

//
//  Get the directory path where the webview-pre.js file
//
const webviewPreJsPath: string = (process.platform === 'win32')
			? path.join(path.parse(execPath).root, pathname[1], pathname[2], '\\resources\\app\\out\\vs\\workbench\\parts\\html\\browser')
			: path.join(path.parse(execPath).root, pathname[0], pathname[1], pathname[2], pathname[3], '/Resources/app/out/vs/workbench/parts/html/browser');
			// console.log("webviewPreJsPath =", webviewPreJsPath );

const fileWebviewPreJs: string = path.join(webviewPreJsPath, 'webview-pre.js');
const mediaPath: string = path.join(vscode.extensions.getExtension("satokaz.vscode-findinpage").extensionPath, 'media');

//
// This is optional.
// If the autoinstall setting is true, Check the existence of webview-pre.js.orig.
// If it does not exist, forcibly install webview-pre_previewtools.js.
//
if(vscode.workspace.getConfiguration('previewtools')['autoinstall'] === true) {
	console.info("vscode-findinpage: autoinstall === true");
	if (!statPath(fileWebviewPreJs + '.orig')) {
		console.info(webviewPreJsPath + '.orig is not exist');
		mediaInstall(mediaPath);
	}
}

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-findinpage" is now active!');

    let disposable = vscode.commands.registerCommand('extension.findinpage', () => {
		// const mediaPath = context.asAbsolutePath(path.join('media'));

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

	// console.log('mediaPath =', mediaPath);
	let fileWebviewPreJs = path.join(webviewPreJsPath, 'webview-pre.js');
	let fileBeing: string;

	if (!statPath(fileWebviewPreJs + '.orig')) {
		// console.log('file/dir not found: ' + webviewPreJsPath + '.orig');
		fileBeing = "Disabled";
	} else {
		// console.log('file/dir exists: ' + webviewPreJsPath + '.orig');
		fileBeing = "Enabled";
	}
	vscode.window.showInformationMessage<MyMessageItem>(
		localize('toggle', 'Would you like to Enable the Preview Tools in the Preview Editor? (Currently {0})', fileBeing),
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
					mediaInstall(mediaPath);
					vscode.window.showInformationMessage('Install to Preview Tools in Preview Editor has been completed');
				}
				break;
			case 2:
				// console.log("case 2");
				if (fileBeing === "Enabled"){
					// console.log(webviewPreJsPath + '.orig is  exists.');
					fs.writeFileSync(fileWebviewPreJs, fs.readFileSync(fileWebviewPreJs + '.orig', "utf-8"), 'utf-8');
					fs.unlinkSync(fileWebviewPreJs + '.orig');
					fse.removeSync(path.join(webviewPreJsPath, 'extra'));
					vscode.window.showInformationMessage('Uninstall is complete.');
					break;
				} else {
					vscode.window.showInformationMessage('No Preview Tools in Preview Editor has been installed.');
				}
		}
	});
	return ;
}

function statPath(path: string) {
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return void 0;
}

function mediaInstall(mediaPath: string) {
	let array = fs.readFileSync(fileWebviewPreJs, 'utf-8').toString();

		fse.ensureDir(path.join(webviewPreJsPath, 'extra'), function (err: any) {
			if (err) {
				console.error(err);
			} else {
				fse.copySync(path.join(mediaPath, 'extra'), path.join(webviewPreJsPath, 'extra'));
			}
		});
		fs.writeFileSync(fileWebviewPreJs + '.orig', array, 'utf-8');

		let overWriteChar = JSON.stringify(array.match(/..contentDocument.write\("<!DOCTYPE html>"\)/g)).substr(2,1);
		// console.log('d =',overWriteChar);

    const matchResult =
						array.replace(/..contentDocument.write\("\<!DOCTYPE\ html>"\)/g,`${overWriteChar}.contentDocument.write("<!DOCTYPE html>"),${overWriteChar}.contentDocument.write('<body><script type="text/javascript" id="cool_find_script" src="extra/find6.js"></script>'),${overWriteChar}.contentDocument.write('<script type="text/javascript" id="cool_textchanger_script" src="extra/textchanger.js"></script></body>')`);


	fs.writeFileSync(fileWebviewPreJs, matchResult, 'utf-8');
	console.log("webview-pre_previewtools.js installed.");
}