---
name: maintaining-brand-identity
description: Provides the single source of truth for brand guidelines, design tokens, technology choices, and voice/tone. Use this whenever generating UI components, styling applications, writing copy, or creating user-facing assets to ensure brand consistency.
---

# Brand Identity & Guidelines

**Brand Name:** RIVAL™

This skill defines the core constraints for visual design and technical implementation for the brand. You must adhere to these guidelines strictly to maintain consistency.

## When to use this skill
- When generating UI components or styling applications.
- When writing marketing copy, error messages, or documentation.
- When establishing the technical stack for a new feature or project.
- When creating user-facing assets or assets requiring brand consistency.

## Workflow
1. **Identify the Task:** Determine if you are working on Visual Design, Coding, or Copywriting.
2. **Consult Resources:** Read the specific file in `resources/` corresponding to your task.
3. **Apply Tokens:** Use design tokens from `resources/design-tokens.json` for all styling.
4. **Follow Stack:** Adhere to the `resources/tech-stack.md` for framework and implementation rules.
5. **Match Tone:** Verify all text against `resources/voice-tone.md`.

## Reference Documentation

Depending on the task you are performing, consult the specific resource files below. Do not guess brand elements; always read the corresponding file.

### For Visual Design & UI Styling
If you need exact colors, fonts, border radii, or spacing values, read:
👉 **[`resources/design-tokens.json`](resources/design-tokens.json)**

### For Coding & Component Implementation
If you are generating code, choosing libraries, or structuring UI components, read the technical constraints here:
👉 **[`resources/tech-stack.md`](resources/tech-stack.md)**

### For Copywriting & Content Generation
If you are writing marketing copy, error messages, documentation, or user-facing text, read the persona guidelines here:
👉 **[`resources/voice-tone.md`](resources/voice-tone.md)**
