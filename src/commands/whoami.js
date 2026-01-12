import { userInfo } from 'os';
import chalk from 'chalk';

export async function whoami(args) {
  const info = userInfo();
  console.log(chalk.green(info.username));
}
