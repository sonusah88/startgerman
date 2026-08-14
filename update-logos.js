const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app');
const targetPages = [
  { file: 'page.tsx', href: '/' },
  { file: 'login/page.tsx', href: '/' },
  { file: 'register/page.tsx', href: '/' },
  { file: 'dashboard/page.tsx', href: '/dashboard' },
  { file: 'roadmap/page.tsx', href: '/dashboard' },
  { file: 'scenarios/page.tsx', href: '/dashboard' },
  { file: 'scenarios/writing/page.tsx', href: '/dashboard' },
  { file: 'reading/page.tsx', href: '/dashboard' },
  { file: 'listening/page.tsx', href: '/dashboard' },
  { file: 'explore/page.tsx', href: '/dashboard' },
  { file: 'exam/page.tsx', href: '/dashboard' },
  { file: 'dictionary/page.tsx', href: '/dashboard' },
  { file: 'conjugation/page.tsx', href: '/dashboard' },
  { file: 'a1-course/page.tsx', href: '/dashboard' },
  { file: 'progress/page.tsx', href: '/dashboard' },
];

targetPages.forEach(({ file, href }) => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - does not exist.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // There are two common patterns for the logo wrapper:
  // <div className="flex items-center gap-3">
  // <div className="flex items-center gap-3 mb-10">
  // <div className="flex items-center justify-center gap-3 mb-12"> (e.g. login)
  
  // A regex to match the opening div, the D icon div, the span, and the closing div
  const regex1 = /<div className="([^"]*?)">\s*<div className="w-[0-9]+ h-[0-9]+ bg-gradient-to-br from-amber-400 to-orange-500 rounded-[a-z]+ flex items-center justify-center font-bold text-black text-lg shadow-lg [^"]*">D<\/div>\s*<span className="font-bold text-xl[^"]*">DeutschApp<\/span>\s*<\/div>/g;
  
  const regex2 = /<div className="([^"]*?)">\s*<div className="w-[0-9]+ h-[0-9]+ bg-gradient-to-br from-amber-400 to-orange-500 rounded-[a-z]+ flex items-center justify-center font-bold text-black text-xl shadow-lg [^"]*">D<\/div>\s*<span className="font-bold text-2xl[^"]*">DeutschApp<\/span>\s*<\/div>/g; // for login/register pages

  let modified = false;

  content = content.replace(regex1, (match, classes) => {
    modified = true;
    // Keep 'Link' imported
    return match
      .replace(`<div className="${classes}">`, `<Link href="${href}" className="${classes} hover:opacity-80 transition-opacity">`)
      .replace(/<\/div>$/, `</Link>`);
  });

  content = content.replace(regex2, (match, classes) => {
    modified = true;
    return match
      .replace(`<div className="${classes}">`, `<Link href="${href}" className="${classes} hover:opacity-80 transition-opacity">`)
      .replace(/<\/div>$/, `</Link>`);
  });

  // Ensure Link is imported from next/link
  if (modified && !content.includes("import Link from")) {
     content = `import Link from 'next/link';\n` + content;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`No match found in ${file}`);
  }
});
