# Publishing Guide for JSKit Monorepo

This guide explains how to publish packages from this monorepo to npm.

## Prerequisites

1. **npm Account**: Make sure you're logged in to npm
   ```bash
   npm login
   ```

2. **npm Scope**: Your packages use the `@shamim-ahmed` scope.
   - All packages have been configured to use your npm username scope
   - Make sure you're logged in to npm: `npm login`
   - You can publish packages under your username scope without creating an organization

## Current Packages

The following packages are configured for publishing:

- `@shamim-ahmed/admin-sidebar` - Admin sidebar hooks
- `@shamim-ahmed/classic-editor` - Classic editor wrapper
- `@shamim-ahmed/colors` - Color management utilities
- `@shamim-ahmed/components` - Reusable components
- `@shamim-ahmed/data` - Data management utilities
- `@shamim-ahmed/fields` - Form fields package

## Publishing Steps

### 1. Build All Packages

Before publishing, ensure all packages are built:

```bash
pnpm build
```

### 2. Publish Individual Package

To publish a specific package:

```bash
cd packages/[package-name]
npm publish
```

Or use the helper script:

```bash
chmod +x scripts/publish.sh
./scripts/publish.sh [package-name]
```

### 3. Publish All Packages

To publish all packages at once:

```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

### 4. Dry Run (Recommended First)

Before actually publishing, test with a dry run:

```bash
./scripts/publish.sh [package-name] --dry-run
# or for all packages:
./scripts/publish.sh --dry-run
```

## Updating Published Packages

When you make changes to your packages and want to publish updates:

### Step 1: Bump Version Number

You need to increment the version number before publishing. Use semantic versioning:
- **patch** (0.0.4 → 0.0.5): Bug fixes, small changes
- **minor** (0.0.4 → 0.1.0): New features, backward compatible
- **major** (0.0.4 → 1.0.0): Breaking changes

**Option A: Use the version bump script (Recommended)**
```bash
# Bump patch version
./scripts/bump-version.sh admin-sidebar patch

# Bump minor version
./scripts/bump-version.sh colors minor

# Bump major version
./scripts/bump-version.sh components major
```

**Option B: Manual version update**
1. Edit `packages/[package-name]/package.json`
2. Update the `version` field (e.g., `"0.0.4"` → `"0.0.5"`)

### Step 2: Build the Package

```bash
# Build all packages
pnpm build

# Or build a specific package
cd packages/[package-name]
pnpm build
```

### Step 3: Publish the Update

```bash
# Publish with OTP code
./scripts/publish.sh [package-name] --otp=YOUR_OTP_CODE

# Or publish all packages
./scripts/publish.sh --otp=YOUR_OTP_CODE
```

### Complete Update Example

```bash
# 1. Bump version
./scripts/bump-version.sh admin-sidebar patch

# 2. Build
pnpm build

# 3. Publish (get OTP from authenticator app)
./scripts/publish.sh admin-sidebar --otp=123456
```

## What Gets Published

Each package publishes only:
- `build/` directory (compiled JavaScript)
- `build-types/` directory (TypeScript definitions)

This is controlled by the `files` field in each package.json.

## Troubleshooting

### "You do not have permission to publish"
- Make sure you own the npm scope/organization
- Check that you're logged in: `npm whoami`

### "Package already exists"
- The version already exists on npm
- Bump the version number in package.json

### Build errors
- Make sure all dependencies are installed: `pnpm install`
- Check TypeScript errors: `pnpm build`

## Notes

- The root `package.json` has `"private": true` - this is correct and prevents accidental publishing of the root
- Each package is independent and can be published separately
- Internal dependencies between packages should reference published versions (not local paths)

