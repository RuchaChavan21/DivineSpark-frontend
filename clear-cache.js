// Simple script to help clear browser cache
// Run this in the browser console to clear cache and reload

console.log('Clearing browser cache...');

// Clear localStorage
localStorage.clear();

// Clear sessionStorage
sessionStorage.clear();

// Force reload the page
window.location.reload(true);

console.log('Cache cleared and page reloaded!');
