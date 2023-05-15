const fs = require('fs');
const { Transform } = require('stream');

function start() {
  const [, , fileName, newFileName = '_done_text.txt'] = process.argv;
  let numberLine = 0;

  const readable = fs.createReadStream(`${fileName}`, {
    encoding: 'utf8',
  });
  const writeble = fs.createWriteStream(`${newFileName}`, {
    encoding: 'utf8',
  });

  const reverseStream = new Transform({
    transform(chunk, encoding, callback) {
      try {
        console.log(process.memoryUsage().heapTotal / 1e6);
        let arr = chunk.toString().match(/[\p{L}\p{N}\p{P}]{1,}/gmu);
        if (arr) {
          arr = arr.map((item) => {
            return ++numberLine + '.' + item;
          });
          const str = arr.join('\n');
          callback(null, str);
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
        callback(null);
      }
    },
  });

  readable.pipe(reverseStream).pipe(writeble);
}

start();
