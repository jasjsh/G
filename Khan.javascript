const APP = {
  ver: "1.0.0",
  user: {
    id: 0
  },
  cfg: {
    mod: true,
    auto: false,
    questionSpoof: true,
    darkMode: true,
    autoSpeed: 750,
    speedOptions: [750, 1000, 1250, 1500]
  }
};

// Load external libraries
async function loadScript(url) {
  const response = await fetch(url);
  const script = await response.text();
  eval(script);
}

async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

// Toast notification function
function sendToast(message, duration = 5000, position = "bottom") {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration,
      gravity: position,
      position: "center",
      stopOnFocus: true,
      style: { background: "#000000" }
    }).showToast();
  } else {
    console.log("Toast:", message);
  }
}

// Audio player function
const playAudio = src => {
  new Audio(src).play();
};

class UI {
  static init() {
    const _0x3d849d = document.createElement("div");
    _0x3d849d.id = "KhanMathScript-panel";
    Object.assign(_0x3d849d.style, {
      position: "fixed",
      top: "10px",
      right: "15px",
      width: "200px",
      background: "linear-gradient(145deg, #1a1a1a, #111)",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      padding: "12px",
      zIndex: "9999",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      border: "1px solid #333",
      maxWidth: "90%"
    });
    _0x3d849d.innerHTML = `
            <style>
                .khanmathscript-header {
                    color: #fff;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #333;
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .khanmathscript-header:after {
                    content: "▼";
                    font-size: 12px;
                    margin-left: 5px;
                    transition: transform 0.3s ease;
                }
                .khanmathscript-header.collapsed:after {
                    transform: rotate(-90deg);
                }
                .khanmathscript-content {
                    transition: max-height 0.3s ease, opacity 0.3s ease;
                    max-height: 500px;
                    opacity: 1;
                    overflow: hidden;
                }
                .khanmathscript-content.collapsed {
                    max-height: 0;
                    opacity: 0;
                }
                .khanmathscript-version {
                    color: #666;
                    font-size: 12px;
                    font-weight: normal;
                }
                .khanmathscript-opt {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #fff;
                    padding: 8px;
                    margin: 3px 0;
                }
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 22px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #333;
                    transition: .4s;
                    border-radius: 22px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background: linear-gradient(145deg, #dc3545, #8b0000);
                }
                input:checked + .slider:before {
                    transform: translateX(22px);
                }
                .khanmathscript-credit {
                    color: #666;
                    font-size: 11px;
                    text-align: center;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #333;
                }
                .speed-slider-container {
                    width: 100%;
                    margin-top: 5px;
                    padding: 0 2px;
                    box-sizing: border-box;
                    overflow: visible;
                }
                .speed-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: #333;
                    outline: none;
                    margin: 10px 0;
                }
                .speed-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #dc3545, #8b0000);
                    cursor: pointer;
                }
                .speed-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #dc3545, #8b0000);
                    cursor: pointer;
                    border: none;
                }
                .speed-value {
                    display: none;
                }
                .speed-ticks {
                    display: none;
                }
                .speed-tick {
                    display: none;
                }
                .speed-ticks {
                    padding: 0;
                }
                .speed-tick {
                    font-size: 7px;
                }
            </style>
            <div class="khanmathscript-header">
                KhanMathScript <span class="khanmathscript-version">${APP.ver}</span>
            </div>
            <div class="khanmathscript-content">
                <div class="khanmathscript-opt">
                    <span>Completar Automaticamente</span>
                    <label class="switch">
                        <input type="checkbox" id="autoCheck">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="khanmathscript-opt">
                    <span>Simulação de Questões</span>
                    <label class="switch">
                        <input type="checkbox" id="spoofCheck" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="khanmathscript-opt">
                    <span>Modo Escuro</span>
                    <label class="switch">
                        <input type="checkbox" id="darkModeCheck" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="khanmathscript-opt" id="speedControlContainer" style="display: none;">
                    <span>Velocidade</span>
                    <div style="width: 100%; display: flex; align-items: center; padding-left: 10px; box-sizing: border-box;">
                        <div class="speed-slider-container">
                            <input type="range" min="0" max="3" value="0" class="speed-slider" id="speedSlider">
                            <div class="speed-value" id="speedValue" style="display: none;">750ms</div>
                        </div>
                    </div>
                </div>
                <div class="khanmathscript-credit">por Matheus</div>
            </div>
        `;
    document.body.appendChild(_0x3d849d);
    
    // Add click event to header for collapsing/expanding menu
    const header = document.querySelector('.khanmathscript-header');
    const content = document.querySelector('.khanmathscript-content');
    
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      
      // Save menu state to localStorage
      const isCollapsed = header.classList.contains('collapsed');
      localStorage.setItem('khanMathScript-collapsed', isCollapsed);
      
      // Show informative toast
      sendToast(isCollapsed ? "📼 Menu recolhido" : "📽 Menu expandido", 1000);
    });
    
    // Check if menu was previously collapsed
    const wasCollapsed = localStorage.getItem('khanMathScript-collapsed') === 'true';
    if (wasCollapsed) {
      header.classList.add('collapsed');
      content.classList.add('collapsed');
    }
    
    // Setup event listeners
    document.getElementById("autoCheck").onchange = event => {
      APP.cfg.auto = event.target.checked;
      document.getElementById("speedControlContainer").style.display = APP.cfg.auto ? "flex" : "none";
      sendToast(APP.cfg.auto ? "✅ Completar Automaticamente Ativado" : "❌ Completar Automaticamente Desativado", 2000);
    };
    
    // Configure speed slider
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");
    
    // Set initial slider value
    const initialIndex = APP.cfg.speedOptions.indexOf(APP.cfg.autoSpeed);
    speedSlider.value = initialIndex >= 0 ? initialIndex : 0;
    
    // Add change event to slider
    speedSlider.oninput = () => {
      const index = parseInt(speedSlider.value);
      const speed = APP.cfg.speedOptions[index];
      APP.cfg.autoSpeed = speed;
      speedValue.textContent = speed + "ms";
    };
    
    // Add complete change event to show toast
    speedSlider.onchange = () => {
      const index = parseInt(speedSlider.value);
      const speed = APP.cfg.speedOptions[index];
      sendToast(`⏱️ Velocidade alterada para ${speed}ms`, 2000);
    };

    
    document.getElementById("spoofCheck").onchange = event => {
      APP.cfg.questionSpoof = event.target.checked;
      sendToast(APP.cfg.questionSpoof ? "✅ Simulação de Questões Ativada" : "❌ Simulação de Questões Desativada", 2000);
    };
    
    document.getElementById("darkModeCheck").onchange = event => {
      APP.cfg.darkMode = event.target.checked;
      if (typeof DarkReader !== 'undefined') {
        if (APP.cfg.darkMode) {
          DarkReader.enable();
          sendToast("🌑 Modo Escuro Ativado", 2000);
        } else {
          DarkReader.disable();
          sendToast("☀️ Modo Escuro Desativado", 2000);
        }
      } else {
        console.error("DarkReader não está disponível");
        sendToast("⚠️ Modo Escuro não disponível. Recarregue a página.", 3000);
      }
    };
    
    // Enable Dark Mode by default
    if (APP.cfg.darkMode && typeof DarkReader !== 'undefined') {
      DarkReader.enable();
    }
  }
}

