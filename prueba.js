import fs from 'fs';
const json = JSON.stringify(JSON.parse(fs.readFileSync('google.json', 'utf-8')));
console.log(json);
