import { generateMetadata } from '../tasks/generate-metadata';
import handleError from 'handle-error-web';
import { renderMetadata } from '../renderers/render-metadata';
import { ObjectFromDOM } from 'object-form';

var objectFromDOM = ObjectFromDOM({});
var formEl = document.querySelector('form');
var setDefRootEl = document.querySelector('#set-def-root');

export async function runMetadataGeneration() {
  try {
    var metadataOpts = objectFromDOM(formEl);
    var setDefs = objectFromDOM(setDefRootEl);
    console.log('setDefs', setDefs);

    // TODO: set stuff
    var metadata = await generateMetadata(metadataOpts);
    renderMetadata({ metadata });
  } catch (error) {
    handleError(error);
  }
}
