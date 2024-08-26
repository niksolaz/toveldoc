const fs = require("fs");
const { parse } = require("@vue/compiler-sfc"); // Import the parse function from @vue/compiler-sfc package
const parser = require("@babel/parser"); // Import the parser module from @babel/parser package
const traverse = require("@babel/traverse").default; // Import the default export of the traverse module from @babel/traverse package

// Function to parse a Vue file and get the variables and functions declared in the script tag
function parseVueFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8"); // Read the file content
  const parsed = parse(content); // Parse the file using vue-template-compiler package

  // console.log(parsed.descriptor); // Print the parsed descriptor object
  // Check if the file has a script tag
  if (!parsed.descriptor.script && !parsed.descriptor.scriptSetup) {
    console.error("Nothing script content found in the file");
    return;
  }

  const isSetupScript = parsed.descriptor.scriptSetup // Check if the script tag is a setup script
    ? parsed.descriptor.scriptSetup.attrs &&
      parsed.descriptor.scriptSetup.attrs.setup !== undefined
    : parsed.descriptor.script.attrs &&
      parsed.descriptor.script.attrs.setup !== undefined;
  const scriptContent = isSetupScript
    ? parsed.descriptor.scriptSetup.content
    : parsed.descriptor.script.content; // Get the script content

  // Parse the script content using babel parser
  const ast = parser.parse(scriptContent, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const documentation = {
    variables: [],
    functions: [],
    computed: [],
    comments: [],
    isSetup: isSetupScript,
  };

  function extractComment(comments) {
    if (!comments) return null;
    const tovelComment = comments.find((comment) =>
      comment.value.includes("#tovel::")
    );
    return tovelComment ? tovelComment.value.trim() : null;
  }

  // Traverse the ast to get the variables and functions declared in the script tag
  traverse(ast, {
    VariableDeclaration(path) {
      const comment = extractComment(path.node.leadingComments);
      path.node.declarations.forEach((declaration) => {
        const init = declaration.init;
        const name = declaration.id.name;

        if (init && init.type === "ArrowFunctionExpression") {
          documentation.functions.push({name, comment});
        } else if (init && init.callee && init.callee.name === "computed") {
          documentation.computed.push({name, comment});
        } else {
          documentation.variables.push({name, comment});
        }
      });
    },
    FunctionDeclaration(path) {
      // FunctionDeclaration is a node type
      const comment = extractComment(path.node.leadingComments);
      documentation.functions.push({ name: path.node.id.name, comment }); // Get the function name
    },
    ArrowFunctionExpression(path) {
      // ArrowFunctionExpression is a node type
      const comment = extractComment(path.parent.leadingComments);
      if (path.parent.type === "VariableDeclarator") {
        // Check if the parent is a VariableDeclarator
        documentation.functions.push({ name: path.parent.id.name, comment }); // Get the function name
        // remove object with same name and comment null
        documentation.functions = documentation.functions.filter(
          (fn) => fn.name !== path.parent.id.name || fn.comment !== null
        );
      }
    }
  });

  return documentation;
}

module.exports = parseVueFile;
