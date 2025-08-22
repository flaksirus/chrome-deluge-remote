# Chrome Extension Manifest V3 Upgrade

This document outlines the changes made to upgrade the Remote Deluge Chrome extension from Manifest V2 to Manifest V3.

## Changes Made

### 1. Updated manifest.json
- **manifest_version**: Changed from 2 to 3
- **background**: Converted from persistent background page with scripts array to service worker
  - Removed `persistent: true`
  - Replaced `scripts` array with `service_worker: "js/background-service-worker.js"`
- **browser_action**: Renamed to `action`
- **web_accessible_resources**: Updated format to include `resources` and `matches` properties
- **permissions**: Moved host permissions (`http://*/*`, `https://*/*`) to separate `host_permissions` field

### 2. Created new service worker (background-service-worker.js)
- Imports all required scripts using `importScripts()`
- Handles extension startup and installation events
- Initializes extension configuration and starts background processes
- Works around service worker limitations compared to persistent background pages

### 3. Updated background.js
- **chrome.browserAction** → **chrome.action**: Updated all references to use the new action API
  - `setIcon()`, `setTitle()`, `setBadgeText()`, `setBadgeBackgroundColor()`
- **Context Menus**: Updated deprecated `chrome.contextMenus.ContextType.LINK` to string `"link"`
- **Message Handling**: Added new `checkStatus` message handler for communication with popup
- **Bug Fix**: Fixed incorrect `check_status` function reference to `pub.checkStatus`

### 4. Updated popup.js
- **Removed direct background page access**: Eliminated `chrome.extension.getBackgroundPage()`
- **Message-based communication**: Converted `backgroundPage.Background.checkStatus()` calls to use `chrome.runtime.sendMessage()`
- Updated error handling to work with the new messaging system

### 5. Updated options.js
- **Removed background page reference**: Eliminated unused `chrome.extension.getBackgroundPage()` call

### 6. Updated global_options.js
- **Service worker detection**: Changed background page detection from `chrome.extension.getBackgroundPage()` check to `typeof importScripts !== 'undefined'`
- This ensures the extension starts properly in the service worker environment

## Key Differences in Manifest V3

### Service Workers vs Background Pages
- **Non-persistent**: Service workers are event-driven and don't run continuously
- **No DOM access**: Service workers can't access DOM or window objects
- **Limited APIs**: Some APIs that worked in background pages may not work in service workers
- **Event-driven startup**: Extension initialization happens on specific events

### API Changes
- `chrome.browserAction` → `chrome.action`
- `chrome.extension.getBackgroundPage()` → Message passing with `chrome.runtime.sendMessage()`
- Context menu enum values changed to strings
- Host permissions separated from regular permissions

### Communication Changes
- Direct function calls to background page replaced with message passing
- Asynchronous communication patterns needed for popup ↔ service worker interaction

## Testing Instructions

1. **Load the extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

2. **Verify basic functionality**:
   - Extension icon should appear in toolbar
   - Clicking the icon should open the popup
   - Options page should be accessible
   - Context menu should work (if enabled in options)

3. **Test core features**:
   - Configure Deluge server settings in options
   - Verify connection to Deluge server
   - Test torrent/magnet link handling
   - Check popup status updates
   - Verify badge notifications

4. **Check for errors**:
   - Open Chrome DevTools and check console for errors
   - Check service worker logs in `chrome://extensions/` → extension details → "service worker" link
   - Test extension across browser restarts

## Potential Issues to Watch For

1. **Service worker lifecycle**: The service worker may shut down when inactive, so ensure all functionality works after periods of inactivity
2. **jQuery compatibility**: While jQuery 3.0 should work in service workers, some features might be limited
3. **Timing issues**: Service worker startup might take longer than the old persistent background page
4. **CORS/networking**: Ensure network requests to Deluge server still work properly

## Migration Benefits

- **Better performance**: Service workers use less memory and CPU when inactive
- **Modern architecture**: Aligns with Chrome's future extension platform direction
- **Security improvements**: Enhanced security model in Manifest V3
- **Future compatibility**: Ensures extension continues working as Chrome deprecates Manifest V2

The extension should now be fully compatible with Manifest V3 while maintaining all existing functionality.
