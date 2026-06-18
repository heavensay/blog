#!/usr/bin/env bash

set -e

SRC="store/blog-content"
DST="generated-content"

echo "Cleaning generated content..."
rm -rf "$DST"

echo "Copy content..."
mkdir -p "$DST"
cp -R "$SRC"/. "$DST"

echo "Generate _index.md ..."

find "$DST" -type d | while read -r dir; do

    # 跳过附件目录
    if echo "$dir" | grep -q "/attachments\|/images\|/attach-files"; then
        continue
    fi

    index="$dir/_index.md"

    if [ ! -f "$index" ]; then
        title=$(basename "$dir")

        cat > "$index" <<EOF
---
title: "$title"
cascade:
  type: docs
---

EOF

        echo "Generated: $index"
    fi
done

echo "Done."