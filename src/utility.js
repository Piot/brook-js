function _toHex(num, len) {
  const str = (Number(num) >>> 0).toString(16);
  return "0".repeat(len - str.length) + str;
}

export function toHex(num, len = 8) {
  if (num instanceof Uint8Array) {
    let s = '';
    for (let i = 0; i < num.length; ++i) {
      s += ' ';
      s += _toHex(num[i], 2);
    }
    return s;
  }
  return _toHex(num, len);
}
