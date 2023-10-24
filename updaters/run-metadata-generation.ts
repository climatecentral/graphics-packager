import { generateMetadata } from '../tasks/generate-metadata';
import handleError from 'handle-error-web';
import { renderMetadata } from '../renderers/render-metadata';
import { ObjectFromDOM } from 'object-form';
import { SetDef } from '../types';

var objectFromDOM = ObjectFromDOM({});
var formEl = document.querySelector('form');
var setDefRootEl = document.querySelector('#set-def-root');

export async function runMetadataGeneration({
  onMetadata,
}: {
  onMetadata: (generatedMetadata: unknown) => null;
}) {
  try {
    var overallOpts = objectFromDOM(formEl);
    var setDefObject = objectFromDOM(setDefRootEl);
    // TODO: Fix in objectForm
    var setDefs = Object.values(setDefObject.setDefs) as SetDef[];
    setDefs.forEach(
      (setDef) =>
        (setDef.downloadable = JSON.parse(
          setDef.downloadable as unknown as string
        ))
    );
    console.log('setDefs', setDefs);

    var metadata = await generateMetadata({ overallOpts, setDefs });
    onMetadata(metadata);
    renderMetadata({ metadata });
  } catch (error) {
    handleError(error);
  }
}
