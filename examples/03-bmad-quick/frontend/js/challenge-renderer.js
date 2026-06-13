class ChallengeRenderer {
  renderBlocks(blocks, container) {
    container.innerHTML = '';
    if (!blocks || !Array.isArray(blocks)) return;
    blocks.forEach(block => {
      const el = this._renderBlock(block);
      if (el) container.appendChild(el);
    });
  }

  _renderBlock(block) {
    switch (block.type) {
      case 'markdown':
        return this._renderMarkdown(block);
      case 'code':
        return this._renderCode(block);
      case 'image':
        return this._renderImage(block);
      case 'callout':
        return this._renderCallout(block);
      default:
        return null;
    }
  }

  _renderMarkdown(block) {
    const div = document.createElement('div');
    div.className = 'challenge-block block-markdown';
    div.innerHTML = this._basicMarkdown(block.content || '');
    return div;
  }

  _basicMarkdown(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }

  _renderCode(block) {
    const pre = document.createElement('pre');
    pre.className = 'challenge-block block-code';
    if (block.language) {
      const label = document.createElement('span');
      label.className = 'language-label';
      label.textContent = block.language;
      pre.appendChild(label);
    }
    const code = document.createElement('code');
    code.textContent = block.content || '';
    pre.appendChild(code);
    return pre;
  }

  _renderImage(block) {
    if (!block.url) return null;
    const div = document.createElement('div');
    div.className = 'challenge-block block-image';
    const img = document.createElement('img');
    img.src = block.url;
    img.alt = block.alt || '';
    div.appendChild(img);
    if (block.caption) {
      const caption = document.createElement('p');
      caption.className = 'image-caption';
      caption.textContent = block.caption;
      div.appendChild(caption);
    }
    return div;
  }

  _renderCallout(block) {
    const div = document.createElement('div');
    div.className = 'challenge-block block-callout ' + (block.style || 'note');
    div.textContent = block.content || '';
    return div;
  }
}
