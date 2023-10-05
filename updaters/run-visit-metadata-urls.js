var { visitURLs } = require('../visit-metadata-urls');

visitURLs({ done });

function done(error) {
  if (error) {
    console.error('Finished with error:', error);
  } else {
    console.log('Finished without error!');
  }
}
