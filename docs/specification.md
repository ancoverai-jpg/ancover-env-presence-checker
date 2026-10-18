# Environment presence checker — specification before implementation

Status: proposed experimental 0.1.0, 2026-10-18. This narrows the existing environment-contract candidate; it is not a duplicate portfolio idea.

Problem and evidence: developers and agents can expose credentials while collecting configuration diagnostics. Three primary reports from distinct authors in Docker Compose and Claude Code are recorded in evidence.json. They support the narrow troubleshooting task, not a claim to fix those upstream tools. Two Claude reports are closed historical evidence; no current upstream vulnerability is asserted. Independence is an editorial judgment, not proof of market size.

Primary user: developer or platform maintainer checking a declared set of required variables before startup or sharing a names-only issue report. Flow: review a JSON contract containing variable names → select an explicit dotenv file or the current process → run offline CLI → receive MISSING, EMPTY, PRESENT or UNRESOLVED states without values → fix configuration locally and rerun.

Inputs: a contract with required and optional arrays, and either an explicit env file or an explicit --process flag. Output: JSON states and counts, plus exit status. Permissions: read only selected files or selected process environment keys; no network, shell evaluation, target execution or writes. Names are metadata and may themselves be sensitive; review them before sharing.

Scope: ASCII uppercase variable identifiers, at most 128 declared keys, single-line dotenv assignments, optional export prefix, literal quoted/unquoted values, duplicate detection, fixed input size limits and fail-closed syntax errors. Empty means zero-length or whitespace-only after parsing. Dollar substitutions are reported UNRESOLVED for file input, never evaluated. Process mode checks only explicitly declared names, with underlying OS lookup semantics. No environment enumeration.

Exclusions: full dotenv compatibility, multiline values, value validation, escaping semantics, Docker Compose precedence/resolution, secret redaction of arbitrary text, authentication checks, deployment and security certification. Files are inspected as stable local snapshots, not inside a hostile-filesystem sandbox.

Alternatives: [dotenv-safe](https://github.com/rolodato/dotenv-safe) already loads and validates required variables and should be preferred for application startup enforcement; [dotenv-linter](https://github.com/dotenv-linter/dotenv-linter) checks env files and has a comparison workflow; shell presence tests are adequate for a few names. Proposed modest gap: a cross-stack agent workflow producing a fixed names-only report from an explicit contract, without injecting values into the caller or adding runtime dependencies. This is not a new security scanner. Competitive gap confidence is low-to-medium; field adoption remains unmeasured.

Architecture: one canonical Skill plus Node.js standard-library CLI, portable/Codex/Claude manifests and a public source repository. Separate from the portability checker because it has a different task, audience and maintenance contract. No MCP server needed.

Acceptance: missing and empty required names fail; optional absence is visible but does not fail; non-empty values pass; invalid contracts/duplicate keys/unsupported multiline syntax return a bounded error with no input echo; substitutions remain unresolved; invalid invocation returns exit 2; user files and environment remain unchanged; only approved key lookups occur; no values, lengths, hashes or paths appear in reports/errors. Normal findings exit 1; full required presence exit 0.

Evaluation predeclared: synthetic fixture contains one present credential sentinel, one empty and one missing required key. Compare a naive existence-only file check with the CLI's three expected states; inspect stdout/stderr for the sentinel, its prefix, length and digest. This is fixture coverage, not an agent A/B productivity or security benchmark. Test file and process modes in clean copies, negative input and install/remove lifecycle. Codex and Claude conversational triggers must be reported separately and may remain NOT_TESTED for an experimental release.

Demo: examples/contract.json plus examples/environment.sample, then an isolated process-mode child populated only with synthetic values. Maintenance: keep syntax conservative, add regressions for demonstrated failures, triage security before extensions; do not expand to Compose parsing without separately qualified demand. No telemetry, paid APIs or external services.

Editorial prioritization (1–5): pain 4, evidence 4, competitive gap 2, demonstrable value 4, adoption 5, Skill fit 4, enterprise relevance 4, maintenance 4, Ancover fit 5; total 36/45. These are judgments, not measured demand or benefits. Scope is deliberately smaller than the earlier environment diagnosis hypothesis.
