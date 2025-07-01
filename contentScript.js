function cleanText(text) {
  const lines = text.split(/\n/);
  const paragraphs = [];
  let current = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.length) {
        paragraphs.push(current.join(' '));
        current = [];
      }
    } else {
      current.push(trimmed);
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  return paragraphs.join('\n\n');
}


function cleanFeedPost(element) {
  const text = element.innerText;
  const cleaned = cleanText(text);
  if (cleaned !== text) {
    element.innerText = cleaned;
  }
}

function cleanFeed() {
  const posts = document.querySelectorAll(
    'div.feed-shared-update-v2__description span.break-words'
  );
  posts.forEach(cleanFeedPost);
}

function observeFeed() {
  const selector = 'div.feed-shared-update-v2__description span.break-words';
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches && node.matches(selector)) {
            cleanFeedPost(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll(selector).forEach(cleanFeedPost);
          }
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

cleanFeed();
observeFeed();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clean') {
    cleanFeed();
  }
});
