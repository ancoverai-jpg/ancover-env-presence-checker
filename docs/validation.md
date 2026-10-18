# Validation — experimental 0.1.0

Validation date: 2026-10-18. Local environment: Windows, Node.js v24.19.0, PowerShell 7.6. No third-party runtime dependencies or install scripts.

The local suite executed **13 behavioral tests**, all passing. It covers missing/empty/present/unresolved required names, optional absence, conservative file syntax, invalid/duplicate contracts, duplicate env keys, malformed JSON, oversized input, bounded errors, input preservation, selected-key-only process reads, a controlled process-mode child and CLI exit codes. The synthetic value sentinel and its prefix were absent from stdout/stderr. This is bounded fixture evidence, not proof against every possible disclosure channel or a security certification.

The test runner was corrected to locate its script relative to the test module, so it also works when launched outside the project root. No user credentials or application env files were used. Tests read generated temporary fixtures and remove only those fixtures.

The documented example executed successfully: APP_PORT and SERVICE_TOKEN were PRESENT and optional TRACE_MODE was MISSING. Report contains names and states, not the sample values.

A separate clean source copy ran all tests and the documented example without installing dependencies. A temporary CODEX_HOME registered the local marketplace, installed 0.1.0, ran the installed script against synthetic examples, removed the plugin and listed zero remaining installations. The user's original config.toml hash was unchanged. These are real CLI lifecycle checks, not conversational trigger evaluation. Codex conversational trigger/tool evaluation and Claude Code execution are **NOT_TESTED**. CI configuration targets Node 22/24 on Windows/Ubuntu; only a completed remote run can establish those results.

Evaluation interpretation: the predeclared existence-only baseline cannot distinguish missing or empty names in a present file. The checker provides the three seeded states while omitting a synthetic credential sentinel. This is not an agent A/B study, productivity benchmark or comparison against the full capabilities of dotenv-safe/dotenv-linter.

Stable host compatibility is not claimed. The dependency-free CLI may be published as experimental only if its actual checks and exact-file review pass and the report preserves unavailable coverage. CI failures, leaked values or input mutation are blocking defects.

## Remote execution evidence

[GitHub Actions run 39158163254](https://github.com/ancoverai-jpg/ancover-env-presence-checker/actions/runs/39158163254) completed successfully on Windows and Ubuntu, for both Node 22 and Node 24. Each job ran the 13 tests and the example command. Commit a886deca58aee1c408b48a93adca3c1ffc57ace6 contained the initial 21 source files; a fresh public Git clone matched them byte-for-byte with zero differences. This establishes the remote CLI matrix and exact source publication, not full agent runtime compatibility.
