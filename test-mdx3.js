const { getPostsByCategory, getCategoryHierarchy } = require('./src/lib/mdx');

const hierarchy = getCategoryHierarchy();
console.log("Hierarchy:", JSON.stringify(hierarchy, null, 2));

// Simulate what the page does after decodeURIComponent on lowercased values
const decodedCat = decodeURIComponent('technology');
const decodedSub = decodeURIComponent('artificial%20intelligence');
console.log("\nDecoded params:", decodedCat, decodedSub);
console.log("Posts found:", getPostsByCategory(decodedCat, decodedSub).length);
