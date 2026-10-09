<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Plan rules, limits, prices and flags live only in `src/config/config.ts`; services read from it (single source of truth).
- Mock services in `src/services/*` are the only layer touching localStorage (via `src/lib/storage.ts`) so they can be swapped for real APIs.
- Free QR codes must encode content directly — never an internal redirect — so they never expire.
- Pages are TanStack file routes in `src/routes/` (no `src/pages`), because the framework's router is fixed.
