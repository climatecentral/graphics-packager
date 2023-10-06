import { select } from 'd3-selection';
import { renderForm } from './render-form';

// TODO: Names. These need to be object entries, not array entries.
var fieldPacks = [
  { id: 'graphicType', name: 'graphicType', defaultValue: 'lineChart' },
  { id: 'variable', name: 'variable', defaultValue: 'tavg' },
  { id: 'locations', name: 'locations', defaultValue: '{}' },
];

export function renderSets({ setDefs, onAddSet }) {
  var setSel = select('#set-def-root').selectAll('.set-def').data(setDefs);
  setSel.exit().remove();
  var newSetsSel = setSel.enter().append('li').classed('set-def', true);
  newSetsSel.each(setUpForm);

  select('#add-set-button').on('click', onAddSet);
}

function setUpForm() {
  renderForm({ fieldPacks, rootSelector: this });
}
