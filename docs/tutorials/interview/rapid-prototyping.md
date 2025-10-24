# Rapid Prototyping Survival Guide

> **Audience:** Time-boxed interviews, hackathons  
> **Use when:** You must deliver value in 60 minutes or less  
> **Prep time:** 10 minutes to review the cadence

## 80/20 priorities

Focus your energy on:
- Working functionality and clear UX.  
- Lightweight styling via Tailwind utility classes.  
- Deterministic data + basic error handling.  
- Narrating trade-offs as you go.

Defer until after demo:
- Perfect architecture or over-abstraction.  
- Edge-case coverage.  
- Heavy animations or polish.

## 60-minute rhythm

| Minutes | Focus | Checklist |
| --- | --- | --- |
| 0–5 | Scaffold | Create app, install deps, run `npm run dev`. |
| 5–15 | Plan & data | Sketch layout, define types, implement fetch/hook. |
| 15–35 | Core UI | Build the feature vertically (one component is fine). |
| 35–45 | Testing & fixes | Manual test script, address blockers. |
| 45–55 | Polish | Extract key components, add favorites/bonus if time. |
| 55–60 | Present | Summarize results, outline next steps. |

## Emergency code patterns

```tsx
function QuickList<T extends { id: string }>({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: T[];
  onSelect?: (item: T) => void;
}) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </header>
      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className="cursor-pointer rounded border px-3 py-2 hover:bg-gray-50"
            onClick={() => onSelect?.(item)}
          >
            {JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Keep handlers inline when speed matters:

```tsx
const [items, setItems] = useState<Item[]>([]);
const addItem = (item: Item) => setItems(prev => [...prev, item]);
const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));
```

## Decision cheatsheet

- **Tech choices (30 sec):** Prioritize tools you already know; pick React Query for server state.  
- **Architecture (1 min):** Build vertically first; refactor only if time allows.  
- **Styling (30 sec):** Start with Tailwind primitives, add design-system tokens later.

## Practice exercises

- **30 min:** Simple todo list — CRUD + basic styling.  
- **45 min:** User directory — search + filter + presentable UI.  
- **60 min:** E-commerce grid — sorting, filtering, empty states.

Wrap each exercise with a quick retro: what went well, what slowed you down, what to strip/add next run.

### Cross-links

- Need scripts while you talk? See [Communication Scripts](communication-scripts.md).  
- Want deeper polish prompts? Jump to [Senior Playbook](senior-playbook.md).
