async function initPopup() {
  const btn = document.getElementById('cleanBtn');
  const msg = document.getElementById('message');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id || !/^https:\/\/www\.linkedin\.com/.test(tab.url)) {
    btn.disabled = true;
    msg.textContent = 'Open LinkedIn to use this extension.';
    return;
  }

  btn.addEventListener('click', async () => {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'clean' });
    } catch (err) {
      // occurs if the tab has no content script (e.g., not a LinkedIn page)
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js'],
        });
        await chrome.tabs.sendMessage(tab.id, { action: 'clean' });
      } catch (injectErr) {
        msg.textContent = 'Unable to clean this page. Reload LinkedIn and try again.';
        console.error('Could not send message', injectErr);
      }
    }
  });
}

initPopup();
