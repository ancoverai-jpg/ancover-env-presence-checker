---
name: env-presence-check
description: Check an explicitly declared set of required environment variables for missing, empty or unresolved values while reporting names and states only. Use for environment preflight or configuration troubleshooting; do not use for secret scanning, arbitrary-log redaction or deployment approval.
license: MIT
---

# Environment presence check

Trigger examples: "Check these required environment variables without printing values"; "Prepare a names-only environment diagnostic." Non-triggers: "Scan my repository for leaked secrets"; "Redact this log"; "Deploy production."

Prerequisite: Node.js 22+. The bundled script uses only the standard library and needs no dependency installation. Locate this Skill's root; the script is `scripts/check.mjs` relative to it.

1. Agree on a JSON contract containing `required` and optionally `optional` arrays of variable names. Use only reviewed uppercase identifiers. Never infer permission to read unrelated environment keys. Names can also be sensitive; confirm the selected set is appropriate for the task.
2. Select an explicit input source. Use `node <skill-root>/scripts/check.mjs --contract CONTRACT.json --env-file PATH` for a consented file, or use `--process` instead of `--env-file PATH` when the user wants to inspect the process that launches the script. Process mode only reports that process's selected keys; it cannot observe another terminal, container or remote service.
3. Do not run env/printenv, dump process.env, source the file, execute substitutions or print values as a fallback. If Node is absent, report the dependency as missing. A command error must not become a reason to reveal file contents.
4. Interpret PRESENT, MISSING, EMPTY and UNRESOLVED per selected name. File interpolation remains unresolved; whitespace-only values count as empty. Optional absence does not fail the check. Presence does not establish value validity, credentials working, network connectivity or deployment readiness.
5. Exit 0 means required presence passed; 1 means a required name is missing, empty or unresolved; 2 means invalid input/environment. Errors intentionally omit names, paths and offending lines. Ask for a sanitized syntax example if debugging is needed. The conservative file grammar excludes multiline values and quoted escapes; use an application-native validator when that format is required.
6. Report only the resulting names/states and evidence source, the commands with safe paths if needed, and limitations. Never add secret values, their lengths, prefixes or hashes. Do not silently repair files or mutate the environment. Rerun only after an authorized local correction.

For a real agent evaluation, test positive and negative trigger cases in each host and record actual invocation/tool traces separately. Experimental packaging does not prove conversational compatibility. No network or subprocesses are used by the checker and it writes no files. It is not a sandbox against concurrently modified input files or an arbitrary-output secret scrubber.
