"use strict";

import assert from 'power-assert';
import {TextLintCore} from 'textlint';
import rule from '../src/max-length-of-title.js';

describe('max-length-of-title', function() {

  context('when use sample text', () => {
    const textlint = new TextLintCore();

    textlint.setupRules({
      'max-length-of-title': rule
    });

    it('should report error', (done) => {
      textlint.lintMarkdown(`
# This Title is over 32 characters.
      `).then(result => {

        assert(result.messages.length === 1);
      }).then(done, done);
    });

    it('should report error', (done) => {
      textlint.lintMarkdown(`
# This Title is 32 characters.....
      `).then(result => {

        assert(result.messages.length === 0);

      }).then(done, done);
    });
  });

  context('when use sample text(with options)', () => {
    const textlint = new TextLintCore();

    textlint.setupRules({
      'max-length-of-title': rule
    },{
      'max-length-of-title': {
        '#': 5,
        '##': 8
      }
    });

    it('should report error', (done) => {
      textlint.lintMarkdown(`
# title.
## subtitle.
      `).then(result => {

        assert(result.messages.length === 2);

      }).then(done, done);
    });

    it('should not report error', (done) => {
      textlint.lintMarkdown(`
  # title
  ## subtitle
      `).then(result => {

        assert(result.messages.length === 0);

      }).then(done, done);
    });

    it('should report error in Japanese', (done) => {
      textlint.setupRules({
        'max-length-of-title': rule
      },{
        'max-length-of-title': {
          '#': 5,
          'lang': 'ja'
        }
      });

      textlint.lintMarkdown(`
  # title.
      `).then(result => {

        assert(result.messages.length === 1);
        assert(result.messages[0].message === '「title.」が5文字を超えています。')

      }).then(done, done);
    });
  });

  context('2 ascii code treated as 1 character', () => {
    const textlint = new TextLintCore();

    textlint.setupRules({
      'max-length-of-title': rule
    }, {
      'max-length-of-title': {
        '#': 20,
        'zenkakuBase': true
      }
    });

    it('should not report error', (done) => {
      textlint.lintMarkdown(`
# two 半角英数字 treated as 1 character
      `).then(result => {

        assert(result.messages.length === 0);
      }).then(done, done);
    });
  });
});
