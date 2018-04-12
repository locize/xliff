const map = {
  '&': '&amp;', // this must be the first !!!
  '"': '&quot;',
  '\'': '&apos;',
  '<': '&lt;',
  '>': '&gt;'
};

module.exports = function(str) {
  Object.keys(map).forEach(function(char) {
    str = str.replace(new RegExp(char, 'g'), map[char]);
  });
  return str;
};
