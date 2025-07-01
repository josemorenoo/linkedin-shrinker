document.getElementById('cleanBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'clean' });
  } catch (err) {
    // occurs if the tab has no content script (e.g., not a LinkedIn page)
    console.error('Could not send message', err);
  }
});
