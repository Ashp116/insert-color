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
      'pickColor',
      'Pick Color',
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

    const htmlDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'color-picker.html'));
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
    ];

    panel.webview.html = getWebviewContent(htmlPath, stylePath, SCRIPTS);

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



function getWebviewContent(htmlPath: vscode.Uri, stylePath: vscode.Uri, scripts: any[]): string {
  let text = readFileSync(htmlPath.fsPath, 'utf8');
  
  scripts.forEach((script) => {
    text = text.replace(script.name, String(script.path));
  });

  return text;
}
