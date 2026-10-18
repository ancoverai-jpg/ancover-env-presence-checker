# Security and data handling

Experimental 0.1.0. The checker reads explicitly selected input files or declared keys of its launching process. It does not execute target code, evaluate substitutions, enumerate the entire environment, contact a server or write files. Reports omit values, value lengths, prefixes, digests and input paths, but retain approved variable names. Review names before sharing them.

This is not a security boundary against a compromised host, malicious Node runtime, hostile concurrently changing filesystem or debugger. Input parsing is conservative and size-bounded. The script is not an arbitrary-output redaction engine and cannot prevent other tools exposing secrets. Presence is not credential validity or deployment readiness.

Never put real credentials in public issues. Provide a minimal synthetic fixture for non-sensitive bugs. A confidential reporting channel will be claimed only after GitHub private vulnerability reporting has actually been enabled. No response SLA is promised. There are no third-party runtime dependencies. Review source changes before running updates.
