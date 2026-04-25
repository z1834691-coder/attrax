#!/usr/bin/env bash
# 在本机「终端.app」中执行（需能交互输入账号/Token），勿在纯自动化环境运行。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> 仓库: $ROOT"
echo "==> 若已配置代理仍连不上，请确认 Hiddify/Clash 已开启，并核对 scutil --proxy 中的 SOCKSPort。"
echo ""

# 仅对 github.com 生效，避免影响其他远程
if ! git config --get http.https://github.com/.proxy >/dev/null 2>&1; then
  PORT="${GITHUB_SOCKS_PORT:-10793}"
  echo "==> 未检测到专用代理，写入默认 SOCKS（端口 $PORT，可通过 GITHUB_SOCKS_PORT 覆盖）"
  git config http.https://github.com/.proxy "socks5h://127.0.0.1:${PORT}"
fi

echo "==> 当前 GitHub 代理: $(git config --get http.https://github.com/.proxy)"
echo ""
echo "接下来将执行: git push -u origin main --force"
echo "若提示登录：Username 填 GitHub 用户名；Password 粘贴 Personal Access Token（非登录密码）。"
echo ""

exec git push -u origin main --force
