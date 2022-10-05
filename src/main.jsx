import React from 'react';

import ReactDOM from 'react-dom/client';
import {withLDProvider} from 'launchdarkly-react-client-sdk';
import App from './App';

const LDProvider = withLDProvider({
	clientSideID: import.meta.env.VITE_CLIENT_ID,
	options: {
		/* ... */
	},
})(App);

// eslint-disable-next-line no-undef
ReactDOM.createRoot(document.querySelector('#root')).render(
	<React.StrictMode>
		<LDProvider />
	</React.StrictMode>,
);
