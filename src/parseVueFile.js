const fs = require('fs');
const { parseComponent } = require('vue-template-compiler'); // Import the parseComponent function from vue-template-compiler package  
const parser = require('@babel/parser'); // Import the parser module from @babel/parser package 
const traverse = require('@babel/traverse').default; // Import the default export of the traverse module from @babel/traverse package 

// Function to parse a Vue file and get the variables and functions declared in the script tag 
function parseVueFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8'); // Read the file content 
    const parsed = parseComponent(content); // Parse the file using vue-template-compiler package 

    // Check if the file has a script tag  
    if (!parsed.scriptSetup && !parsed.script) {
        console.error("Nothing script content found in the file");
        return;
    }

    const isSetupScript = parsed.scriptSetup  // Check if the script tag is a setup script
        ? (parsed.scriptSetup.attrs && parsed.scriptSetup.attrs.setup !== undefined) 
        : (parsed.script.attrs && parsed.script.attrs.setup !== undefined);
    const scriptContent = isSetupScript ? parsed.scriptSetup.content : parsed.script.content; // Get the script content  

    // Parse the script content using babel parser 
    const ast = parser.parse(scriptContent, {
        sourceType: 'module', 
        plugins: ['typescript'] 
    });

    const documentation = {
        variables: [],
        functions: [],
        computed: [],
        isSetup: isSetupScript
    };

    // Traverse the ast to get the variables and functions declared in the script tag 
    traverse(ast, {
        VariableDeclaration(path) {
          path.node.declarations.forEach(declaration => {
              const init = declaration.init;

              if (init && init.type === 'ArrowFunctionExpression') {
                  documentation.functions.push(declaration.id.name);
              } else if (init && init.callee && init.callee.name === 'computed') {
                  documentation.computed.push(declaration.id.name);
              } else {
                  documentation.variables.push(declaration.id.name);
              }
          });
        },
        FunctionDeclaration(path) {  // FunctionDeclaration is a node type
            documentation.functions.push(path.node.id.name); // Get the function name
        },
        ArrowFunctionExpression(path) {  // ArrowFunctionExpression is a node type
            if (path.parent.type === 'VariableDeclarator') { // Check if the parent is a VariableDeclarator
                documentation.functions.push(path.parent.id.name); // Get the function name
            }
        }
    });

    return documentation;
}

module.exports = parseVueFile;
