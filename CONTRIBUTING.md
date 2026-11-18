# Contributing to Sentiment

Thanks for your interest. This is a solo-maintained project, so review is best-effort (see [SUPPORT.md](SUPPORT.md)).
Open an issue before a large change so the direction can be agreed first.

## Setup

```sh
npm install
node index.js           # starts the Express server on $PORT (default 3000)
```

Dependencies are in `package.json` (`express`, `natural`, `node-fetch`, `spellchecker`) and `requirements.txt`.
The `Dockerfile` and compose files are described in the README.

## Tests

There is no working automated test run yet:

- `npm test` is the npm placeholder and exits with an error.
- `tests/testSentimentAnalysis.js` and `tests/evaluateSentiment.py` are the existing test and evaluation scripts. Their
  paths and entry points do not all match the files in the repository (see "Status and limitations" in the
  [README](README.md)).

A change that fixes or replaces them is welcome. Say in the pull request how you verified your change.

## Conventions

- ES modules (`"type": "module"` in `package.json`).
- Sample and word-list data lives in `data/`; text helpers in `utils/`.
- **Commits** are one plain sentence describing the change, for example `Update documentation and add new configurations`.
  There is no CI.

## Pull requests

Keep one change per pull request and fill in the pull request template.
