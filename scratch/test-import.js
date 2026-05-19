const MagicString = require('magic-string');
console.log('MagicString:', typeof MagicString, MagicString);
try {
  const s = new MagicString('abc');
  console.log('Success:', s.toString());
} catch (e) {
  console.error('Error:', e);
}
