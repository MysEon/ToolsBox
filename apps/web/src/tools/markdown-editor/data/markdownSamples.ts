export const readmeTemplate = `# Project Name

A concise description of what this project does and who it is for.

## Features

- Fast and reliable workflow
- Type-safe implementation
- Accessible, responsive UI
- Clear documentation

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or yarn

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

\`\`\`ts
import { createClient } from './client';

const client = createClient({
  endpoint: 'https://api.example.com',
});
\`\`\`

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| \`endpoint\` | \`string\` | required | API endpoint URL |
| \`timeout\` | \`number\` | \`5000\` | Request timeout in ms |
| \`retries\` | \`number\` | \`2\` | Retry attempts |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

MIT
`;

export const apiDocumentationTemplate = `# API Documentation

Base URL: \`https://api.example.com/v1\`

## Authentication

Send a bearer token with each request:

\`\`\`http
Authorization: Bearer YOUR_API_TOKEN
\`\`\`

## Endpoints

### List Users

\`GET /users\`

Returns a paginated list of users.

#### Query Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| \`page\` | \`number\` | No | Page number, starting at 1 |
| \`limit\` | \`number\` | No | Items per page |
| \`search\` | \`string\` | No | Search by name or email |

#### Example Request

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \\
  "https://api.example.com/v1/users?page=1&limit=20"
\`\`\`

#### Example Response

\`\`\`json
{
  "data": [
    {
      "id": "usr_123",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
\`\`\`

### Create User

\`POST /users\`

Creates a new user.

#### Request Body

\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

## Error Codes

| Status | Meaning |
| --- | --- |
| 400 | Invalid request |
| 401 | Unauthorized |
| 404 | Resource not found |
| 500 | Internal server error |
`;

export const meetingNotesTemplate = `# Meeting Notes

**Date:** 2026-06-09
**Time:** 10:00-11:00
**Location:** Online
**Facilitator:** Your Name

## Attendees

- Alice
- Bob
- Charlie

## Agenda

1. Review previous action items
2. Discuss current progress
3. Identify risks and blockers
4. Define next steps

## Discussion

### Progress Updates

- The core feature is implemented and ready for review.
- Documentation is in progress.
- QA will begin after the next deployment.

### Decisions

> Decision: We will ship the first iteration with fixed split view and revisit drag resizing later.

| Topic | Decision | Owner |
| --- | --- | --- |
| Release scope | Keep MVP focused | Product |
| Testing | Add smoke tests before release | Engineering |

## Action Items

- [ ] Alice: Finalize release notes
- [ ] Bob: Prepare QA checklist
- [ ] Charlie: Update stakeholder timeline

## Risks / Blockers

- Dependency installation may affect CI cache.
- Some edge cases require manual browser validation.

## Next Meeting

**Date:** 2026-06-16
**Agenda:** Release readiness review
`;

export const changelogTemplate = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project follows semantic versioning.

## [Unreleased]

### Added

- Markdown editor with live preview.
- HTML export workflow.
- Syntax-highlighted code blocks.

### Changed

- Improved toolbar layout for mobile screens.

### Fixed

- Sanitized rendered HTML before preview injection.

## [1.2.0] - 2026-06-09

### Added

- New developer productivity tools.
- Shared toolkit components for tool pages.

### Changed

- Refined ToolsBox visual theme with stronger glass panels.

## [1.1.0] - 2026-05-20

### Added

- Regex tester templates.
- Text statistics utilities.

## [1.0.0] - 2026-05-01

### Added

- Initial public release.
`;

export interface MarkdownSample {
  id: string;
  label: string;
  value: string;
}

export const markdownSamples: MarkdownSample[] = [
  { id: 'readme', label: 'README 模板', value: readmeTemplate },
  { id: 'api-docs', label: 'API 文档模板', value: apiDocumentationTemplate },
  { id: 'meeting-notes', label: '会议纪要模板', value: meetingNotesTemplate },
  { id: 'changelog', label: '更新日志模板', value: changelogTemplate },
];
