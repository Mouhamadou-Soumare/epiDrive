const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const apiDir = path.join(__dirname, 'src/app/api'); 
const testDir = path.join(__dirname, 'src/tests/api'); 

const aliases = {
  '@': path.join(__dirname, 'src'),
};

if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

function resolveAlias(filePath) {
  for (const alias in aliases) {
    if (filePath.startsWith(alias)) {
      return filePath.replace(alias, aliases[alias]);
    }
  }
  return filePath;
}

const generateTestTemplate = (name, filePath, exports) => `
import { ${exports.join(', ')} } from '${filePath.replace(/\\/g, '/')}'${exports.length === 0 ? '' : ';'}

describe('${name}', () => {
${exports.map(exp => `
  describe('${exp}', () => {
    it('should work as expected', () => {
      expect(true).toBe(true); // TODO: Add actual tests for ${exp}
    });

    it('should handle edge cases', () => {
      expect(true).toBe(true); // TODO: Add edge case tests for ${exp}
    });
  });
`).join('')}
});
`;

function getExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ESNext, true);

  const exports = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isExportDeclaration(node) && node.exportClause) {
      node.exportClause.elements.forEach(el => exports.push(el.name.text));
    }
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) exports.push(node.name.text);
    }
    if (ts.isClassDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) exports.push(node.name.text);
    }
  });

  return exports;
}

function generateTestFile(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const resolvedPath = resolveAlias(path.relative(testDir, filePath));
  const testFilePath = path.join(testDir, `${fileName}.test.ts`);

  if (fs.existsSync(testFilePath)) {
    console.log(`Test file already exists: ${testFilePath}`);
    return;
  }

  const exports = getExports(filePath);
  const content = generateTestTemplate(fileName, resolvedPath, exports);
  fs.writeFileSync(testFilePath, content.trim());
  console.log(`Created test file: ${testFilePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      generateTestFile(fullPath);
    }
  });
}

walkDir(apiDir);
