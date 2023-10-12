import { select } from 'd3-selection';
import accessor from 'accessor';

// rootSelector can be a selection itself.
export function renderForm({ fieldPacks, rootSelector, dataOf }) {
  var fieldSel = select(rootSelector)
    .selectAll('.field')
    .data(fieldPacks, accessor('id'));
  fieldSel.exit().remove();
  var newFields = fieldSel.enter().append('div').classed('field', true);
  newFields.append('label');
  // TODO: Use <select> for enum values.
  newFields.append('input').attr('type', 'text');

  var existingFields = newFields.merge(fieldSel);
  existingFields.select('label').attr('for', getId).text(accessor('name'));
  existingFields
    .select('input')
    .attr('id', getId)
    .attr('data-of', (d) => (dataOf ? dataOf + d.id : d.id))
    .attr('value', accessor('defaultValue'));
}

function getId(fieldPack) {
  return fieldPack.id + '-field';
}
