module.exports = function(len){
  var l = 10;
  if (len && typeof len === 'number') l = len;
  var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_1234567890';
  var m = a.length;
  var r = '';
  for (var i=0; i<l; i++) r+= a[Math.floor(Math.random() * m)];
  return r;
}
