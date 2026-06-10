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
        
        if (filePath.includes('cart.css')) {
            content = content.replace(/\/images\/jeni1\.jpg/g, "../image/jeni1.jpg");
            modified = true;
        } else if (filePath.includes('header.css')) {
            content = content.replace(/\/images\/jeni1\.jpg/g, "../image/jeni1.jpg");
            content = content.replace(/\/images\/category\.jpg/g, "../image/category.jpg");
            modified = true;
        } else if (filePath.includes('categories.css')) {
            content = content.replace(/\/images\/jeni1\.jpg/g, "../../image/jeni1.jpg");
            content = content.replace(/\/images\/category\.jpg/g, "../../image/category.jpg");
            modified = true;
        } else if (filePath.includes('profilr.css')) {
            content = content.replace(/\/images\/profilebg\.jpg/g, "../image/profilebg.jpg");
            modified = true;
        } else if (filePath.includes('register.css')) {
            content = content.replace(/\/images\/jeni\.jpg/g, "../Dashboard/image/jeni.jpg");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Unfixed:', filePath);
        }
    }
});
