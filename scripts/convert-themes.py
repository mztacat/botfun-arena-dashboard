#!/usr/bin/env python3
"""Convert hardcoded dark zinc colors in page.tsx to light/dark responsive classes."""

filepath = "/home/z/my-project/src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# ─── Background replacements (order matters: more specific first) ───
bg_replacements = [
    ("bg-zinc-950/95", "bg-white/95 dark:bg-zinc-950/95"),
    ("bg-zinc-950/90", "bg-white/90 dark:bg-zinc-950/90"),
    ("bg-zinc-950/80", "bg-white/80 dark:bg-zinc-950/80"),
    ("bg-zinc-950", "bg-gray-50 dark:bg-zinc-950"),
    ("bg-zinc-900/80", "bg-gray-100/80 dark:bg-zinc-900/80"),
    ("bg-zinc-900/60", "bg-gray-100/60 dark:bg-zinc-900/60"),
    ("bg-zinc-900/30", "bg-gray-50/50 dark:bg-zinc-900/30"),
    ("bg-zinc-900", "bg-gray-100 dark:bg-zinc-900"),
    ("bg-zinc-800/60", "bg-gray-50 dark:bg-zinc-800/60"),
    ("bg-zinc-800/40", "bg-gray-50/80 dark:bg-zinc-800/40"),
    ("bg-zinc-800", "bg-gray-200 dark:bg-zinc-800"),
]

for old, new in bg_replacements:
    content = content.replace(old, new)

# ─── Border replacements ───
border_replacements = [
    ("border-zinc-800/50", "border-gray-200 dark:border-zinc-800/50"),
    ("border-zinc-800", "border-gray-200 dark:border-zinc-800"),
    ("border-zinc-700", "border-gray-300 dark:border-zinc-700"),
    ("border-zinc-600", "border-gray-400 dark:border-zinc-600"),
]

for old, new in border_replacements:
    content = content.replace(old, new)

# ─── Text replacements ───
text_replacements = [
    ("text-zinc-100", "text-gray-900 dark:text-zinc-100"),
    ("text-zinc-200", "text-gray-800 dark:text-zinc-200"),
    ("text-zinc-300", "text-gray-700 dark:text-zinc-300"),
    ("text-zinc-400", "text-gray-500 dark:text-zinc-400"),
    ("text-zinc-500", "text-gray-400 dark:text-zinc-500"),
    ("text-zinc-600", "text-gray-400 dark:text-zinc-600"),
    ("text-zinc-700", "text-gray-300 dark:text-zinc-700"),
]

for old, new in text_replacements:
    content = content.replace(old, new)

# ─── Hover state replacements ───
hover_replacements = [
    ("hover:bg-zinc-800/60", "hover:bg-gray-100 dark:hover:bg-zinc-800/60"),
    ("hover:bg-zinc-800/40", "hover:bg-gray-50 dark:hover:bg-zinc-800/40"),
    ("hover:bg-zinc-800", "hover:bg-gray-200 dark:hover:bg-zinc-800"),
    ("hover:text-zinc-300", "hover:text-gray-700 dark:hover:text-zinc-300"),
    ("hover:text-zinc-400", "hover:text-gray-500 dark:hover:text-zinc-400"),
    ("hover:text-zinc-200", "hover:text-gray-800 dark:hover:text-zinc-200"),
]

for old, new in hover_replacements:
    content = content.replace(old, new)

# ─── Tabs active state ───
content = content.replace(
    'data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-200',
    'data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-zinc-200'
)

# ─── Skeleton loading ───
content = content.replace(
    'bg-zinc-800" />',
    'bg-gray-200 dark:bg-zinc-800" />'
)
content = content.replace(
    'bg-zinc-900" />',
    'bg-gray-100 dark:bg-zinc-900" />'
)

# ─── Ring in selected agent ───
content = content.replace(
    'ring-1 ring-zinc-600',
    'ring-1 ring-gray-400 dark:ring-zinc-600'
)

# ─── Header button ───
content = content.replace(
    'border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800 h-8',
    'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 h-8'
)

with open(filepath, "w") as f:
    f.write(content)

print("Done! All replacements applied.")