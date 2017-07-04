const readStdin = () => new Promise((resolve, reject) => {
  const inputChunks = [];
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    inputChunks.push(chunk);
  });
  process.stdin.on('end', () => {
    resolve(inputChunks.join('').trim());
  });
  process.stdin.on('error', (err) => {
    reject(err);
  });
});

module.exports.read = readStdin;
