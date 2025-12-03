#!/bin/bash

# Version bump script for jskit monorepo packages
# Usage: ./scripts/bump-version.sh [package-name] [patch|minor|major]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: ./scripts/bump-version.sh [package-name] [patch|minor|major]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/bump-version.sh admin-sidebar patch   # 0.0.4 -> 0.0.5"
    echo "  ./scripts/bump-version.sh colors minor          # 0.0.12 -> 0.1.0"
    echo "  ./scripts/bump-version.sh components major     # 0.0.29 -> 1.0.0"
    exit 1
fi

PACKAGE_NAME=$1
VERSION_TYPE=$2

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}Error: Version type must be 'patch', 'minor', or 'major'${NC}"
    exit 1
fi

PACKAGE_DIR="packages/$PACKAGE_NAME"

if [ ! -d "$PACKAGE_DIR" ]; then
    echo -e "${RED}Error: Package '$PACKAGE_NAME' not found in packages directory${NC}"
    exit 1
fi

PACKAGE_JSON="$PACKAGE_DIR/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
    echo -e "${RED}Error: package.json not found in $PACKAGE_DIR${NC}"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./$PACKAGE_JSON').version")

# Bump version using npm version command
cd "$PACKAGE_DIR"
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
cd - > /dev/null

# Remove the 'v' prefix if present
NEW_VERSION=${NEW_VERSION#v}

echo -e "${GREEN}✓ Version bumped: $CURRENT_VERSION -> $NEW_VERSION${NC}"
echo -e "${YELLOW}Package: @shamim-ahmed/$PACKAGE_NAME${NC}"
echo ""
echo "Next steps:"
echo "1. Build the package: pnpm build"
echo "2. Publish: ./scripts/publish.sh $PACKAGE_NAME --otp=<code>"

