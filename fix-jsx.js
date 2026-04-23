const fs = require('fs');
const path = require('path');

const walkDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            if (content.includes(': JSX.Element')) {
                content = content.replace(/: JSX\.Element/g, '');
                updated = true;
            }
            if (content.includes(': Promise<JSX.Element>')) {
                content = content.replace(/: Promise<JSX\.Element>/g, '');
                updated = true;
            }
            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

['app', 'components', 'contexts'].forEach(dir => {
    walkDir(path.join(__dirname, dir));
});
