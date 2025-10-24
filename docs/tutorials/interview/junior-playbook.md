# Junior Playbook: Confident Fundamentals

> **Audience:** Junior interviews, bootcamp grads, early career  
> **Use when:** You need to show clarity, fundamentals, and realistic scope  
> **Prep time:** 10 minutes to rehearse your flow

Focus on clean structure, predictable behavior, and communication that proves you can grow into the role.

## Strategy at a glance

1. **Minutes 0–10:** Sketch layout, confirm requirements, scaffold pages.  
2. **Minutes 10–40:** Deliver the core flows — fetch data, render grid, wire search + filter.  
3. **Minutes 40–60:** Polish UX (empty states, loading states) and narrate next steps.

## Patterns that impress without overreaching

### 1. Clean component structure

- Keep `UserDirectory` as the stateful controller.  
- Extract `UserCard` once the list works; pass only the props it needs.  
- Use descriptive class names and comments sparingly for clarity.

### 2. Intentional state management

- Local `useState` for search, filter, tabs.  
- `useMemo` for derived data (`filteredUsers`, `nationalities`).  
- Explain why you skipped heavier tools (“React Query already covers server state for us.”).

### 3. Error handling + empty states

- Loading screen with a single sentence.  
- Friendly error if fetch fails.  
- “No results” message with a “Clear Filters” button.

### 4. Favorites as a stretch goal

- Talk through the plan even if you run out of time.  
- Mention localStorage persistence, deterministic seed, and intersection logic.

## Communication scripts

- **Kickoff:** “I’ll start with types and the data hook, then build one component that handles search + filter before extracting pieces.”  
- **While coding:** “Adding `useMemo` keeps filter work cheap — that matters later when the list grows.”  
- **When stuck:** “I’m seeing a fetch error; I’ll check the network tab and ensure the seed is included.”  
- **Wrap-up:** “Core features are solid. With more time I’d layer favorites, validation, and accessibility polish.”

## Checklist for juniors

- [ ] Align on requirements before typing.  
- [ ] Keep files short; fewer than ~120 lines each.  
- [ ] Avoid premature abstractions or unused helpers.  
- [ ] Call out trade-offs you intentionally made.  
- [ ] End with a quick summary + roadmap (“Next I’d…”).

### Cross-links

- Need deeper answers? Grab the [Technical Q&A](qa.md).  
- Practice time-boxing? Use the [Rapid Prototyping Guide](rapid-prototyping.md).  
- Want talking points for a senior panel? Jump to [Senior Playbook](senior-playbook.md).
