import './app.css';
import handleError from 'handle-error-web';
import { version } from './package.json';
import { renderMetadataForm } from './renderers/render-metadata-form';
import { renderSets } from './renderers/render-sets';
import { runMetadataGeneration } from './updaters/run-metadata-generation';
import { SetDef } from './types';

var setDefs: SetDef[] = [];

var fieldPacks = [
  { id: 'season', name: 'Season', defaultValue: 'fall' },
  { id: 'variable', name: 'Variable', defaultValue: '' },
  { id: 'endYear', name: 'End year', defaultValue: '2022' },
  { id: 'ticksCount', name: 'Ticks count', defaultValue: '3' },
];

(async function go() {
  window.addEventListener('error', reportTopLevelError);
  renderVersion();
  renderMetadataForm({ fieldPacks, runMetadataGeneration });
  renderSets({ setDefs, onAddSet });
})();

function onAddSet() {
  setDefs.push({ graphicType: 'lineChart', variable: 'tavg', locations: {} });
  renderSets({ setDefs, onAddSet });
}

function reportTopLevelError(errorEvent: ErrorEvent) {
  handleError(errorEvent.error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info') as HTMLElement;
  versionInfo.textContent = version;
}
