#!/usr/bin/env python3
"""Fix double dark:bg- prefixes in page.tsx"""

filepath = "/home/z/my-project/src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Remove all `dark:bg-gray-*` occurrences (they're artifacts from double-matching)
import re

# Pattern: dark:bg-gray-XXX/YY or dark:bg-gray-XXX followed by space or quote
content = re.sub(r'\s*dark:bg-gray-\d+(?:/\d+)?', '', content)

# Also clean up any remaining `dark:border-gray-*`
content = re.sub(r'\s*dark:border-gray-\d+(?:/\d+)?', '', content)

with open(filepath, "w") as f:
    f.write(content)

print("Cleaned up double dark: prefixes!")