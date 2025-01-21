class VaporEditor {
  constructor() {
    this.textArea = document.getElementById('textArea');
    this.wordCount = document.getElementById('wordCount');
    this.charCount = document.getElementById('charCount');
    this.timeDisplay = document.getElementById('timeDisplay');
    this.themeBtn = document.getElementById('themeBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.saveBtn = document.getElementById('saveBtn');
    this.saveDialog = document.getElementById('saveDialog');
    this.saveForm = document.getElementById('saveForm');
    
    this.themes = ['default', 'sunset', 'cyber'];
    this.currentTheme = 0;
    
    this.musicBtn = document.getElementById('musicBtn');
    this.musicPanel = document.getElementById('musicPanel');
    this.playlistUrl = document.getElementById('playlistUrl');
    this.loadPlaylistBtn = document.getElementById('loadPlaylist');
    this.spotifyEmbed = document.getElementById('spotifyEmbed');
    
    // Add new settings-related elements
    this.settingsBtn = document.getElementById('settingsBtn');
    this.settingsDialog = document.getElementById('settingsDialog');
    this.settingsForm = document.getElementById('settingsForm');
    this.settingsCloseBtn = document.getElementById('settingsCloseBtn');
    this.lineNumbersToggle = document.getElementById('lineNumbers');
    this.languageSelect = document.getElementById('language');
    this.spellcheckToggle = document.getElementById('spellcheck');
    
    this.initializeEventListeners();
    this.loadSavedContent();
    this.loadSettings();
    this.startClock();
  }
  
  initializeEventListeners() {
    this.textArea.addEventListener('input', () => {
      this.updateCounts();
      this.saveToLocalStorage();
      this.updateLineNumbers();
    });
    
    this.themeBtn.addEventListener('click', () => this.cycleTheme());
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveContent();
      }
    });
    
    this.textArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        setTimeout(() => {
          this.addGlowEffect();
        }, 100);
      }
    });
    
    this.saveBtn.addEventListener('click', () => this.showSaveDialog());
    
    this.saveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const filename = document.getElementById('filename').value;
      const extension = document.getElementById('extension').value;
      this.saveContent(filename, extension);
      this.saveDialog.close();
      this.saveForm.reset();
    });
    
    this.saveDialog.addEventListener('click', (e) => {
      if (e.target === this.saveDialog) {
        this.saveDialog.close();
      }
    });
    
    this.musicBtn.addEventListener('click', () => this.toggleMusicPanel());
    this.loadPlaylistBtn.addEventListener('click', () => this.loadSpotifyContent());
    
    // Handle Enter key in playlist URL input
    this.playlistUrl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.loadSpotifyContent();
      }
    });
    
    // Add settings-related event listeners
    this.settingsBtn.addEventListener('click', () => this.showSettingsDialog());
    this.settingsCloseBtn.addEventListener('click', () => this.settingsDialog.close());
    this.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveSettings();
      this.settingsDialog.close();
    });
    
    this.settingsDialog.addEventListener('click', (e) => {
      if (e.target === this.settingsDialog) {
        this.settingsDialog.close();
      }
    });
    
    // Line numbers toggle event
    this.lineNumbersToggle.addEventListener('change', () => {
      this.toggleLineNumbers();
    });
    
    // Spellcheck toggle event
    this.spellcheckToggle.addEventListener('change', () => {
      this.textArea.spellcheck = this.spellcheckToggle.checked;
    });
  }

  updateCounts() {
    const text = this.textArea.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    this.wordCount.textContent = `Words: ${words}`;
    this.charCount.textContent = `Chars: ${chars}`;
  }
  
  cycleTheme() {
    this.currentTheme = (this.currentTheme + 1) % this.themes.length;
    document.documentElement.dataset.theme = this.themes[this.currentTheme];
    localStorage.setItem('vaporEditTheme', this.currentTheme);
  }
  
  toggleFullscreen() {
    const container = document.querySelector('.editor-container');
    container.classList.toggle('fullscreen');
    const icon = this.fullscreenBtn.querySelector('i');
    icon.classList.toggle('fa-expand');
    icon.classList.toggle('fa-compress');
  }
  
  startClock() {
    const updateTime = () => {
      const now = new Date();
      this.timeDisplay.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    updateTime();
    setInterval(updateTime, 1000);
  }
  
  saveToLocalStorage() {
    localStorage.setItem('vaporEditContent', this.textArea.value);
  }
  
  loadSavedContent() {
    const savedContent = localStorage.getItem('vaporEditContent');
    if (savedContent) {
      this.textArea.value = savedContent;
      this.updateCounts();
    }
    
    const savedTheme = localStorage.getItem('vaporEditTheme');
    if (savedTheme) {
      this.currentTheme = parseInt(savedTheme);
      document.documentElement.dataset.theme = this.themes[this.currentTheme];
    }
    
    // Load last used playlist
    const savedPlaylist = localStorage.getItem('vaporEditLastPlaylist');
    if (savedPlaylist) {
      this.playlistUrl.value = savedPlaylist;
      this.loadSpotifyContent();
    }
  }
  
  addGlowEffect() {
    const glowColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim();
    
    this.textArea.style.textShadow = `0 0 5px ${glowColor}`;
    setTimeout(() => {
      this.textArea.style.textShadow = 'none';
    }, 300);
  }
  
  showSaveDialog() {
    this.saveDialog.showModal();
  }
  
  saveContent(filename, extension) {
    if (filename && extension) {
      const fullFilename = `${filename}.${extension}`;
      const blob = new Blob([this.textArea.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFilename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([this.textArea.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vapor-text.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  }
  
  toggleMusicPanel() {
    this.musicPanel.classList.toggle('visible');
  }
  
  loadSpotifyContent() {
    const url = this.playlistUrl.value.trim();
    if (!url) return;
    
    // Extract Spotify URI/ID from the URL
    let spotifyId = '';
    if (url.includes('spotify.com')) {
      const urlParts = url.split('/');
      spotifyId = urlParts[urlParts.length - 1].split('?')[0];
    } else {
      spotifyId = url;
    }
    
    // Create embed iframe
    const embedUrl = `https://open.spotify.com/embed/playlist/${spotifyId}`;
    this.spotifyEmbed.innerHTML = `
      <iframe 
        src="${embedUrl}" 
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media">
      </iframe>
    `;
    
    // Save to localStorage
    localStorage.setItem('vaporEditLastPlaylist', url);
  }
  
  showSettingsDialog() {
    this.settingsDialog.showModal();
  }

  loadSettings() {
    // Load line numbers setting
    const showLineNumbers = localStorage.getItem('vaporEditLineNumbers') === 'true';
    this.lineNumbersToggle.checked = showLineNumbers;
    if (showLineNumbers) {
      this.toggleLineNumbers();
    }
    
    // Load language setting
    const savedLanguage = localStorage.getItem('vaporEditLanguage');
    if (savedLanguage) {
      this.languageSelect.value = savedLanguage;
    }
    
    // Load spellcheck setting
    const spellcheck = localStorage.getItem('vaporEditSpellcheck') === 'true';
    this.spellcheckToggle.checked = spellcheck;
    this.textArea.spellcheck = spellcheck;
  }

  saveSettings() {
    localStorage.setItem('vaporEditLineNumbers', this.lineNumbersToggle.checked);
    localStorage.setItem('vaporEditLanguage', this.languageSelect.value);
    localStorage.setItem('vaporEditSpellcheck', this.spellcheckToggle.checked);
  }

  toggleLineNumbers() {
    const editor = document.querySelector('.editor');
    const lineNumbers = document.querySelector('.line-numbers');
    
    if (this.lineNumbersToggle.checked) {
      editor.classList.add('with-line-numbers');
      if (!lineNumbers) {
        const lineNumbersDiv = document.createElement('div');
        lineNumbersDiv.className = 'line-numbers';
        editor.insertBefore(lineNumbersDiv, this.textArea);
        this.updateLineNumbers();
        
        // Add scroll event listener
        this.textArea.addEventListener('scroll', () => {
          if (lineNumbersDiv) {
            this.updateLineNumbers();
          }
        });
        
        // Add input event listener
        this.textArea.addEventListener('input', () => this.updateLineNumbers());
      }
    } else {
      editor.classList.remove('with-line-numbers');
      if (lineNumbers) {
        lineNumbers.remove();
      }
    }
  }

  updateLineNumbers() {
    const lineNumbers = document.querySelector('.line-numbers');
    if (!lineNumbers) return;
    
    const lines = this.textArea.value.split('\n');
    const numbers = lines.map((_, i) => `${i + 1}`).join('\n');
    lineNumbers.textContent = numbers;
    
    // Match exact scrollHeight of textarea
    lineNumbers.style.height = `${this.textArea.scrollHeight}px`;
    
    // Sync scroll position
    lineNumbers.style.top = '0';
    lineNumbers.style.transform = `translateY(-${this.textArea.scrollTop}px)`;
  }

}

const editor = new VaporEditor();