export async function clear(args) {
  process.stdout.write('\x1Bc');
}
