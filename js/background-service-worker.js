// Background service worker for Manifest V3
// Import required modules
importScripts(
	'libs/jquery-3.0.0.min.js',
	'global_options.js',
	'debug_log.js',
	'deluge.js',
	'background.js'
);

// Service workers don't have persistent state, so we need to handle startup differently
chrome.runtime.onStartup.addListener(() => {
	debug_log('Extension startup');
	initializeExtension();
});

chrome.runtime.onInstalled.addListener(() => {
	debug_log('Extension installed/updated');
	initializeExtension();
});

function initializeExtension() {
	// Load configuration and start the extension
	chrome.storage.sync.get(function(items) {
		ExtensionConfig = Object.assign(ExtensionConfig, items);
		// Since we're in a service worker context, call start directly
		start();
	});
}

// Initialize when the service worker starts
initializeExtension();
