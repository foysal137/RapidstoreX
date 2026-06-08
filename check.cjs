const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const lines = code.split('\n');
console.log(lines.slice(1540, 1550).join('\n'));
