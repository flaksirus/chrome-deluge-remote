//All options are stored in an object
var ExtensionConfig = {
	address_protocol: "http",
	address_ip		: "",
	address_port	: "",
	address_base	: "",
	password		: "",
	handle_magnets	: false,
	handle_torrents	: false,
	context_menu	: false,
	badge_timeout	: 250,
	debug_mode		: false,
};

//Listen for changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		ExtensionConfig[key] = changes[key].newValue;
		if (key == "context_menu") {
			chrome.runtime.sendMessage({method: "context_menu", enabled: changes[key].newValue})
		}
	}
});

jQuery(document).ready(function ($) {
	//Load the options
	chrome.storage.sync.get(function(items) {
		ExtensionConfig = items;
		// For service workers, we check if we're in the background context differently
		if (typeof importScripts !== 'undefined') {	//If running in service worker context
			start();	//Start the extension - function is located in background.js
		}
	});
});
