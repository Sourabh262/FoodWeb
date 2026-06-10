const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Match url('../image/jeni1.jpg'), url('../../image/category.jpg'), url('/src/component/Dashboard/image/jeni1.jpg'), url('../Dashboard/image/jeni.jpg')
        const regex1 = /url\(['"]?(?:\.\.\/)+image\/(.*?)['"]?\)/g;
        if (regex1.test(content)) {
            content = content.replace(regex1, "url('/images/$1')");
            modified = true;
        }

        const regex2 = /url\(['"]?\/src\/component\/Dashboard\/image\/(.*?)['"]?\)/g;
        if (regex2.test(content)) {
            content = content.replace(regex2, "url('/images/$1')");
            modified = true;
        }

        const regex3 = /url\(['"]?(?:\.\.\/)+Dashboard\/image\/(.*?)['"]?\)/g;
        if (regex3.test(content)) {
            content = content.replace(regex3, "url('/images/$1')");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
