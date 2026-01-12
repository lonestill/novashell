import { randomBytes, randomInt } from 'crypto';
import chalk from 'chalk';

async function getrandomcommit() {
  const commit = await fetch('http://whatthecommit.com/index.txt');
  return commit.text();
}
export async function random(args) {
  if (args.length === 0) {
    console.log(randomInt(0, 1000000));
    return;
  }

  const type = args[0].toLowerCase();
  
  if (type === 'string' || type === 'str') {
    const length = parseInt(args[1]) || 16;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomInt(0, chars.length)];
    }
    console.log(result);
  } else if (type === 'number' || type === 'num' || type === 'int') {
    const min = parseInt(args[1]) || 0;
    const max = parseInt(args[2]) || 100;
    console.log(randomInt(min, max + 1));
  } else if (type === 'uuid' || type === 'guid') {
    const { randomUUID } = await import('crypto');
    console.log(randomUUID());
  } else if (type === 'hex') {
    const length = parseInt(args[1]) || 16;
    const bytes = randomBytes(Math.ceil(length / 2));
    console.log(bytes.toString('hex').slice(0, length));
  } else if (type === 'bytes') {
    const length = parseInt(args[1]) || 16;
    const bytes = randomBytes(length);
    console.log(bytes.toString('hex'));
  } else if (type === 'commit') {
    const commit = await getrandomcommit();
    console.log(commit);
  }else {
    const num = parseInt(type);
    if (!isNaN(num)) {
      console.log(randomInt(0, num + 1));
    } else {
      console.error(chalk.red(`random: unknown type "${type}"`));
      console.log(chalk.gray('Usage: random [string|number|uuid|hex|bytes] [length|min] [max]'));
    }
  }
}
