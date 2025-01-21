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
    
    this.initializeEventListeners();
    this.loadSavedContent();
    this.startClock();
  }
  
  initializeEventListeners() {
    this.textArea.addEventListener('input', () => {
      this.updateCounts();
      this.saveToLocalStorage();
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
}

const editor = new VaporEditor();