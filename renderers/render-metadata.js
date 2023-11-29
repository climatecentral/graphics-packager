import { select } from 'd3-selection';
import noThrowJSONParse from 'no-throw-json-parse';

var jsonFieldEl = document.getElementById('json-field');
var downloadLinkEl = document.getElementById('download-link');

export function renderMetadata({ metadata, onManualMetadataEdit }) {
  if (onManualMetadataEdit) {
    select(jsonFieldEl).on('blur', notifyAboutJSONChange);
  }
  const metadataString = JSON.stringify(metadata, null, 2);
  jsonFieldEl.value = metadataString;
  const dataURL = `data:application/json,${encodeURIComponent(metadataString)}`;
  downloadLinkEl.download = 'metadata.json';
  downloadLinkEl.href = dataURL;
  downloadLinkEl.classList.remove('hidden');

  function notifyAboutJSONChange() {
    var metadata = noThrowJSONParse(jsonFieldEl.value);
    if (metadata) {
      onManualMetadataEdit(metadata);
    }
  }
}
