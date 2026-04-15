---
name: brainstorming-and-planning
description: Guides the transition from a rough idea to a concrete design and technical implementation plan. Use when the user wants to build a new feature, modify existing behavior, or needs architectural advice before writing any code.
---

# Brainstorming & Planning

This skill enforces a "Design-First" methodology. You must never touch code or scaffold a project until a Design Spec is approved and an Implementation Plan is written.

## When to use this skill
- Before starting any new feature or project.
- When modifying existing complex behavior.
- When the user's request is vague or high-level.

## Phase 1: Brainstorming (The Socratic Design)
Refine rough ideas through natural dialogue before settling on an implementation.

1. **Context Discovery**: Check current files, documentation, and recent git history.
2. **Clarifying Questions**: Ask questions one at a time. Focus on Purpose, Constraints, and Success Criteria.
3. **Propose Approaches**: Suggest 2-3 technical approaches with trade-offs. Recommend one.
4. **Present Design Sections**: Present the architecture in readable chunks (max 300 words). Ask for approval after each section.
5. **Write Design Doc**: Save approved design to `docs/specs/YYYY-MM-DD-<topic>-design.md`.

## Phase 2: Implementation Planning (Bite-Sized Engineering)
Once the design is approved, break the work into hyper-focused, executable tasks.

1. **Mapping**: Identify every file to be created or modified.
2. **Task Granularity**: Each task must be a 2-5 minute action.
3. **No Placeholders**: Never use "TBD", "implement logic here", or "add error handling". Provide the exact code.
4. **TDD Workflow**: Every task should follow:
    - Write the failing test.
    - Run it to verify the failure.
    - Write the minimal code to pass.
    - Run the test to verify success.
    - Commit.
5. **Write Plan Doc**: Save to `docs/plans/YYYY-MM-DD-<feature-name>.md`.

## The "Hard Gate" Rule
> [!IMPORTANT]
> Do NOT write any application code or create folders until the user has reviewed and said "Approved" to the final Spec and Plan documents.

## Resource Templates

### Implementation Plan Header
```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence goal]
**Architecture:** [Brief summary]
**Tech Stack:** [Tools/Libraries]

---

### Task 1: [Component Name]
**Files:** `src/components/File.tsx`
- [ ] Step 1: Write failing test in `tests/File.test.tsx`
- [ ] Step 2: Run `npm test` (Verify Fail)
- [ ] Step 3: Implement minimal logic in `src/components/File.tsx`
- [ ] Step 4: Run `npm test` (Verify Pass)
- [ ] Step 5: `git commit -m "feat: init component"`
```

## Transition to Execution
After the plan is saved, ask the user:
- "Plan saved. Should I execute this myself task-by-task, or would you like to handle the implementation?"
