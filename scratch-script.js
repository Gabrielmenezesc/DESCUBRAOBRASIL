const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add dark text classes if not already present
    content = content.replace(/text-slate-900(?!\s*dark:)/g, 'text-slate-900 dark:text-white');
    content = content.replace(/text-slate-800(?!\s*dark:)/g, 'text-slate-800 dark:text-slate-100');
    content = content.replace(/text-slate-700(?!\s*dark:)/g, 'text-slate-700 dark:text-slate-200');
    content = content.replace(/text-slate-600(?!\s*dark:)/g, 'text-slate-600 dark:text-slate-300');
    content = content.replace(/text-slate-500(?!\s*dark:)/g, 'text-slate-500 dark:text-slate-400');
    
    // Add dark bg classes if not already present
    // Only adding dark mode bg to blocks that are explicitly bg-white or bg-slate-50 and NOT already responsive
    content = content.replace(/bg-white(?!\s*dark:)(?!\/)(?!\s*\w+\/)/g, 'bg-white dark:bg-slate-900');
    content = content.replace(/bg-slate-50(?!\s*dark:)(?!\/)(?!\s*\w+\/)/g, 'bg-slate-50 dark:bg-slate-800/50');
    content = content.replace(/bg-slate-100(?!\s*dark:)(?!\/)(?!\s*\w+\/)/g, 'bg-slate-100 dark:bg-slate-800');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

traverseDir(srcDir);
console.log('Mass replacement complete.');
