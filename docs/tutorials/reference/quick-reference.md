# Quick Reference

> **Audience:** During builds when you need syntax reminders  
> **Use when:** You want fast snippets without re-reading tutorials  
> **Prep time:** 2 minutes to skim

## Setup essentials

```bash
npx create-next-app@latest user-directory --typescript --tailwind --app --no-src
cd user-directory
npm install @tanstack/react-query
npm run dev
```

## React snippets

```tsx
const [items, setItems] = useState<Item[]>([]);
const addItem = (item: Item) => setItems(prev => [...prev, item]);
const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));

useEffect(() => {
  let ignore = false;
  async function load() {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch');
    if (!ignore) setItems(await response.json());
  }
  load().catch(console.error);
  return () => {
    ignore = true;
  };
}, []);
```

## Tailwind layout cheats

- Container: `container mx-auto px-4 py-8`  
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`  
- Flex rows: `flex flex-col sm:flex-row gap-4`  
- Card: `rounded-lg border border-gray-200 bg-white p-6 shadow-sm`

## Component templates

```tsx
export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <article className="rounded-lg border bg-white p-6 shadow-sm">
      {title ? <h3 className="mb-3 text-lg font-semibold">{title}</h3> : null}
      {children}
    </article>
  );
}

export function Button({
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return <button className={`rounded-lg px-4 py-2 font-medium transition ${styles}`} {...props} />;
}
```

## Timebox reminders

- 0–5 min: scaffold + install.  
- 5–15 min: data layer.  
- 15–35 min: core UI.  
- 35–45 min: test + fix.  
- 45–55 min: polish/favorites.  
- 55–60 min: narrative + recap.

### Cross-links

- Need the full build? Start at [Core Index](../core/index.md).  
- Want practice reps? Grab the [User Directory Drill](user-directory-drill.md).  
- Looking for design system notes? Check [Tailwind Design System](../systems/tailwind-design-system.md).
