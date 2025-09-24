// Ensure axios uses the XHR adapter in browsers
import axios from 'axios';

try {
  // Force axios to use the XHR adapter explicitly
  // @ts-ignore
  axios.defaults.adapter = 'xhr';
} catch (_) {
  // no-op
}

export {}; // treat as module


