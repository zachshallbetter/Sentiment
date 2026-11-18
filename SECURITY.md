# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue. Use GitHub private vulnerability
reporting: <https://github.com/zachshallbetter/Sentiment/security/advisories/new>.

Include:

- a description of the issue and its impact,
- steps to reproduce (a minimal example is ideal),
- the affected commit or version.

This is a solo-maintained project. Responses and fixes are best-effort, with no SLA and no guaranteed response time.
Please give a reasonable window to ship a fix before any public disclosure.

## Scope

Sentiment is a Node.js text-analysis utility. `index.js` starts an Express server whose `/analyze` route builds a shell command from the request body's `text` field and runs it with `child_process.exec`. That route is in scope for any report about command injection or unsafe input handling. The repository's `Dockerfile` and compose files are in scope for container configuration issues.

## Supported versions

Only the latest commit on `main` receives fixes. The repository has one tag, `v1.0.0`; older tags are not patched.
