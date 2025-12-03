#!/bin/bash

# Publish script for jskit monorepo packages
# Usage: ./scripts/publish.sh [package-name] [--dry-run] [--otp=<code>]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if npm is logged in
if ! npm whoami &> /dev/null; then
    echo -e "${RED}Error: You are not logged in to npm.${NC}"
    echo "Please run: npm login"
    exit 1
fi

echo -e "${GREEN}✓ Logged in to npm as: $(npm whoami)${NC}"

# Build all packages first
echo -e "\n${YELLOW}Building all packages...${NC}"
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed. Please fix build errors before publishing.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Extract OTP code from arguments
OTP_FLAG=""
for arg in "$@"; do
    if [[ $arg == --otp=* ]]; then
        OTP_FLAG="--otp=${arg#*=}"
    fi
done

# If package name is provided, publish only that package
if [ -n "$1" ] && [ "$1" != "--dry-run" ] && [[ ! "$1" == --otp=* ]]; then
    PACKAGE_DIR="packages/$1"

    if [ ! -d "$PACKAGE_DIR" ]; then
        echo -e "${RED}Error: Package '$1' not found in packages directory${NC}"
        exit 1
    fi

    echo -e "\n${YELLOW}Publishing package: $1${NC}"

    if [ "$2" == "--dry-run" ] || [ "$3" == "--dry-run" ]; then
        cd "$PACKAGE_DIR" && npm publish --dry-run
    else
        cd "$PACKAGE_DIR" && npm publish --access public $OTP_FLAG
    fi
else
    # Publish all packages
    echo -e "\n${YELLOW}Publishing all packages...${NC}"

    DRY_RUN_FLAG=""
    if [ "$1" == "--dry-run" ] || [ "$2" == "--dry-run" ]; then
        DRY_RUN_FLAG="--dry-run"
        echo -e "${YELLOW}Running in dry-run mode${NC}"
    fi

    for package in packages/*/; do
        package_name=$(basename "$package")
        echo -e "\n${YELLOW}Publishing: $package_name${NC}"
        cd "$package"

        if [ -n "$DRY_RUN_FLAG" ]; then
            npm publish --dry-run
        else
            npm publish --access public $OTP_FLAG
        fi

        cd - > /dev/null
    done
fi

echo -e "\n${GREEN}✓ Publishing completed!${NC}"

