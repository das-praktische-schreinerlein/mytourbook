import {AppEnvironment} from './app-environment';
import {environment as viewerEnvironment} from '../environments/environment.viewer';
import {JsPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/jspdf.generator';
import * as html2canvas from 'html2canvas';


export const environment: AppEnvironment = viewerEnvironment;

// HINT - preload html2canvas globally to prevent chunking and lazy-loading
window['html2canvas'] = html2canvas;

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends JsPdfGenerator {}
