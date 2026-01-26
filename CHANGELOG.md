# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-22

### Added
- Initial release of Git Agent
- AI-powered commit message generation using Claude AI
- Interactive commit workflow with `git-agent commit`
- Configuration wizard with `git-agent init`
- Secrets detection (API keys, passwords, tokens, sensitive files)
- TODO/FIXME detection in staged changes
- Branch name suggestions based on file changes
- GitHub PR creation integration
- Jira ticket integration
- Reviewer suggestions based on git history
- Change analysis and file grouping
- Support for conventional commits format
- Multi-model support (Claude Sonnet 4, Opus 4.5, Haiku)

### Security
- Automatic detection of sensitive files (.env, credentials, keys)
- Pattern-based secret scanning in diffs
- Prevention of accidental secret commits

## [Unreleased]

### Planned
- ESLint integration
- Pre-commit hook support
- Custom commit message templates
- Team configuration sharing
