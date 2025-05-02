const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// Function to process a file
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

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

    // Transform the AST to remove unused variables and functions
    require('@babel/traverse').default(ast, {
      // Remove unused functions
      FunctionDeclaration(path) {
        const { node, scope } = path;
        if (!node.id) return;
        const binding = scope.getBinding(node.id.name);
        if (binding && !binding.referenced && !binding.constantViolations.length) {
          path.remove();
        }
      },
      // Remove unused imports
      ImportDeclaration(path) {
        const { node } = path;
        const hasUsedSpecifiers = node.specifiers.some(specifier => {
          if (specifier.type === 'ImportDefaultSpecifier') {
            const binding = path.scope.getBinding(specifier.local.name);
            return binding && binding.referenced;
          }
          if (specifier.type === 'ImportSpecifier') {
            const binding = path.scope.getBinding(specifier.local.name);
            return binding && binding.referenced;
          }
          return true; // Keep namespace imports
        });
        if (!hasUsedSpecifiers) {
          path.remove();
        }
      },
      // Remove unused variables
      VariableDeclarator(path) {
        const { node, scope } = path;
        if (!node.id) return;
        const binding = scope.getBinding(node.id.name);
        if (binding && !binding.referenced && !binding.constantViolations.length) {
          // Check if this is the only declarator in the declaration
          const parent = path.parent;
          if (parent.declarations.length === 1) {
            parent.remove();
          } else {
            path.remove();
          }
        }
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
  console.log('Starting to remove unused variables and functions...');
  await walkDir(rootDir);
  console.log('Finished removing unused variables and functions.');
}
main().catch(console.error);
