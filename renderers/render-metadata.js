// import handleError from 'handle-error-web';

var jsonFieldEl = document.getElementById('json-field');
var downloadLinkEl = document.getElementById('download-link');

export function renderMetadata({ metadata }) {
  const metadataString = JSON.stringify(metadata, null, 2);
  jsonFieldEl.value = metadataString;
  const dataURL = `data:application/json,${encodeURIComponent(metadataString)}`;
  downloadLinkEl.download = 'metadata.json';
  downloadLinkEl.href = dataURL;
  downloadLinkEl.classList.remove('hidden');
}
