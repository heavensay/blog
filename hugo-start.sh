#!/bin/sh

# 1. 绝对路径探测与对齐
# if [ -d "/src/content/docs" ]; then
#     DOCS_DIR="/src/content/docs"
# else
#     echo "Error: Cannot find content/docs directory."
#     exit 1
# fi

# echo "Scanning directories in: $DOCS_DIR"

# # 2. 遍历物理目录并过滤
# find "$DOCS_DIR" -mindepth 1 -type d | while read -r dir
# do
#     dir_name=$(basename "$dir")
    
#     # 统一转为纯小写进行比对
#     low_name=$(echo "$dir_name" | tr '[:upper:]' '[:lower:]')

#     # 🌟 核心修复：完全去掉反斜杠断行，合并为一行安全判断，绝对不会再报 ec: not found
#     if [ "$low_name" = "image" ] || [ "$low_name" = "images" ] || [ "$low_name" = "asset" ] || [ "$low_name" = "assets" ] || [ "$low_name" = "assert" ] || [ "$low_name" = "asserts" ]; then
#         echo "Skip resource directory: $dir_name"
#         continue
#     fi

#     # 排除以 . 开头的隐藏文件夹
#     case "$dir_name" in
#         .*) continue ;;
#     esac

#     index="$dir/_index.md"

#     # 如果真正的技术文档目录下没有 _index.md，则安全补齐结构壳
#     if [ ! -f "$index" ]; then
#         echo "Auto generate _index.md for: $dir_name"
#         cat <<EOF > "$index"
# ---
# title: "${dir_name}"
# type: "docs"
# layout: "docs"
# ---
# EOF
#     fi
# done

echo "Starting Hugo Server..."

# 3. 启动 Hugo 实时监听
exec hugo server -p 1313 --bind 0.0.0.0 -D --poll 5s
