const LINE_BREAK = "\n";

function normalizeBreaks( str ) {
  return str.replace( /\r\n?/g, LINE_BREAK );
}
function toLines( str ) {
  return normalizeBreaks( str ).split( LINE_BREAK );
}
function getLineByNum( str, num ) {
  return toLines( str )[ num - 1 ];
}

module.exports = {
  LINE_BREAK,
  normalizeBreaks,
  toLines,
  getLineByNum,
};
