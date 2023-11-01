import { select } from 'd3-selection';
import { renderForm } from './render-form';

// TODO: These need to be object entries, not array entries.
var fieldPacks = [
  { id: 'name', name: 'Graphic set name', defaultValue: 'Default set name' },
  { id: 'graphicType', name: 'graphicType', defaultValue: 'lineChart' },
  { id: 'variable', name: 'variable', defaultValue: 'mean_tavg' },
  { id: 'locationType', name: 'locationType', defaultValue: 'market' },
  // TODO: Bring these back after graphics supports them in the URL.
  // { id: 'backgroundType', name: 'backgroundType', defaultValue: 'Solid' },
  // { id: 'imageURL', name: 'imageURL', defaultValue: '' },
  // {
  //   id: 'backgroundStartColor',
  //   name: 'backgroundStartColor',
  //   defaultValue: '',
  // },
  // { id: 'backgroundEndColor', name: 'backgroundEndColor', defaultValue: '' },
  { id: 'downloadable', name: 'downloadable', defaultValue: 'true' },
];

export function renderSets({ setDefs, onAddSet }) {
  var setSel = select('#set-def-root').selectAll('.set-def').data(setDefs);
  setSel.exit().remove();
  var newSetsSel = setSel.enter().append('li').classed('set-def', true);
  newSetsSel.each(setUpForm);

  select('#add-set-button').on('click', onAddSet);
}

function setUpForm(setDef, i) {
  renderForm({
    fieldPacks,
    rootSelector: this,
    dataOf: 'setDefs/' + i + '/',
  });
}
