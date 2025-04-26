const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// Function to process a file
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if file doesn't contain object definitions
    if (!content.includes('{') || !content.includes('}')) {
      return;
    }

    // Parse the file content
    let ast;
    try {
      ast = require('@babel/parser').parse(content, {
        plugins: ['jsx', 'typescript', 'decorators-legacy'],
        sourceType: 'module',
      });
    } catch (error) {
      console.log(`Skipping ${filePath} - Parse error:`, error.message);
      return;
    }

    // Transform the AST to sort object keys
    require('@babel/traverse').default(ast, {
      ObjectExpression(path) {
        const node = path.node;
        const sortedProperties = node.properties.sort((a, b) => {
          if (!a.key || !b.key) return 0;
          return a.key.name.localeCompare(b.key.name);
        });
        node.properties = sortedProperties;
      },
    });

    // Generate the new code
    const output = require('@babel/generator').default(ast).code;

    // Format with prettier
    const formatted = await prettier.format(output, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
    });

    // Write back to file if changes were made
    if (formatted !== content) {
      fs.writeFileSync(filePath, formatted);
      console.log(`Updated ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to walk through directories
async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      await walkDir(filePath);
    } else if (
      stat.isFile() &&
      /\.(js|jsx|ts|tsx)$/.test(file) &&
      !filePath.includes('node_modules')
    ) {
      await processFile(filePath);
    }
  }
}

// Main function
async function main() {
  const rootDir = process.cwd();
  console.log('Starting to sort object keys...');
  await walkDir(rootDir);
  console.log('Finished sorting object keys.');
}
main().catch(console.error);
