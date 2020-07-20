import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');

export default window.document;
