# OhMyGemini 构建指南

本指南将帮助您完成 OhMyGemini 的构建过程。

## 准备工作

1. **安装 Node.js**
   您已经安装了 Node.js v23.10.0，无需再安装。

2. **安装 Rust 工具链**
   要构建 Tauri 应用，需要安装 Rust：
   - 访问 https://rustup.rs/
   - 下载并运行安装程序
   - 或直接下载 Windows 安装程序：https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe
   - 安装后重启终端并运行 `rustup update`

3. **安装 Visual Studio Build Tools**
   - 访问 https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - 安装时选择 "Desktop development with C++" 工作负载

## 构建步骤

我们已经修复了构建过程中的几个问题：
- 已将 `tauri.conf.json` 中的 pnpm 命令更改为 npm run 命令
- 已修复 openapi-types 类型导入问题
- 已将应用名称更改为 OhMyGemini

### 构建 Next.js 部分

```bash
npm run build:export
```

### 构建桌面应用

安装完 Rust 和 Visual Studio Build Tools 后，运行：

```bash
npm run build:dist
```

然后选择您想要构建的平台（Windows、macOS、Linux 或全部）。

### 快速构建

使用交互式快速构建工具：

```bash
npm run quickbuild
```

该工具会自动检测您的操作系统，并提供适合的构建选项。

## 修改图标

请参考 `docs/ICON_GUIDE.md` 文件，了解如何替换应用图标。

## 输出文件位置

构建完成后，您可以在以下位置找到构建结果：

- Windows: `src-tauri/target/release/bundle/msi/` 或 `src-tauri/target/release/bundle/nsis/`
- macOS: `src-tauri/target/release/bundle/dmg/` 或 `src-tauri/target/release/bundle/macos/`
- Linux: `src-tauri/target/release/bundle/deb/` 或 `src-tauri/target/release/bundle/appimage/`

## 故障排除

如果您在构建过程中遇到问题：

1. 确保已正确安装 Rust 和 Visual Studio Build Tools
2. 检查 Tauri 日志以获取详细错误信息
3. 尝试使用 `npm run build:dist:debug` 进行调试构建 