class Core {
  static init() {
    // Sequential initialization of functionalities
    this.setupMod();
    this.setupAuto();
  }
  
  static async loadExternalLibraries() {
    try {
      await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
      await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
      await loadScript("https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js");
      
      // Configure DarkReader after loading it
      if (typeof DarkReader !== 'undefined') {
        DarkReader.setFetchMethod(window.fetch);
        if (APP.cfg.darkMode) {
          DarkReader.enable();
        }
      } else {
        console.error("DarkReader não foi carregado corretamente");
      }
      
      // Check if Toastify was loaded before using
      if (typeof Toastify !== 'undefined') {
        console.log("✅ Toastify carregado com sucesso");
      } else {
        console.error("❌ Toastify não foi carregado");
      }
      
    } catch (error) {
      console.error("Erro ao carregar bibliotecas externas:", error);
    }
  }
  
  static setupMod() {
    if (!APP.cfg.mod) return;
    
    console.log("🔧 Mod functionality initialized");
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+K to toggle the panel
      if (event.ctrlKey && event.shiftKey && event.key === 'K') {
        event.preventDefault();
        const panel = document.getElementById('KhanMathScript-panel');
        if (panel) {
          panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
          sendToast(panel.style.display === 'none' ? "Painel Oculto" : "Painel Exibido", 1000);
        }
      }
      
      // Ctrl+Shift+A to toggle auto complete
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        const autoCheck = document.getElementById('autoCheck');
        if (autoCheck) {
          autoCheck.checked = !autoCheck.checked;
          autoCheck.onchange({ target: autoCheck });
        }
      }
    });
  }
  
  static setupAuto() {
    console.log("🤖 Auto functionality initialized");
    
    // Monitor for Khan Academy elements and auto-complete functionality
    this.observeKhanAcademyElements();
  }
  
  static observeKhanAcademyElements() {
    // Create a mutation observer to watch for Khan Academy content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.processKhanAcademyContent();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Also run initial check
    setTimeout(() => this.processKhanAcademyContent(), 1000);
  }
  
  static processKhanAcademyContent() {
    if (!APP.cfg.auto) return;
    
    // Look for Khan Academy exercise elements
    const questions = document.querySelectorAll('[data-test-id="question"]');
    const choices = document.querySelectorAll('[data-test-id="choice"]');
    const checkButton = document.querySelector('[data-test-id="check-answer-button"]');
    const nextButton = document.querySelector('[data-test-id="next-question-button"]');
    
    if (questions.length > 0 && APP.cfg.questionSpoof) {
      console.log("📝 Khan Academy questions detected");
    }
    
    if (choices.length > 0 && APP.cfg.auto) {
      setTimeout(() => {
        this.autoCompleteQuestion(choices, checkButton, nextButton);
      }, APP.cfg.autoSpeed);
    }
  }
  
  static autoCompleteQuestion(choices, checkButton, nextButton) {
    if (!APP.cfg.auto) return;
    
    try {
      // Simple auto-completion logic
      if (choices.length > 0) {
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        randomChoice.click();
        
        setTimeout(() => {
          if (checkButton && !checkButton.disabled) {
            checkButton.click();
            
            setTimeout(() => {
              if (nextButton && !nextButton.disabled) {
                nextButton.click();
              }
            }, 500);
          }
        }, 300);
        
        sendToast("🎯 Questão respondida automaticamente", 1000);
      }
    } catch (error) {
      console.error("Erro no completar automaticamente:", error);
    }
  }
  
  static getRandomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
  }
}

// Initialize everything
(async function() {
  try {
    // Load external libraries first
    await Core.loadExternalLibraries();
    
    // Initialize UI
    UI.init();
    
    // Initialize Core functionality
    Core.init();
    
    // Show success notification
    setTimeout(() => {
      sendToast("🚀 KhanMathScript v1.0.0 carregado com sucesso!", 3000);
    }, 1000);
    
  } catch (error) {
    console.error("Erro ao inicializar KhanMathScript:", error);
  }
})();