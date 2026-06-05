---
name: find-skills
description: Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.
---

# Find Skills

This skill helps you discover and install skills from the open agent skills ecosystem.

## When to Use This Skill

Use this skill when the user:

- Asks "how do I do X" where X might be a common task with an existing skill
- Says "find a skill for X" or "is there a skill for X"
- Asks "can you do X" where X is a specialized capability
- Expresses interest in extending agent capabilities
- Wants to search for tools, templates, or workflows
- Mentions they wish they had help with a specific domain (design, testing, deployment, etc.)

## Skill Installation Path for Trae

Skills for Trae should be installed to: `.trae/skills/<skill-name>/`

Each skill needs a `SKILL.md` file inside its directory.

## How to Search for Skills

**Browse skills at:** https://skills.sh/

### Step 1: Understand What They Need

When a user asks for help with something, identify:

1. The domain (e.g., React, testing, design, deployment)
2. The specific task (e.g., writing tests, creating animations, reviewing PRs)
3. Whether this is a common enough task that a skill likely exists

### Step 2: Check the Leaderboard First

Check the [skills.sh leaderboard](https://skills.sh/) to see if a well-known skill already exists for the domain. The leaderboard ranks skills by total installs, surfacing the most popular and battle-tested options.

For example, top skills for web development include:
- `vercel-labs/agent-skills` — React, Next.js, web design (100K+ installs each)
- `anthropics/skills` — Frontend design, document processing (100K+ installs)

### Step 3: Search for Skills Online

Search the web for the skill you need. Common sources:

- `anthropics/skills` - Official Anthropic skills repository
- `vercel-labs/skills` - Vercel's skill collection
- `skills.sh` - Skill marketplace

### Step 4: Verify Quality Before Recommending

**Do not recommend a skill based solely on search results.** Always verify:

1. **Install count** — Prefer skills with 1K+ installs. Be cautious with anything under 100.
2. **Source reputation** — Official sources (`vercel-labs`, `anthropics`, `microsoft`) are more trustworthy than unknown authors.
3. **GitHub stars** — Check the source repository. A skill from a repo with <100 stars should be treated with skepticism.

### Step 5: Present Options to the User

When you find relevant skills, present them to the user with:

1. The skill name and what it does
2. The source repository and quality indicators
3. A link to learn more at skills.sh or GitHub

Example response:

```
I found a skill that might help! The "react-best-practices" skill provides
React and Next.js performance optimization guidelines from Vercel Engineering.

To install it for Trae, I can create the skill in your .trae/skills directory.
Would you like me to proceed?
```

### Step 6: Install the Skill for Trae

If the user wants to proceed, install the skill to `.trae/skills/`:

```bash
mkdir -p .trae/skills/<skill-name>
```

Then fetch the SKILL.md content from the source repository and write it to:

```
.trae/skills/<skill-name>/SKILL.md
```

## Common Skill Categories

When searching, consider these common categories:

| Category | Example Queries |
| --------------- | ---------------------------------------- |
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing | testing, jest, playwright, e2e |
| DevOps | deploy, docker, kubernetes, ci-cd |
| Documentation | docs, readme, changelog, api-docs |
| Code Quality | review, lint, refactor, best-practices |
| Design | ui, ux, design-system, accessibility |
| Productivity | workflow, automation, git |

## Tips for Effective Searches

1. **Use specific keywords**: "react testing" is better than just "testing"
2. **Try alternative terms**: If "deploy" doesn't work, try "deployment" or "ci-cd"
3. **Check popular sources**: Many skills come from `vercel-labs/agent-skills` or `anthropics/skills`

## When No Skills Are Found

If no relevant skills exist:

1. Acknowledge that no existing skill was found
2. Offer to help with the task directly using your general capabilities
3. Suggest the user could create their own skill

To create a custom skill for Trae:

```bash
mkdir -p .trae/skills/<skill-name>
```

Then create `.trae/skills/<skill-name>/SKILL.md` with this format:

```markdown
---
name: "<skill-name>"
description: "<what the skill does> Invoke when <when to use it>"
---

# Skill Title

<Detailed instructions>
```
