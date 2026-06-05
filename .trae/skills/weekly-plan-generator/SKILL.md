---
name: "weekly-plan-generator"
description: "Generates weekly study plans based on class schedule CSV and diary entries. Invoke when user provides weekly schedule and asks for study planning, or says '帮我规划这周计划'."
---

# Weekly Plan Generator

## Overview

This skill generates comprehensive weekly study plans by:
1. Parsing the user's class schedule CSV file
2. Analyzing diary entries for goals, exams, and events
3. Creating time-block schedules that integrate classes with study time
4. Saving plans as local JSON files
5. Syncing to Supabase database

## When to Use

Invoke this skill when:
- User provides a new weekly class schedule
- User says "帮我规划这周计划" or "规划下周"
- User wants to update their weekly plan
- User provides diary entries with new goals or events

## Required Inputs

1. **Class Schedule CSV**: Located in `diary/` folder (e.g., `大二下13周课表.csv`)
2. **Diary Files**: Recent diary entries in `diary/` folder
3. **Current Date**: To determine which days are past vs. future

## Plan Generation Rules

### Time Constraints
- Wake up: 08:00
- Sleep: 00:00 (before midnight)
- Continuous time blocks (no gaps)
- Merge consecutive classes (e.g., periods 1-2 into one block)

### Study Time Allocation
- **Before CET-6 exam**: 4+ hours English per day
- **After CET-6 exam**: 4-6 hours daily for long-term goals
  - English (IELTS prep): 2h/day
  - AI learning: 1h/day
  - Quantitative investment: 1h/day
  - C++/ROS: 1h/day
  - Microcontroller: 30min/day
  - Typing practice: 10min/day
  - Calligraphy: 15min/day
  - Electronic keyboard: 30min/day
  - Mandarin: 30min/day

### Priority Order
1. Classes (fixed, from schedule)
2. Exam preparation (time-sensitive)
3. Long-term goals (daily allocation)
4. Rest/breaks
5. Hobbies/leisure

## Output Format

Generate JSON files saved to `diary/weekly_plans/第X周_YYYYMMDD-YYYYMMDD.json`:

```json
{
  "week": "第X周",
  "dateRange": "YYYY-MM-DD ~ YYYY-MM-DD",
  "weeklyGoals": [...],
  "longTermGoals": [...],
  "dailySchedule": {
    "周一": {
      "date": "YYYY-MM-DD",
      "theme": "...",
      "themeColor": "...",
      "englishTarget": 4,
      "focusGoal": "...",
      "timeBlocks": [
        { "time": "08:00-08:30", "content": "...", "type": "task" },
        { "time": "08:30-10:05", "content": "课程名", "type": "class", "location": "...", "detail": "教师名" }
      ]
    }
  },
  "notes": [...]
}
```

## Time Block Types

| Type | Description | Color Theme |
|------|-------------|-------------|
| `study` | Study sessions | Blue |
| `class` | Classes | Orange |
| `break` | Rest/meals | Green |
| `task` | Tasks/chores | Gray |
| `exam` | Exams | Red |
| `hobby` | Hobbies/music | Purple |

## Workflow Steps

### Step 1: Parse Class Schedule
1. Read the CSV file from `diary/` folder
2. Extract courses with time, day, location, teacher
3. Merge consecutive periods (e.g., 1-2节 → one block)

### Step 2: Analyze Diary Entries
1. Read recent diary files
2. Extract:
   - Upcoming exams with dates
   - Short-term tasks/events
   - Long-term goals
   - User preferences/constraints

### Step 3: Generate Weekly Plan
1. Create time blocks for each day:
   - Start with classes (fixed)
   - Fill gaps with study sessions
   - Add breaks, meals, tasks
   - Ensure no time gaps
2. Set weekly goals and themes
3. Add notes for important events

### Step 4: Save Local File
1. Create `diary/weekly_plans/` directory if not exists
2. Save JSON file with proper naming
3. Include all required fields

### Step 5: Sync to Supabase
1. Read JSON file
2. Use upsert to update `weekly_plans` table
3. Verify success

## Example Usage

**User Input:**
```
/spec 这是我的第14周课表，帮我规划这周计划
[uploads schedule CSV]
```

**Agent Actions:**
1. Parse CSV → extract class schedule
2. Read diary → find upcoming events
3. Generate plan → create JSON
4. Save file → `diary/weekly_plans/第14周_*.json`
5. Sync → Supabase database
6. Confirm → show summary to user

## Long-term Goals Reference

These are the user's ongoing goals (from diary entries):

1. **English**: CET-6 high score + IELTS prep
2. **AI**: Learn from provided materials
3. **Investment**: Quantitative investment (completed basic course)
4. **Programming**: C++/ROS
5. **Microcontroller**: Development basics
6. **Typing**: Speed improvement
7. **Calligraphy**: Handwriting practice
8. **Music**: Electronic keyboard (newly purchased)
9. **Mandarin**: Improve to Level 2-B

## Notes

- Always verify dates match the correct day of week
- Check CSV file format: columns are 节次, 时间区间, 周一, 周二, etc.
- Mark past days as completed/skipped
- Keep content specific (e.g., "六级仔细阅读2篇" not "做阅读")
- Update both local file AND database
