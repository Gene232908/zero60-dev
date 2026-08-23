# components/ui — ownership seam

`Container` (the editorial shell) is Developer 1's, because the landing sections
and the 063 Society page depend on it.

**The rest of this folder is Developer 2's Milestone 1 task:**

> "Build the shared small components on the tokens: buttons, section headings, dividers" —
> Task Division Rev 2, p.2, Developer 2 (EASY)

So `Button`, `SectionHeading`, `Divider`, `Badge` and `Tag` are **not** built here.
Developer 1 does not build Developer 2's tasks (Task Division Rev 2, p.6:
"Do not review or correct the other developer's tasks. Each task has one owner.").

Anything added here must consume the tokens in `styles/tokens.css` and compose
motion from `components/motion` — never hand-rolled animation.

Note: `MagneticButton` lives in `components/motion` rather than here. It is a
motion primitive from the shared library (docs/plan.md §2.4), not a small UI atom.
