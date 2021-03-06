# Preview Tools for Preview Editor README

## To those who use this Extension (2017/08/11)
> <h2><font color='red'>Search function was implemented in Markdown preview in Visual Studio Code 1.15!</font></h2>
>This extension became obsolete
>
> See: [Visual Studio Code July 2017 - Search in Markdown preview](https://code.visualstudio.com/updates/v1_15#_search-in-markdown-preview)
>   
> **This extension will continue to provide only the preview zoom function.**
>  
> Thank you for installing!

## Attention to use Extension

> Please be relieved, the Extension will backup and replace.  
> **This extension replaces the files included in vscode distribution** and **Please install every time vscode is updated.**

> **For windows only**: In order to execute `Install` or `UnInstall`, You only have to activate **vscode with administrator privileges** once.

> **For Linux only**: To run `Install` or `UnInstall`, launch code as the root user and install and run the extension.


## Features

Add a bit two functions to the `Preview Editor` such as Markdown etc...

* Zoom font in Preview Editor with combination keyword.

### Zoom font in Preview Editor with combination key.

Font zooming possible only for Preview Editor.

| Function | Key combination                                                       |
| -------- | --------------------------------------------------------------------- |
|          |                                                                       |
| Zoom In  | Hold down `Alt` and Press `=`      |
| Zoom Out | Hold down `Alt` and Press `-`      |
| Reset    | Hold down `Alt` and Press `delete` |

<br>

![](https://raw.githubusercontent.com/satokaz/vscode-findinpage/images/fontzoom_LICEcap.gif)

> If you click `A+`, the toolbar will be displayed. but please disregard it.


## Installation

Launch VS Code Quick Open (Ctrl+P), paste the following command, and type enter.

```
ext install vscode-findinpage
```

## Usage

`Toggle Preview Tools in Preview Editor` command

* **Install**: Enable the Preview Tools and Replace the file.
* **UnInstall**: Disable the Preview Tools and Restore the original file.

> **For windows only**: In order to execute `Install` or `UnInstall`, You only have to activate **vscode with administrator privileges** once.

```
Error: EPERM: operation not permitted, open 'C:\Program Files (x86)\Microsoft VS Code\resources\app\out\vs\workbench\parts\html\browser\webview-pre.js'
```

### Install

Search `preview tools` from the command palette and execute `Toggle Preview Tools in Preview Editor`

![](https://raw.githubusercontent.com/satokaz/vscode-findinpage/images/スクリーンショット%202017-01-22%2015.15.29.png)

Please click `Install`.

![](https://raw.githubusercontent.com/satokaz/vscode-findinpage/images/スクリーンショット%202017-01-22%2015.16.16.png)

Done.

![](https://raw.githubusercontent.com/satokaz/vscode-findinpage/images/スクリーンショット%202017-01-22%2015.16.37.png)

Open Preview Editor (Markdown Preview or HELP | Release Notes ... ) and check that the icon below is displayed in the lower right.

![](https://raw.githubusercontent.com/satokaz/vscode-findinpage/images/スクリーンショット%202017-01-22%2015.17.16.png)


### Install - Linux 

The vscode installed from rpm or the repository is placed in `/usr/share/code`.
Write permission is given only to the root user.

Please install and run the extension as the root user.

```
$ sudo code (or code-insiders) --user-data-dir=/tmp
```

It will be installed in `/usr/share/code/resources/app/out/vs/workbench/parts/html/browser`.

### How to update

- Install new version of extension
- Please execute `Uninstall`
- Please execute `Install` again

## How is it implemented?

changed webview-pre.js to use textchanger.js.

* <https://github.com/Microsoft/vscode/blob/master/src/vs/workbench/parts/html/browser/webview-pre.js>

It is the function of the extension to replace this file.

About the details of "Cool Text Size Changer Javascript":
* [Cool Text Size Changer Javascript](http://www.seabreezecomputers.com/tips/textchanger.htm)

Thanks to the author of "Cool Text Size Changer Javascript".


<!--## Extension Settings


```css
#cool_find_msg{
	color: black;
}
```-->

## Known Issues

* **Please Install every time vscode is updated.**
* <S>I expect the vscode team's native implementation...(See, [Find is not available in Markdown Preview mode #2187](https://github.com/Microsoft/vscode/issues/2187)</S>

## Change Log

* [Change Log](https://marketplace.visualstudio.com/items/satokaz.vscode-findinpage/changelog)

## License

This extension is licensed under the MIT License.

**Enjoy!**