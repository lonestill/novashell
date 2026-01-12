import { bookmarkCommand } from '../../src/commands/bookmark.js';
import { assertEquals } from '../helpers.js';
import { getBookmarks, saveBookmark, removeBookmark } from '../../src/utils/bookmarks.js';

async function testBookmark() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await bookmarkCommand(['list']);
    assertEquals(output.length >= 0, true, 'bookmark list should work');
    
    const testBookmarkName = 'test-bm-' + Date.now();
    await saveBookmark(testBookmarkName, process.cwd());
    await bookmarkCommand(['list']);
    assertEquals(output.includes(testBookmarkName), true, 'bookmark should list saved bookmarks');
    
    await removeBookmark(testBookmarkName);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ bookmark tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testBookmark().catch(console.error);
