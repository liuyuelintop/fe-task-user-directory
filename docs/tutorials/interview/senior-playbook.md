# Senior Playbook: Interview-Quality Patterns

> **Audience:** Senior / staff interviews, system design pairing  
> **Use when:** You need to prove you think beyond the MVP  
> **Prep time:** 15–20 minutes to rehearse talking points

Highlight the deliberate engineering choices behind the User Directory and show how you scale it to production rigor.

## Why it matters

Panelists look for more than “it works.” Anchor your story around:

1. **Advanced React practices** — custom hooks, memoization strategy, suspense planning.  
2. **TypeScript discipline** — explicit interfaces, no implicit `any`, narrow props.  
3. **Reliability engineering** — predictable APIs, error boundaries, failure-handling.  
4. **Performance awareness** — render profiling, memoization, bundle control.  
5. **UX polish** — accessibility, responsive grids, meaningful empty states.

## Showcase patterns

### Custom hooks for reuse

```tsx
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiData<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setState({ data: (await response.json()) as T, loading: false, error: null });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setState(prev => ({ ...prev, loading: false, error: (error as Error).message }));
        }
      }
    }

    load();
    return () => controller.abort();
  }, [url]);

  return state;
}
```

Pair the hook with a presentational component to demonstrate separation of concerns and testability.

### Strong typing everywhere

```tsx
interface UserCardProps {
  user: User;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
}

export function UserCard({ user, isFavorite, onToggleFavorite, className }: UserCardProps) {
  return (
    <article className={clsx('rounded-lg border p-6 shadow-sm', className)}>
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{user.name.full}</h3>
        <button
          type="button"
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(user.id)}
          className="rounded-full border px-3 py-1 text-sm"
        >
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </button>
      </header>
      <p className="text-sm text-gray-500">{user.email}</p>
    </article>
  );
}
```

Use this to segue into how you maintain type safety across boundaries (`User` interface, API transform, React Query response).

### Performance, reliability, and UX

- Memoize expensive derivations (`visibleFavoritesCount`, `filteredUsers`) with stable dependency arrays.  
- Control React Query’s refetch behavior (`staleTime`, focus/reconnect) to avoid data drift.  
- Add error boundaries and skeleton states to keep the UI resilient.  
- Normalize state updates with reducers or Zustand when the screen grows.

## Narrative beats (minutes 0–60)

| Minute | Focus | Talking points |
| --- | --- | --- |
| 0–10 | Architecture | “I start with types + hooks so the API contract is stable.” |
| 10–35 | Delivery | “I ship the feature vertical quickly, validating search + filters end to end.” |
| 35–50 | Depth | “Here’s where I extract components, add favorites with intersection logic, and memoize derived state.” |
| 50–60 | Polish | “I’d add suspense boundaries, data validation, and advanced filtering to productionize.” |

## Key differentiators

1. **Intentional architecture** — mention why you separate data fetching, state, and presentation.  
2. **Risk mitigation** — deterministic seed, stable IDs, intersection math to avoid favorites drift.  
3. **Testing mindset** — outline unit tests for hooks, component tests for filters, and integration for favorites.  
4. **Scalability** — describe how you’d paginate, stream, or virtualize lists when user counts grow.  
5. **Accessibility** — highlight keyboard navigation, semantic markup, screen-reader labels.

## Ready-made quotes

- “I’m memoizing the filter pipeline so the list recalculates only when the input changes, keeping renders cheap.”  
- “Disabling focus-based refetch keeps the dataset consistent with local favorites; otherwise, you end up with orphan IDs.”  
- “In production I would wrap the page with an error boundary and fall back to cached favorites while retrying the network.”

### Cross-links

- Need junior positioning instead? Jump to [Junior Playbook](junior-playbook.md).  
- Expect rapid-fire questions? Review [Interview Q&A](qa.md).  
- If the panel pushes on design systems, reference [Tailwind Design System](../systems/tailwind-design-system.md).
