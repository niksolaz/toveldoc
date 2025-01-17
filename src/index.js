const fs = require('fs');
const path = require('path');
const parseVueFile = require('./parseVueFile');

// Function to document a Vue file 
function documentVueFile(filePath) {
    const documentation = parseVueFile(filePath);

    if (!documentation) return;

    // Extract the file name from the file path
    const fileName = path.basename(filePath, '.vue');

    // Create the markdown content for the documentation
    let output = `# Documentation for ${fileName}.vue\n\n`;
    output += documentation.isSetup ? 'Script setup not found.\n\n' : 'Script not-setup not found.\n\n';
    
    output += '## Variables\n';
    if (documentation.variables.length > 0) {
        documentation.variables.forEach(variable => {
            let commentVar = variable.comment ? variable.comment : 'No comment found';
            output += `- ${variable.name}: ${commentVar}\n`
        });
    } else {
        output += 'Nothing variable founded.\n';
    }

    output += '\n## Functions\n';
    if (documentation.functions.length > 0) {
        documentation.functions.forEach(func => {
            let commentFn = func.comment ? func.comment : 'No comment found';
            output += `- ${func.name}: ${commentFn}\n`
        });
    } else {
        output += 'Nothing function founded.\n';
    }

    output += '\n## Computed\n';
    if (documentation.computed.length > 0) {
        documentation.computed.forEach(comp => {
            let commentComp = comp.comment ? comp.comment : 'No comment found';
            output += `- ${comp.name}: ${commentComp}\n`
        });
    } else {
        output += 'Nothing computed founded.\n';
    }

    // Create the output directory if it does not exist
    const outputDir = path.join(process.cwd(), 'toveldocs');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Salva il file markdown nella cartella toveldocs
    const outputPath = path.join(outputDir, `${fileName}.md`);
    fs.writeFileSync(outputPath, output, 'utf8');

    console.log(`Documentation saved into ${outputPath}`);
}

module.exports = {
    documentVueFile
};
