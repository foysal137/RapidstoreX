const fs = require('fs');
const path = require('path');

// Simple glob replacement
function getFiles(dir, match) {
  const files = fs.readdirSync(dir);
  let res = [];
  files.forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(getFiles(full, match));
    } else if (full.endsWith(match)) {
      res.push(full);
    }
  });
  return res;
}

const replacements = {
  'bg-white': 'bg-white dark:bg-slate-950',
  'bg-gray-50': 'bg-gray-50 dark:bg-slate-900',
  'bg-\\[#f8f9fa\\]': 'bg-[#f8f9fa] dark:bg-slate-900',
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-900',
  'text-gray-900': 'text-gray-900 dark:text-gray-100',
  'text-gray-800': 'text-gray-800 dark:text-gray-200',
  'text-slate-800': 'text-slate-800 dark:text-slate-200',
  'text-gray-700': 'text-gray-700 dark:text-gray-300',
  'text-gray-600': 'text-gray-600 dark:text-gray-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'border-gray-100': 'border-gray-100 dark:border-slate-800',
  'border-gray-200': 'border-gray-200 dark:border-slate-700',
  'border-slate-100': 'border-slate-100 dark:border-slate-800',
  'border-slate-200': 'border-slate-200 dark:border-slate-700',
};

const files = getFiles('src', '.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    // Escape brackets for the regex
    const cleanKey = key; 
    // We only want to replace if it is NOT followed immediately by the exact same dark component
    // Let's do a simple replace first, then we'll clean up duplicates
    const regex = new RegExp(`\\b${cleanKey}\\b`, 'g');
    content = content.replace(regex, value);
  }
  
  // Cleanup duplicates, e.g. "bg-white dark:bg-slate-950 dark:bg-slate-950" 
  // or if the file already had dark:bg-slate-950
  content = content.replace(/dark:bg-slate-950(\s+dark:bg-[a-z0-9-]+)+/g, 'dark:bg-slate-950');
  content = content.replace(/dark:bg-slate-900(\s+dark:bg-[a-z0-9-]+)+/g, 'dark:bg-slate-900');
  
  // Also clean if the script appends `dark:...` next to an existing `dark:xxx` 
  content = content.replace(/(bg-white dark:bg-slate-950) dark:bg-slate-900/g, '$1');
  content = content.replace(/(text-gray-[0-9]+ dark:text-gray-[0-9]+) dark:text-[a-z0-9-]+/g, '$1');
  content = content.replace(/(bg-white dark:bg-slate-950) dark:bg-slate-\d+/g, '$1');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
