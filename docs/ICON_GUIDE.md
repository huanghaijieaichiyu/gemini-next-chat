# 图标替换指南

要更改 OhMyGemini 应用程序的图标，请按照以下步骤操作：

## 图标要求

OhMyGemini 需要以下格式和尺寸的图标：

- Windows: .ico 文件 (建议 256x256 像素)
- macOS: .icns 文件 (多尺寸图标集合)
- Linux: 多个 .png 文件 (32x32, 128x128, 128x128@2x)

## 图标替换步骤

1. 准备您的图标文件：
   - 设计或选择您喜欢的图标
   - 将图标转换为所需格式（可使用在线工具如 [ConvertICO](https://convertico.com/)）

2. 替换图标文件：
   - 将图标文件放入 `src-tauri/icons/` 目录，替换现有文件：
     - icon.ico (Windows 图标)
     - icon.icns (macOS 图标)
     - 32x32.png (小尺寸图标)
     - 128x128.png (中尺寸图标)
     - 128x128@2x.png (高分辨率图标)

3. 构建应用：
   - 使用 `npm run build:dist` 命令重新构建应用
   - 新图标将在构建过程中自动应用

## 图标设计建议

- 使用简洁、易识别的设计
- 确保图标在小尺寸下仍清晰可见
- 使用与应用主题一致的配色
- 考虑在暗色和亮色背景下的图标可见性

## 在线图标工具

- [Figma](https://www.figma.com/) - 设计图标
- [ConvertICO](https://convertico.com/) - 转换为 .ico 格式
- [iConvert](https://iconverticons.com/) - 转换为 .icns 格式
- [AppIcon](https://appicon.co/) - 生成多尺寸图标 