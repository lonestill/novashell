import { cwd } from 'process';

export async function pwd(args) {
  console.log(cwd());
}
