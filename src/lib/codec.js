export function toUnicode(s) {
  const backslash = '\\';

  return s.split('').map((c) => {
    const code = c.charCodeAt(0);
    return code < 128 ? c : `${backslash}u${code.toString(16)}`;  // '\\' + 'u' + code.toString(16);
  }).join('');
}

export default toUnicode;
