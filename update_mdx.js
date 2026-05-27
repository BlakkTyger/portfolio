const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(process.cwd(), 'content/posts');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: mdxContent } = matter(content);
  
  if (!data.category) {
    if (data.tags && data.tags.includes('physics')) {
      data.category = 'Physics';
      data.subCategory = 'Quantum Mechanics';
    } else if (data.tags && data.tags.includes('ai') || data.tags?.includes('machine-learning')) {
      data.category = 'Computer Science';
      data.subCategory = 'Artificial Intelligence';
    } else {
      data.category = 'Miscellaneous';
      data.subCategory = 'General';
    }
    
    const newFileContent = matter.stringify(mdxContent, data);
    fs.writeFileSync(filePath, newFileContent);
  }
});
