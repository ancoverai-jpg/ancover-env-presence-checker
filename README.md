# Ancover Environment Presence Checker

**Experimental.** Check a reviewed list of environment variable names without printing their values. Useful when a developer or coding agent needs to diagnose missing configuration and share a names-only report.

[Português do Brasil](README.pt-BR.md) · [Specification and alternatives](docs/specification.md) · [Validation](docs/validation.md)

Requires **Node.js 22+**. There are no package dependencies, install scripts, servers, accounts or API keys to configure.

## Quick start

From this source directory:

```sh
node --test tests/check.test.mjs
node skills/env-presence-check/scripts/check.mjs --contract examples/contract.json --env-file examples/environment.sample
```

The example's contract requires APP_PORT and SERVICE_TOKEN, with optional TRACE_MODE. Its synthetic sample provides both required values. Expected report excerpt:

```json
{"passed":true,"records":[{"name":"APP_PORT","required":true,"state":"PRESENT"},{"name":"SERVICE_TOKEN","required":true,"state":"PRESENT"},{"name":"TRACE_MODE","required":false,"state":"MISSING"}]}
```

To inspect only the current launching process's declared names, replace `--env-file PATH` with `--process`. It cannot inspect another terminal, container or remote service. It never enumerates the entire process environment.

Exit 0: required names present. Exit 1: required name missing, empty or unresolved. Exit 2: invalid input or environment. `--help` prints usage. Values, prefixes, lengths, hashes, input lines and paths are excluded from reports and errors. Variable names are not anonymized and can themselves be sensitive.

## Contract and conservative file grammar

Use a JSON object with a required `required` array and optional `optional` array. Declare 1–128 distinct uppercase ASCII names matching `[A-Z][A-Z0-9_]{0,63}`. Unknown contract properties and duplicates are errors.

File mode accepts single-line `KEY=value`, optional `export`, blank lines and comments. An unquoted `#` begins a comment; quote a literal hash. Quoted literals are supported without escapes or embedded matching quotes. Whitespace-only values count as EMPTY. Duplicate keys, malformed assignments, multiline quotes and quoted escapes fail closed. Dollar-name and dollar-brace expressions report UNRESOLVED rather than being evaluated, even in quoted values; this conservative policy may flag intended literals. Input files must be regular files, valid UTF-8, at most 1 MiB; assignments at most 64 KiB. A stable local snapshot is assumed.

This is not a full dotenv parser, Compose resolver, secret scanner, arbitrary-log scrubber or deployment approval. PRESENT does not mean a value is correct or credentials work. Prefer your application's existing validator when it already handles the task. See the specification for comparison with dotenv-safe and dotenv-linter.

## Agent packages and lifecycle

One canonical `skills/env-presence-check/` folder backs the portable, Codex and Claude Code manifests. The Skill explains when to use the script, explicit source selection and how to handle errors without dumping secrets. Host conversation/trigger tests are separate from CLI tests; current coverage is in validation.md. No marketplace approval is claimed.

Local install: extract the source to a chosen directory; no dependency installation is needed. Update: review the source diff and rerun the tests/example. Uninstall: remove only this extracted directory. The checker changes no user configuration or environment and writes no files.

No telemetry or network requests. Read [security policy](SECURITY.md), [contribution guide](CONTRIBUTING.md), [license](LICENSE), [changelog](CHANGELOG.md) and [roadmap](ROADMAP.md).
