const fs = require('fs');
const path = require('path');
const p = path.resolve('assets/CIT_LOGO.png');
if(fs.existsSync(p)){
    const base64 = fs.readFileSync(p, {encoding: 'base64'});
    fs.writeFileSync('src/lib/LOGO_BASE64.js', 'export const CIT_LOGO_BASE64 = "data:image/png;base64,' + base64 + '";\n');
    console.log('Created LOGO_BASE64.js');
} else {
    console.log('File not found:', p);
}
