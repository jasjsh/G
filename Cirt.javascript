const APP = {
  ver: "1.2.0",
  user: {
    id: 0
  },
  cfg: {
    mod: true,
    auto: false,
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
      style: { background: "#ff0000" } // Cor vermelha
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
    _0x3d849d.id = "MathScript-panel"; // Nome alterado
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
                .mathscript-header {
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
                .mathscript-header:after {
                    content: "â–¼";
                    font-size: 12px;
                    margin-left: 5px;
                    transition: transform 0.3s ease;
                }
                .mathscript-header.collapsed:after {
                    transform: rotate(-90deg);
                }
                .mathscript-content {
                    transition: max-height 0.3s ease, opacity 0.3s ease;
                    max-height: 500px;
                    opacity: 1;
                    overflow: hidden;
                }
                .mathscript-content.collapsed {
                    max-height: 0;
                    opacity: 0;
                }
                .mathscript-version {
                    color: #666;
                    font-size: 12px;
                    font-weight: normal;
                }
                .mathscript-opt {
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
                    background: linear-gradient(145deg, #6200ea, #7c4dff);
                }
                input:checked + .slider:before {
                    transform: translateX(22px);
                }
                .mathscript-credit {
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
                    background: linear-gradient(145deg, #6200ea, #7c4dff);
                    cursor: pointer;
                }
                .speed-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #6200ea, #7c4dff);
                    cursor: pointer;
                    border: none;
                }
                .speed-value {
                    display: none;
                }
                /* Removendo as classes relacionadas às marcações de velocidade */
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
            <div class="mathscript-header">
                MathScript <span class="mathscript-version">${APP.ver}</span>
            </div>
            <div class="mathscript-content">
                <div class="mathscript-opt">
                    <span>Auto Complete</span>
                    <label class="switch">
                        <input type="checkbox" id="autoCheck">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="mathscript-opt">
                    <span>Dark Mode</span>
                    <label class="switch">
                        <input type="checkbox" id="darkModeCheck" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="mathscript-opt" id="speedControlContainer" style="display: none;">
                    <span>Velocidade</span>
                    <div style="width: 100%; display: flex; align-items: center; padding-left: 10px; box-sizing: border-box;">
                        <div class="speed-slider-container">
                            <input type="range" min="0" max="3" value="0" class="speed-slider" id="speedSlider">
                            <div class="speed-value" id="speedValue" style="display: none;">750ms</div>
                        </div>
                    </div>
                </div>
                <div class="mathscript-credit">by iUnknownBr</div>
            </div>
        `;
    document.body.appendChild(_0x3d849d);
    
    // Adicionar evento de clique ao cabeçalho para encolher/expandir o menu
    const header = document.querySelector('.mathscript-header');
    const content = document.querySelector('.mathscript-content');
    
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      
      // Salvar o estado do menu no localStorage
      const isCollapsed = header.classList.contains('collapsed');
      localStorage.setItem('mathScript-collapsed', isCollapsed);
      
      // Mostrar toast informativo
      sendToast(isCollapsed ? "🔽 Menu recolhido" : "🔼 Menu expandido", 1000);
    });
    
    // Verificar se o menu estava recolhido anteriormente
    const wasCollapsed = localStorage.getItem('mathScript-collapsed') === 'true';
    if (wasCollapsed) {
      header.classList.add('collapsed');
      content.classList.add('collapsed');
    }
    
    // Setup event listeners
    document.getElementById("autoCheck").onchange = event => {
      APP.cfg.auto = event.target.checked;
      document.getElementById("speedControlContainer").style.display = APP.cfg.auto ? "flex" : "none";
      sendToast(APP.cfg.auto ? "✅ Auto Complete Enabled" : "❌ Auto Complete Disabled", 2000);
    };
    
    // Configurar o slider de velocidade
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");
    
    // Definir o valor inicial do slider
    const initialIndex = APP.cfg.speedOptions.indexOf(APP.cfg.autoSpeed);
    speedSlider.value = initialIndex >= 0 ? initialIndex : 0;
    
    // Adicionar evento de mudança ao slider
    speedSlider.oninput = () => {
      const index = parseInt(speedSlider.value);
      const speed = APP.cfg.speedOptions[index];
      APP.cfg.autoSpeed = speed;
      speedValue.textContent = speed + "ms";
    };
    
    // Adicionar evento de mudança completa para mostrar toast
    speedSlider.onchange = () => {
      const index = parseInt(speedSlider.value);
      const speed = APP.cfg.speedOptions[index];
      sendToast(`⏱️ Velocidade alterada para ${speed}ms`, 2000);
    };
    
    document.getElementById("darkModeCheck").onchange = event => {
      APP.cfg.darkMode = event.target.checked;
      if (typeof DarkReader !== 'undefined') {
        if (APP.cfg.darkMode) {
          DarkReader.enable();
          sendToast("🌙 Dark Mode Enabled", 2000);
        } else {
          DarkReader.disable();
          sendToast("☀️ Dark Mode Disabled", 2000);
        }
      } else {
        console.error("DarkReader não está disponível");
        sendToast("⚠️ Dark Mode não disponível. Recarregue a página.", 3000);
      }
    };
    
    // Ativar Dark Mode por padrão
    if (APP.cfg.darkMode && typeof DarkReader !== 'undefined') {
      DarkReader.enable();
    }
  }
}

class Core {
  static init() {
    // Inicialização sequencial das funcionalidades
    this.setupMod();
    this.setupAuto();
  }
  
  static async loadExternalLibraries() {
    try {
      await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
      await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
      await loadScript("https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js");
      
      // Configurar o DarkReader após carregá-lo
      if (typeof DarkReader !== 'undefined') {
        DarkReader.setFetchMethod(window.fetch);
        if (APP.cfg.darkMode) {
          DarkReader.enable();
        }
      } else {
        console.error("DarkReader não foi carregado corretamente");
      }
      
      // Verificar se Toastify foi carregado antes de usar
      if (typeof Toastify !== 'undefined') {
        sendToast("📦 Script loaded successfully!");
      } else {
        console.error("Toastify não foi carregado corretamente");
      }
      
      console.clear();
    } catch (error) {
      console.error("Erro ao carregar bibliotecas externas:", error);
    }
  }
  
  static setupMod() {
    const messages = [
      "🔥 MathScript On Top!"
    ];
    
    const originalFetch = window.fetch;
    window.fetch = async function (_0xb0b6f5, _0x45b6eb) {
      const _0x238f50 = await originalFetch.apply(this, arguments);
      const _0xc057f3 = _0x238f50.clone();
      
      try {
        const _0x46e77b = await _0xc057f3.text();
        let _0x3cbec8 = JSON.parse(_0x46e77b);
        
        if (_0x3cbec8?.data?.assessmentItem?.item?.itemData) {
          let _0x3ca1c5 = JSON.parse(_0x3cbec8.data.assessmentItem.item.itemData);
          
          if (_0x3ca1c5.question.content[0] === _0x3ca1c5.question.content[0].toUpperCase() && APP.cfg.auto) {
            _0x3ca1c5.answerArea = {
              calculator: false
            };
            
            _0x3ca1c5.question.content = messages[Math.floor(Math.random() * messages.length)] + "[[✅ radio 1]]";
            _0x3ca1c5.question.widgets = {
              "radio 1": {
                type: "radio",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                  choices: [{
                    content: "✅",
                    correct: true
                  }],
                  randomize: false,
                  multipleSelect: false,
                  displayCount: null,
                  hasNoneOfTheAbove: false,
                  onePerLine: true,
                  deselectEnabled: false
                }
              }
            };
            
            _0x3cbec8.data.assessmentItem.item.itemData = JSON.stringify(_0x3ca1c5);
            sendToast("🔄 Question Bypassed", 1000);
            
            const _0x1aa163 = {
              status: _0x238f50.status,
              statusText: _0x238f50.statusText,
              headers: _0x238f50.headers
            };
            
            return new Response(JSON.stringify(_0x3cbec8), _0x1aa163);
          }
        }
      } catch (_0x2e758e) {}
      
      return _0x238f50;
    };
  }
  
  static async setupAuto() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const classNames = ["_1tuo6xk", "_ssxvf9l", "_1f0fvyce", "_rz7ls7u", "_1yok8f4", "_1e5cuk2a", "_s6zfc1u", "_4i5p5ae", "_1r8cd7xe"];
    const checkAnswerSelector = "[data-testid=\"exercise-check-answer\"]";
    
    function findAndClickByClass(className) {
      const element = document.getElementsByClassName(className)[0];
      if (element) {
        element.click();
        if (element.textContent === "Mostrar resumo") {
          sendToast("✅ Exercise completed!", 3000);
          playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
        }
      }
      return !!element;
    }
    
    // Função otimizada para processar elementos
    async function processElements() {
      if (!APP.cfg.auto) return;
      
      // Processar todos os botões de classe conhecida
      for (const className of classNames) {
        findAndClickByClass(className);
        await delay(APP.cfg.autoSpeed / 5);
      }
      
      // Verificar e clicar no botão de verificar resposta
      const checkAnswerButton = document.querySelector(checkAnswerSelector);
      if (checkAnswerButton) {
        checkAnswerButton.click();
        await delay(APP.cfg.autoSpeed / 5);
      }
    }
    
    // Loop principal otimizado
    while (true) {
      await processElements();
      await delay(APP.cfg.autoSpeed / 3);
    }
  }
}

// Inicialização otimizada - primeiro carregamos as bibliotecas, depois inicializamos a UI e o Core
async function initApp() {
  try {
    await Core.loadExternalLibraries();
    UI.init();
    Core.init();
    console.log(`MathScript v${APP.ver} iniciado com sucesso!`);
    sendToast(`🚀 MathScript v${APP.ver} iniciado!`, 3000);
  } catch (error) {
    console.error("Erro ao inicializar MathScript:", error);
    sendToast("⚠️ Erro ao inicializar MathScript", 5000);
  }
}

initApp();
