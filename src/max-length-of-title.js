import {assign, trimLeft} from 'lodash';

const defaultOptions = {
  '#': 32
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

        if (limit < title.length) {
          report(node, new RuleError(`"${title}" is over ${limit}`));
        }

        resolve();
      });
    }
  }
}
