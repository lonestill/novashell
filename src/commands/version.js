import chalk from 'chalk';
import { getVersion, getPackageInfo } from '../utils/version.js';

export async function versionCommand(args) {
  const version = getVersion();
  const packageInfo = getPackageInfo();
  
  console.log(chalk.cyan.bold(`\n${packageInfo.name}`));
  console.log(chalk.gray(`Version: ${chalk.yellow(version)}`));
  
  if (packageInfo.description) {
    console.log(chalk.gray(`\n${packageInfo.description}`));
  }
  
  console.log('');
}
