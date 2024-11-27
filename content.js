const styles = document.createElement('link');
styles.rel = 'stylesheet';
styles.type = 'text/css';
styles.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(styles);

const extensionIcon = document.createElement('div');
extensionIcon.id = 'tabMasterIcon';
document.body.appendChild(extensionIcon);
