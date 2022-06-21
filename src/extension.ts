import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as uuid from "uuid";

let statusItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);
statusItem.command = "diff-panel.newPanel";
statusItem.text = "Diff Panel";
statusItem.show();

const createDiffFiles = async (context: vscode.ExtensionContext) => {
  const leftDiffFileUri = `${context.globalStorageUri.path}/${uuid
    .v4()
    .slice(-10)}`;
  const rightDiffFileUri = `${context.globalStorageUri.path}/${uuid
    .v4()
    .slice(-10)}`;

  fs.writeFileSync(leftDiffFileUri, "");
  fs.writeFileSync(rightDiffFileUri, "");

  return [leftDiffFileUri, rightDiffFileUri];
};

export async function activate(context: vscode.ExtensionContext) {
  let extStoragePath = context.globalStorageUri.path;
  let tempDirPath = `${extStoragePath}/temp`;
  let isExtFile = (path: string) => path.startsWith(extStoragePath);

  await fs.ensureDir(tempDirPath);
  fs.emptyDir(tempDirPath);

  vscode.workspace.onDidChangeTextDocument(async (event) => {
    const { document, contentChanges } = event;
    if (!isExtFile(document.uri.path) || contentChanges.length === 0) {
      return;
    }

    const languageId = document.languageId;
    if (languageId === "plaintext") {
      try {
        JSON.parse(document.getText());
        await vscode.languages.setTextDocumentLanguage(document, "jsonc");
      } catch (e) {}
    }
    if (document.languageId !== "plaintext") {
      await vscode.commands.executeCommand(
        "editor.action.formatDocument",
        document.uri.path
      );
    }
  });

  let disposable = vscode.commands.registerCommand(
    "diff-panel.newPanel",
    async () => {
      const [leftDiffFileUri, rightDiffFileUri] = await createDiffFiles(
        context
      );
      vscode.commands.executeCommand(
        "vscode.diff",
        vscode.Uri.file(leftDiffFileUri),
        vscode.Uri.file(rightDiffFileUri)
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
