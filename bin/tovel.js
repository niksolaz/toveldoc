#!/usr/bin/env node
const path = require('path');
const { documentVueFile } = require('../src');

const [,, vueFilePath] = process.argv;

if (!vueFilePath) {
    console.error("Usage: npx tovel <namefile.vue>");
    process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), vueFilePath);

documentVueFile(absolutePath);
