import chalk from 'chalk';

export async function env(args) {
  if (args.length > 0) {
    const value = process.env[args[0]];
    if (value !== undefined) {
      console.log(value);
    } else {
      console.error(chalk.red(`env: ${args[0]}: variable not found`));
    }
  } else {
    const envVars = Object.entries(process.env)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);
    console.log(envVars.join('\n'));
  }
}
