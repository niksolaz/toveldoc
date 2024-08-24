const fs = require('fs');
const { parse } = require('@vue/compiler-sfc'); // Import the parse function from @vue/compiler-sfc package 
const parser = require('@babel/parser'); // Import the parser module from @babel/parser package 
const traverse = require('@babel/traverse').default; // Import the default export of the traverse module from @babel/traverse package 

// Function to parse a Vue file and get the variables and functions declared in the script tag 
function parseVueFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8'); // Read the file content 
    const parsed = parse(content); // Parse the file using vue-template-compiler package 

    // console.log(parsed.descriptor); // Print the parsed descriptor object
    // Check if the file has a script tag  
    if (!parsed.descriptor.script && !parsed.descriptor.scriptSetup) {
        console.error("Nothing script content found in the file");
        return;
    }

    const isSetupScript = parsed.descriptor.scriptSetup  // Check if the script tag is a setup script
        ? (parsed.descriptor.scriptSetup.attrs && parsed.descriptor.scriptSetup.attrs.setup !== undefined) 
        : (parsed.descriptor.script.attrs && parsed.descriptor.script.attrs.setup !== undefined);
    const scriptContent = isSetupScript ? parsed.descriptor.scriptSetup.content : parsed.descriptor.script.content; // Get the script content  

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
