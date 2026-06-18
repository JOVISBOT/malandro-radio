#!/usr/bin/env bash
# Deploy the Malandro Radio PWA to GitHub Pages (public, free, permanent).
# PREREQ: a valid GitHub login -> run once:  gh auth login -h github.com
# Then run this script. It creates the repo, pushes, enables Pages, prints the public URL.
set -e
REPO="malandro-radio"
cd "$(dirname "$0")"

OWNER=$(gh api user --jq .login)
echo "Deploying as: $OWNER"

# 1. create the public repo from this folder and push main
gh repo create "$REPO" --public --source=. --remote=origin --push

# 2. enable GitHub Pages from main / (root)
echo '{"source":{"branch":"main","path":"/"}}' | gh api -X POST "repos/$OWNER/$REPO/pages" --input - \
  || echo '{"source":{"branch":"main","path":"/"}}' | gh api -X PUT "repos/$OWNER/$REPO/pages" --input - \
  || true

echo ""
echo "DONE. Public app URL (live in ~1-2 min):"
echo "   https://$OWNER.github.io/$REPO/"
echo "Open it on a phone -> Share -> Add to Home Screen."
