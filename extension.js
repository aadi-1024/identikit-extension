const vscode = require('vscode');
const axios = require('axios');

// Fetch snippets from the Go backend
async function fetchSnippets() {
    try {
        const response = await axios.get('http://127.0.0.1:8080/snippets');
        console.log('Fetched snippets:', response.data.data); // Log fetched snippets
        return response.data.data;
    } catch (error) {
        console.error('Error fetching snippets:', error);
        return [];
    }
}

// Provide completion items
async function provideCompletionItems(document, position) {
    console.log('provideCompletionItems called'); // Log function call
    const snippets = await fetchSnippets();
    console.log('Snippets to provide:', snippets); // Log snippets to provide
    return snippets.map(snippet => {
        const item = new vscode.CompletionItem(snippet.prefix[0], vscode.CompletionItemKind.Snippet);
        item.insertText = new vscode.SnippetString(snippet.body[0]);
        return item;
    });
}
function getWebviewContent()
{
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    

</head>
<body>
    <div >
    <h1>Identikit : Make Your Work easier</h1>
    Our central snippet storage service is designed to securely store code snippets while offering advanced features like automated documentation generation, robust security analysis, and seamless integration with code editors. Developers can effortlessly organize and access their code snippets, generate documentation with a simple click, identify security vulnerabilities, and benefit from enhanced code editing support. Seamless integration with editors like VSCode makes using the service a painless experience for all. At the current state of the prototype, the basic functionalities such as creating and viewing snippet, generating the documentation and security analysis are already implemented. An extension for VSCode is also developed, and a dashboard with a very basic to-be-polished UI is also completed.
    </div>
</body>
</html>


	`
	

}
// Activate the extension
function activate(context) {
    console.log('Congratulations, your extension "ext" is now active!'); // Log activation message
	var panel=vscode.window.createWebviewPanel(
		'identikit',
		'Extension: Identikit',
		vscode.ViewColumn.One,
		{}

	); 
	panel.webview.html=getWebviewContent();

    // Register the completion item provider for multiple languages
    const languages = ['plaintext', 'javascript', 'cpp', 'python', 'html', 'css'];
    languages.forEach(language => {
        context.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                { scheme: 'file', language: language },
                { provideCompletionItems },
                '.' // Trigger completion on '.'
            )
        );
    });

    // Command registration
    const disposable = vscode.commands.registerCommand('ext.helloWorld', async () => {
        vscode.window.showInformationMessage('Hello World from ext!');
    });

    context.subscriptions.push(disposable);
}

// Deactivate the extension
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
