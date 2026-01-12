import { platform } from 'os';
import { spawn } from 'child_process';

export function sendNotification(title, message, type = 'info') {
  const isWindows = platform() === 'win32';
  const isMac = platform() === 'darwin';
  
  if (isWindows) {
    const script = `
      Add-Type -AssemblyName System.Windows.Forms
      $notification = New-Object System.Windows.Forms.NotifyIcon
      $notification.Icon = [System.Drawing.SystemIcons]::Information
      $notification.BalloonTipTitle = "${title}"
      $notification.BalloonTipText = "${message}"
      $notification.Visible = $true
      $notification.ShowBalloonTip(5000)
      Start-Sleep -Seconds 6
      $notification.Dispose()
    `;
    
    spawn('powershell', ['-Command', script], {
      stdio: 'ignore',
      detached: true
    }).unref();
  } else if (isMac) {
    spawn('osascript', [
      '-e',
      `display notification "${message}" with title "${title}"`
    ], {
      stdio: 'ignore',
      detached: true
    }).unref();
  } else {
    spawn('notify-send', [title, message], {
      stdio: 'ignore',
      detached: true
    }).unref();
  }
}
