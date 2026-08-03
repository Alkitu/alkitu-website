const fs = require('fs');
const path = require('path');

const animationsDir = path.join(__dirname, '../components/foundations/lottie/animations');
const indexPath = path.join(__dirname, '../components/foundations/lottie/index.ts');

if (!fs.existsSync(animationsDir)) {
    fs.mkdirSync(animationsDir, { recursive: true });
}

const files = fs.readdirSync(animationsDir).filter(f => f.endsWith('.json'));

let imports = '';
let registryKeys = '';

files.forEach(file => {
    const name = path.basename(file, '.json');
    // Safe variable name for import
    const varName = name.replace(/[^a-zA-Z0-9]/g, '_');
    imports += `import ${varName} from './animations/${file}';\n`;
    registryKeys += `  "${name}": ${varName},\n`;
});

const content = `${imports}
// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Run 'npm run sync:lotties' to update this file after adding new .json files.

export const lottieRegistry = {
${registryKeys}};

export type LottieAnimationName = keyof typeof lottieRegistry;
`;

fs.writeFileSync(indexPath, content);
console.log(`[Lottie Sync] Successfully synced ${files.length} animations to the registry.`);
