#!/usr/bin/env python3
"""Insert the managed nginx snippet into every server block for a domain.

Usage: nginx_insert.py <vhost.conf> <snippet.conf>

The snippet goes immediately after the matching `server_name` line so its
regex locations win over the generic asset rules aaPanel adds further down.

Idempotent: blocks that already contain the marker are left alone.
"""
import re
import sys

MARKER = "MakeMyQRCode SEO + caching rules"
DOMAIN = "makemyqrcode.com"


def server_blocks(text):
    """Return [(start, end)] for each top-level `server { ... }` block."""
    blocks = []
    pattern = re.compile(r"\bserver\s*\{")
    pos = 0
    while True:
        m = pattern.search(text, pos)
        if not m:
            break
        depth = 0
        quote = None
        i = m.end() - 1  # index of "{"
        end = None
        while i < len(text):
            ch = text[i]
            if quote:
                if ch == "\\":
                    i += 2
                    continue
                if ch == quote:
                    quote = None
            elif ch in "\"'":
                quote = ch
            elif ch == "#":
                nl = text.find("\n", i)
                i = len(text) if nl == -1 else nl
                continue
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i
                    break
            i += 1
        if end is None:
            break
        blocks.append((m.start(), end))
        pos = end + 1
    return blocks


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: nginx_insert.py <vhost.conf> <snippet.conf>")

    conf_path, snippet_path = sys.argv[1], sys.argv[2]
    text = open(conf_path, encoding="utf-8").read()
    snippet = open(snippet_path, encoding="utf-8").read().strip("\n")

    blocks = server_blocks(text)
    if not blocks:
        sys.exit("ERROR: no `server { }` block found - is this the right file?")

    targets, already = [], 0
    for start, end in blocks:
        body = text[start:end]
        if not re.search(r"server_name[^;]*" + re.escape(DOMAIN), body):
            continue
        if MARKER in body:
            already += 1
            continue
        # Skip pure redirect blocks (listen 80 -> 301): they never serve files.
        if "root " not in body and "proxy_pass" not in body and "listen 443" not in body:
            continue
        name = re.search(r"server_name[^;]*;", body)
        if not name:
            continue
        targets.append((start + name.end(), end))

    if not targets:
        if already:
            print(f"Already applied to {already} block(s); nothing to do.")
            return
        sys.exit(f"ERROR: no serving server block for {DOMAIN} found.")

    indent = "    "
    payload = "\n".join(indent + line if line.strip() else "" for line in snippet.splitlines())
    payload = "\n" + payload + "\n"

    for insert_at, _end in sorted(targets, reverse=True):
        text = text[:insert_at] + payload + text[insert_at:]

    open(conf_path, "w", encoding="utf-8").write(text)
    print(f"Inserted snippet into {len(targets)} block(s); skipped {already} already-applied.")


if __name__ == "__main__":
    main()
