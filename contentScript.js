function findEditor() {
  return document.querySelector("div[role='textbox']");
}

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

function cleanEditor() {
  const editor = findEditor();
  if (!editor) {
    alert('LinkedIn editor not found');
    return;
  }
  const text = editor.innerText;
  const cleaned = cleanText(text);
  editor.innerText = cleaned;

  // restore caret to end
  editor.focus();
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clean') {
    cleanEditor();
  }
});
