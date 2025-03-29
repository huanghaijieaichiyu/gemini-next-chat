!macro customInstall
  ; 添加Windows Defender排除项的脚本
  ${if} ${FileExists} "$WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe"
    DetailPrint "添加Windows Defender排除项，以防止误报..."
    nsExec::ExecToLog '"$WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" -Command "try { Add-MpPreference -ExclusionPath \"$INSTDIR\" -ErrorAction Stop; Write-Host \"成功添加Windows Defender排除项。\" } catch { Write-Host \"无法添加Windows Defender排除项: $_\" }"'
  ${else}
    DetailPrint "找不到PowerShell，跳过添加Windows Defender排除项。"
  ${endif}

  ; 在安装完成后显示安全说明
  MessageBox MB_ICONINFORMATION|MB_OK "OhMyGemini 安装已完成。$\n$\n注意：某些杀毒软件可能会将此应用标记为潜在风险，这是一个误报。$\n如果遇到此类问题，请参考应用程序目录下的SECURITY.md文件。"
!macroend

!macro customUnInstall
  ; 移除Windows Defender排除项
  ${if} ${FileExists} "$WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe"
    DetailPrint "正在移除Windows Defender排除项..."
    nsExec::ExecToLog '"$WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" -Command "try { Remove-MpPreference -ExclusionPath \"$INSTDIR\" -ErrorAction Stop; Write-Host \"成功移除Windows Defender排除项。\" } catch { Write-Host \"无法移除Windows Defender排除项: $_\" }"'
  ${endif}
!macroend 