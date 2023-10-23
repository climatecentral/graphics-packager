import { queue } from 'd3-queue';

export function visitURLs({
  metadata,
  maxConcurrency = 10,
  reportProgress,
  reportVisit,
  done,
}) {
  var q = queue(maxConcurrency);
  metadata.forEach((entry) =>
    q.defer(visitURL, Object.assign({ reportProgress, reportVisit }, entry))
  );
  q.awaitAll(done);
}

// This function doesn't call back with an error so that the rest of the queue
// will continue.
async function visitURL({ url, reportProgress, reportVisit }, done) {
  reportProgress(`Visiting ${url}\n`);

  try {
    let res = await fetch(url);
    if (!res.ok) {
      reportProgress(
        `Error while visiting ${url}. Status code: ${res.status}\n`
      );
      done();
    } else {
      let buffer = await res.arrayBuffer();
      reportProgress(
        `Visited ${url}. Response buffer size: ${buffer.byteLength} bytes.\n`
      );
      reportVisit(url);
      // if (!saveImages) {
      done();
      // return;
      // }

      // const filePath = `${__dirname}/artifacts/${title}-${lang}-${location.key}-${variable}.${extension}`;
      // fs.writeFile(filePath, Buffer.from(buffer), { encoding: null }, done);
      // process.stdout.write(`Writing to ${filePath}.\n`);
      // fs.writeFile(filePath, Buffer.from(buffer), { encoding: null }, done);
    }
  } catch (error) {
    reportError(
      `Error while visiting ${url}: ${error.message} ${error.stack}\n`
    );
    done();
  }
}
