const { getPostsByCategory, getAllPostsMeta, getCategoryHierarchy } = require('./src/lib/mdx');

console.log("Hierarchy:");
console.log(getCategoryHierarchy());

console.log("\nAll Meta:");
console.log(getAllPostsMeta().map(p => ({ slug: p.slug, cat: p.category, sub: p.subCategory })));

console.log("\nFiltered:");
console.log(getPostsByCategory('Technology', 'Artificial Intelligence'));

