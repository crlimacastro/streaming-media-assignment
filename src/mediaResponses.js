const fs = require('fs'); // pull in the file system module
const path = require('path');

const loadFile = (request, response, filePath) => {
  const file = path.resolve(__dirname, filePath);

  // Get file statistics
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    // Init stream range
    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    // Get start and end positions
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    // Determine chunk size and send back headers
    const chunksize = (end - start) + 1;

    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });

    // Start file read stream and pipe it to the client
    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => {
      stream.pipe(response);
    });

    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};

const getParty = (request, response) => loadFile(request, response, '../client/party.mp4', 'video/mp4');
const getBling = (request, response) => loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
const getBird = (request, response) => loadFile(request, response, '../client/bird.mp4', 'video/mp4');

module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
