import './app.css';
import handleError from 'handle-error-web';
import { version } from './package.json';
import { renderForm } from './renderers/render-form';
import { runMetadataGeneration } from './updaters/run-metadata-generation';

var fieldPacks = [
  { id: 'season', name: 'Season', defaultValue: 'fall' },
  { id: 'variable', name: 'Variable', defaultValue: '' },
  { id: 'endYear', name: 'End year', defaultValue: '2022' },
  { id: 'ticksCount', name: 'Ticks count', defaultValue: '3' },
];

(async function go() {
  window.addEventListener('error', reportTopLevelError);
  renderVersion();
  renderForm({ fieldPacks, runMetadataGeneration });
})();

function reportTopLevelError(errorEvent: ErrorEvent) {
  handleError(errorEvent.error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info') as HTMLElement;
  versionInfo.textContent = version;
}
