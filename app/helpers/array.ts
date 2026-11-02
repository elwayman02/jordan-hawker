/**
 * The first `count` items: `{{#each (take posts 3) as |post|}}`.
 *
 * Templates can't call `posts.slice 0 3` (the method loses its array), and "the first few"
 * is all they need from slice.
 */
export function take<T>(items: readonly T[], count: number): T[] {
  return items.slice(0, count);
}
