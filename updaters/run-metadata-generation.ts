import { generateMetadata } from '../tasks/generate-metadata';
import handleError from 'handle-error-web';
import { renderMetadata } from '../renderers/render-metadata';
import { ObjectFromDOM } from 'object-form';

var objectFromDOM = ObjectFromDOM({});
var formEl = document.querySelector('form');

export async function runMetadataGeneration() {
  try {
    var metadataOpts = objectFromDOM(formEl);
    var metadata = await generateMetadata(metadataOpts);
    renderMetadata({ metadata });
  } catch (error) {
    handleError(error);
  }
}
