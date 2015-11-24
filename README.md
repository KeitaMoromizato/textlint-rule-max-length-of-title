# textlint-rule-max-length-of-title
[textlint](https://github.com/textlint/textlint) rule that check limit maximum length of title.

## Installation

```
npm install textlint-rule-max-length-of-title
```

## Usage

```
npm install -g textlint textlint-rule-max-length-of-title
textlint --rule textlint-rule-max-length-of-title README.md
```

## Config

```
{
  "rules": {
    "textlint-rule-max-length-of-title": {
      "#": 25,
      "##": 30
    }
  }
}
```

## Tests

```
npm test
```

## License
MIT
