import {assign, trimLeft} from 'lodash';

const defaultOptions = {
  '#': 32,
  'zenkakuBase': false
};

export default function(context, options = {}) {

  options = assign({}, defaultOptions, options);
  let {Syntax, getSource, report, RuleError} = context;

  return {
    [Syntax.Header](node) {
      return new Promise((resolve, reject) => {
        const match = parseHeader(getSource(node));
        const title = match.title;
        const limit = options[match.level];

        const length = options.zenkakuBase ? zenkakuBaseLength(title) : title.length;

        if (limit < length) {
          report(node, new RuleError(getMessage(title, limit, options.lang)));
        }

        resolve();
      });
    }
  }
}

function zenkakuBaseLength(text) {
  const zenkaku = text.replace(/[\x20-\x7E]/g, '');
  return zenkaku.length + Math.ceil((text.length - zenkaku.length) / 2);
}

function getMessage(text, limit, lang = 'en') {
  switch (lang) {
    case 'ja':
      return `「${text}」が${limit}文字を超えています。`;
    default:
      return `"${text}" is over ${limit}`;
  }
}

function parseHeader(text) {
  const match1 = trimLeft(text).match(/^([#]+)([^#]*)$/);
  if (match1 !== null) {
    const title = trimLeft(match1[2]);
    const level = match1[1];
    return { level, title };
  }
  const match2 = trimLeft(text).match(/^(.*)\n(-+|=+)$/);
  if (match2 !== null) {
    const title = trimLeft(match2[1]);
    const level = match2[2][0] === '=' ? '#' : '##';
    return { level, title };
  }
  throw new Error('Unknown Header.Syntax: ' + text);
}
