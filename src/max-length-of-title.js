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
        const match = trimLeft(getSource(node)).match(/^([#]+)([^#]*)$/);
        const title = trimLeft(match[2]);
        const limit = options[match[1]];

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
