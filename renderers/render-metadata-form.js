import { select } from 'd3-selection';
import { renderForm } from './render-form';

export function renderMetadataForm({
  fieldPacks,
  runMetadataGeneration,
  onMetadata,
}) {
  renderForm({ fieldPacks, rootSelector: 'form' });
  select('#metadata-button').on('click', () =>
    runMetadataGeneration({ onMetadata })
  );
}
