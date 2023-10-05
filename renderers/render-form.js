import { select } from 'd3-selection';
import accessor from 'accessor';

export function renderForm({ fieldPacks, runMetadataGeneration }) {
  var fieldSel = select('form')
    .selectAll('.field')
    .data(fieldPacks, accessor('id'));
  fieldSel.exit().remove();
  var newFields = fieldSel.enter().append('div').classed('field', true);
  newFields.append('label');
  newFields.append('input').attr('type', 'text');

  var existingFields = newFields.merge(fieldSel);
  existingFields.select('label').attr('for', getId).text(accessor('name'));
  existingFields
    .select('input')
    .attr('id', getId)
    .attr('data-of', accessor('id'))
    .attr('value', accessor('defaultValue'));

  select('#metadata-button').on('click', runMetadataGeneration);
}

function getId(fieldPack) {
  return fieldPack.id + '-field';
}
