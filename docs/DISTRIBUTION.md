# Distribution Guide

This guide explains how to create distributable installation packages for Gemini Next Chat.

## Prerequisites

Before building the distribution packages, ensure you have the following installed:

- Node.js v18+ (npm will be installed with Node.js)
- Rust and Cargo (for Tauri)
- Platform-specific build tools:
  - Windows: Visual Studio or Visual Studio Build Tools with the "Desktop development with C++" workload
  - macOS: Xcode and Command Line Tools
  - Linux: Required development libraries (varies by distribution)

## Building Distribution Packages

### Using the Build Script

The easiest way to build distribution packages is to use the provided build script:

```bash
# Install dependencies
npm install

# Run the build script
npm run build:dist

# For debug builds
npm run build:dist:debug
```

The script will prompt you to select a target platform (Windows, macOS, Linux, or all platforms).

### Manual Build Process

If you prefer to build manually, you can use the following commands:

1. Build the Next.js application for export:

```bash
npm run build:export
```

2. Build the Tauri application for your specific platform:

```bash
# For Windows
npm run package:windows

# For macOS
npm run package:macos

# For Linux
npm run package:linux

# For all platforms
npm run tauri:build
```

## Output Files

The built packages can be found in the following locations:

- Windows: `src-tauri/target/release/bundle/msi/` or `src-tauri/target/release/bundle/nsis/`
- macOS: `src-tauri/target/release/bundle/dmg/` or `src-tauri/target/release/bundle/macos/`
- Linux: `src-tauri/target/release/bundle/deb/` or `src-tauri/target/release/bundle/appimage/`

## Configuration

The build configuration is defined in:

- `src-tauri/tauri.conf.json`: Tauri configuration for the desktop application
- `next.config.js`: Next.js configuration for the web application
- `package.json`: Build scripts and dependencies

## Customization

You can customize the following aspects of the distribution:

- Application name and details in `src-tauri/tauri.conf.json`
- Icons in `src-tauri/icons/` directory
- Window dimensions and behavior in `src-tauri/tauri.conf.json`
- Platform-specific configurations for Windows, macOS, and Linux

## Troubleshooting

If you encounter issues during the build process:

1. Ensure all development dependencies are installed:
   ```bash
   npm install
   ```

2. If you encounter permission issues, try running with administrator privileges
3. Check the Tauri logs for detailed error messages
4. Try building in debug mode with `npm run build:dist:debug`
5. Verify that your Rust and Node.js environments are properly configured

### Common Issues

1. Missing Rust toolchain:
   ```bash
   rustup update
   ```

2. Missing Visual Studio Build Tools (Windows):
   - Download and install from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Select "Desktop development with C++" workload

3. Build fails with Node.js errors:
   ```bash
   # Clear npm cache and node_modules
   npm cache clean --force
   rm -rf node_modules
   npm install
   ``` 