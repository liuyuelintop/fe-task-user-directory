# Communication Scripts

> **Audience:** Live coding interviews  
> **Use when:** You want ready-made phrasing for each phase of the build  
> **Prep time:** 5 minutes to skim, longer to internalize

Speak out loud as you code to keep interviewers aligned with your plan.

## Kickoff (0–5 min)

```
"Let me clarify the requirements quickly: fetch users, show them in a grid,
and provide search plus nationality filters. I'll scaffold Next.js with React
Query, implement the data layer, build everything in one component, then
extract and polish if time allows. Search + filter will combine with AND logic.
Sound good before I dive in?"
```

## Data Layer (5–15 min)

```
"I'm defining a minimal User interface—id, name variants, email, picture, nationality.
React Query handles server state, so I’m creating a fetch helper that transforms
the API response inline and seeding the request to keep data stable. That keeps
favorites reliable later."
```

## Working UI (15–35 min)

```
"Everything lives in UserDirectory for now so I can prove the flow end to end.
useMemo keeps filtering cheap, and I’m using simple includes-based search to
avoid regex pitfalls. Once this works, I'll extract components."
```

## Testing Checkpoint (~35 min)

```
"Quick test run: search, filter, combine both, empty state, responsive layout.
Everything passes, so I have ~15 minutes left. I can either extract components
or add the favorites feature—any preference before I continue?"
```

## Refinement (35–50 min)

```
"Extracting UserCard makes the list composable. For favorites I’m using a
useFavorites hook that persists IDs in localStorage. Stability comes from the
seeded API and intersecting stored IDs with the currently loaded users."
```

## Final Review (50–60 min)

```
"Final sweep: the directory fetches 50 seeded users, supports search + filters,
and favorites persist between refreshes. I'd spend more time on validation,
component extraction for inputs, accessibility, and retry strategy if this were
production."
```

### Cross-links

- Need deeper talking points? Open the [Senior Playbook](senior-playbook.md).  
- Want a fundamentals-first tone? Use the [Junior Playbook](junior-playbook.md).  
- Preparing for speed drills? Pair this with the [Rapid Prototyping Guide](rapid-prototyping.md).
