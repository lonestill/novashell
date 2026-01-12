import { platform, arch, cpus, totalmem, freemem, hostname, userInfo, uptime } from 'os';
import { version } from 'process';
import chalk from 'chalk';

export async function sysinfo(args) {
  const os = platform();
  const osName = getOSName(os);
  const cpuModel = cpus()[0].model.trim();
  const cpuCores = cpus().length;
  const totalMemory = (totalmem() / (1024 ** 3)).toFixed(2);
  const freeMemory = (freemem() / (1024 ** 3)).toFixed(2);
  const usedMemory = ((totalmem() - freemem()) / (1024 ** 3)).toFixed(2);
  const memoryUsage = ((1 - freemem() / totalmem()) * 100).toFixed(1);
  const username = userInfo().username;
  const host = hostname();
  const uptimeSeconds = uptime();
  const uptimeHours = Math.floor(uptimeSeconds / 3600);
  const uptimeMins = Math.floor((uptimeSeconds % 3600) / 60);

  const memoryBar = createBar(parseFloat(memoryUsage), 20);
  const memoryColor = parseFloat(memoryUsage) > 80 ? chalk.red : parseFloat(memoryUsage) > 60 ? chalk.yellow : chalk.green;

  const lines = [
    '',
    chalk.cyan.bold('╭─────────────────────────────────────────╮'),
    chalk.cyan.bold('│') + ' ' + chalk.white.bold('NovaShell System Information') + ' ' + chalk.cyan.bold('│'),
    chalk.cyan.bold('╰─────────────────────────────────────────╯'),
    '',
    chalk.white.bold('System'),
    chalk.gray('  ├─') + chalk.white(' OS:       ') + chalk.green(osName),
    chalk.gray('  ├─') + chalk.white(' Hostname: ') + chalk.green(host),
    chalk.gray('  ├─') + chalk.white(' User:     ') + chalk.green(username),
    chalk.gray('  └─') + chalk.white(' Arch:     ') + chalk.green(arch()),
    '',
    chalk.white.bold('Processor'),
    chalk.gray('  ├─') + chalk.white(' Model: ') + chalk.green(cpuModel.split(' ').slice(0, 4).join(' ') + '...'),
    chalk.gray('  └─') + chalk.white(' Cores: ') + chalk.green(cpuCores.toString()),
    '',
    chalk.white.bold('Memory'),
    chalk.gray('  ├─') + chalk.white(' Used:  ') + chalk.green(usedMemory + 'GB') + chalk.gray(' / ') + chalk.green(totalMemory + 'GB') + chalk.gray(' (' + memoryUsage + '%)'),
    chalk.gray('  ├─') + chalk.white(' Free:  ') + chalk.green(freeMemory + 'GB'),
    chalk.gray('  └─') + ' ' + memoryColor(memoryBar),
    '',
    chalk.white.bold('Runtime'),
    chalk.gray('  ├─') + chalk.white(' Node.js: ') + chalk.green(version),
    chalk.gray('  ├─') + chalk.white(' Platform: ') + chalk.green(os),
    chalk.gray('  └─') + chalk.white(' Uptime: ') + chalk.green(uptimeHours + 'h ' + uptimeMins + 'm'),
    ''
  ];

  console.log(lines.join('\n'));
}

function getOSName(platform) {
  const names = {
    'win32': 'Windows',
    'darwin': 'macOS',
    'linux': 'Linux',
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD',
    'sunos': 'Solaris'
  };
  return names[platform] || platform;
}

function createBar(percentage, length) {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return bar;
}
