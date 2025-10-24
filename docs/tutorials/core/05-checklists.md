# Checkpoints & Checklists

> **Audience:** Interview run-through, retrospective review  
> **Time:** 5 minutes  
> **Prereqs:** Finished Phases 0–3 once

Stay on schedule and confirm the app is demo-ready.

## Time Checkpoints

- **Minute 5:** Project created, dependencies installed, dev server running.  
- **Minute 15:** Types, API function, and `useUsers` ready.  
- **Minute 25:** `UserDirectory` renders data with search + filter.  
- **Minute 35:** ✅ Everything working; pause to test.  
- **Minute 40:** UserCard extracted (optional).  
- **Minute 50:** Favorites added (optional).  
- **Minute 60:** Final review complete.

If you slip:
- Skip extraction; keep logic in `UserDirectory`.
- Defer favorites until after the interview.
- Spend remaining time validating core flows and narrating trade-offs.

## Manual Test Script

1. Page loads with 50 users.  
2. Search matches case-insensitive names.  
3. Nationality filter narrows results; reset to “All”.  
4. Combine search + filter (AND logic).  
5. Force no results and trigger the empty state.  
6. Click “Clear Filters” to reset state.  
7. Resize the viewport to confirm responsive grid behavior.  
8. (Optional) Toggle favorites; verify badge, tab, and persistence.

## Success Criteria

**Must have (35 min)**
- Users display in a responsive grid.  
- Search + nationality filter work together.  
- Loading, error, and empty states covered.  
- No TypeScript errors or failing builds.

**Should have (50 min)**
- UserCard extracted.  
- Favorites tab works and persists.  
- Code remains readable and free of `any` (except the API transform).

**Nice to have (60 min)**
- Extracted search/filter components.  
- Custom `useUserFilter` hook.  
- Enhanced error handling and accessibility notes.

## Before You Present

- Run through the manual test script.  
- Skim for stray `console.log` statements or unused imports.  
- Note trade-offs you intentionally made (validation, retries, a11y).  
- Open [Interview Communication Scripts](../interview/communication-scripts.md) if you want canned phrasing.

### Next

- Ready for more reps? See [Next Steps](06-next-steps.md).  
- Hitting bugs? Jump to [Troubleshooting](../troubleshooting/common-issues.md).*** End Patch
