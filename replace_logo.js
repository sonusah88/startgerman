const fs = require('fs');
const path = require('path');

const srcAppPath = path.join(__dirname, 'src', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const logoHtml = `<img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>`;
          
const logoHtmlLogin = `<img src="/logo.jpg" alt="StartGerman Logo" className="h-12 w-12 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
            <span className="font-bold text-xl">StartGerman</span>`;

const oldLogoRegex = /<div[^>]*bg-gradient-to-br from-amber-400 to-orange-500[^>]*>\s*D\s*<\/div>\s*<span className="font-bold text-xl tracking-tight">DeutschApp<\/span>/g;
const oldLogoRegex2 = /<div[^>]*bg-gradient-to-br from-amber-400 to-orange-500[^>]*>\s*D\s*<\/div>\s*<span className="font-bold text-xl">DeutschApp<\/span>/g;

walkDir(srcAppPath, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace the icon + text
    content = content.replace(oldLogoRegex, logoHtml);
    content = content.replace(oldLogoRegex2, logoHtmlLogin);
    
    // Replace remaining textual instances of DeutschApp with StartGerman
    content = content.replace(/>DeutschApp</g, '>StartGerman<');
    content = content.replace(/"DeutschApp/g, '"StartGerman');
    content = content.replace(/DeutschApp —/g, 'StartGerman —');
    content = content.replace(/DeutschApp account/g, 'StartGerman account');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
