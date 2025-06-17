const MATH_APP = {
  version: "1.0.0",
  user: {
    id: 0
  },
  config: {
    mode: true,
    autoComplete: false,
    questionSpoof: true,
    darkTheme: true,
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
function showToast(message, duration = 5000, position = "bottom") {
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

class MathUI {
  static init() {
    const panel = document.createElement("div");
    panel.id = "MathKhan-panel";
    Object.assign(panel.style, {
      position: "fixed",
      top: "10px",
      right: "15px",
      width: "220px",
      background: "linear-gradient(145deg, #2a2a2a, #222)",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      padding: "12px",
      zIndex: "9999",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      border: "1px solid #444",
      maxWidth: "90%"
    });
    panel.innerHTML = `
            <style>
                .math-header {
                    color: #fff;
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #444;
                    cursor: pointer;
                    user-select: none;
                }
                .math-header:after {
                    content: "▼";
                    font-size: 12px;
                    margin-left: 5px;
                    transition: transform 0.3s ease;
                }
                .math-header.collapsed:after {
                    transform: rotate(-90deg);
                }
                .math-content {
                    transition: max-height 0.3s ease, opacity 0.3s ease;
                    max-height: 500px;
                    opacity: 1;
                    overflow: hidden;
                }
                .math-content.collapsed {
                    max-height: 0;
                    opacity: 0;
                }
                .math-version {
                    color: #888;
                    font-size: 12px;
                    font-weight: normal;
                }
                .math-option {
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
                    background-color: #444;
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
                .math-credit {
                    color: #888;
                    font-size: 11px;
                    text-align: center;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #444;
                }
                .speed-slider-container {
                    width: 100%;
                    margin-top: 5px;
                    padding: 0 2px;
                    box-sizing: border-box;
                }
                .speed-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: #444;
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
            </style>
            <div class="math-header">
                MathKhan <span class="math-version">${MATH_APP.version}</span>
            </div>
            <div class="math-content">
                <div class="math-option">
                    <span>Auto Complete</span>
                    <label class="switch">
                        <input type="checkbox" id="autoCompleteCheck">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="math-option">
                    <span>Question Spoof</span>
                    <label class="switch">
                        <input type="checkbox" id="spoofCheck" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="math-option">
                    <span>Dark Theme</span>
                    <label class="switch">
                        <input type="checkbox" id="darkThemeCheck" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="math-credit">by YourName</div>
            </div>
        `;
    document.body.appendChild(panel);
    
    // Add click event to header to collapse/expand menu
    const header = document.querySelector('.math-header');
    const content = document.querySelector('.math-content');
    
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      
      // Save menu state in localStorage
      const isCollapsed = header.classList.contains('collapsed');
      localStorage.setItem('MathKhan-collapsed', isCollapsed);
      
      // Show toast notification
      showToast(isCollapsed ? "🔽 Menu collapsed" : "🔼 Menu expanded", 1000);
    });
    
    // Check if the menu was previously collapsed
    const wasCollapsed = localStorage.getItem('MathKhan-collapsed') === 'true';
    if (wasCollapsed) {
      header.classList.add('collapsed');
      content.classList.add('collapsed');
    }
    
    // Setup event listeners
    document.getElementById("autoCompleteCheck").onchange = event => {
      MATH_APP.config.autoComplete = event.target.checked;
      showToast(MATH_APP.config.autoComplete ? "✅ Auto Complete Enabled" : "❌ Auto Complete Disabled", 2000);
    };
    
    document.getElementById("spoofCheck").onchange = event => {
      MATH_APP.config.questionSpoof = event.target.checked;
      showToast(MATH_APP.config.questionSpoof ? "✅ Question Spoof Enabled" : "❌ Question Spoof Disabled", 2000);
    };
    
    document.getElementById("darkThemeCheck").onchange = event => {
      MATH_APP.config.darkTheme = event.target.checked;
      if (typeof DarkReader !== 'undefined') {
        if (MATH_APP.config.darkTheme) {
          DarkReader.enable();
          showToast("🌙 Dark Theme Enabled", 2000);
        } else {
          DarkReader.disable();
          showToast("☀️ Dark Theme Disabled", 2000);
        }
      } else {
        console.error("DarkReader is not available");
        showToast("⚠️ Dark Theme not available. Please reload the page.", 3000);
      }
    };
    
    // Activate Dark Theme by default
    if (MATH_APP.config.darkTheme && typeof DarkReader !== 'undefined') {
      DarkReader.enable();
    }
  }
}

class MathCore {
  static init() {
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
        if (MATH_APP.config.darkTheme) {
          DarkReader.enable();
        }
      } else {
        console.error("DarkReader was not loaded correctly");
      }
      
      // Check if Toastify was loaded before using
      if (typeof Toastify !== 'undefined') {
        showToast("✅ Script loaded successfully!");
      } else {
        console.error("Toastify was not loaded correctly");
      }
      
      console.clear();
    } catch (error) {
      console.error("Error loading external libraries:", error);
    }
  }
  
  static setupMod() {
    const messages = [
      "🚀 MathKhan On Top!",
      "🤖 Made by YourName."
    ];
    
    const originalFetch = window.fetch;
    window.fetch = async function (url, options) {
      const response = await originalFetch.apply(this, arguments);
      const clonedResponse = response.clone();
      
      try {
        const text = await clonedResponse.text();
        let jsonResponse = JSON.parse(text);
        
        if (jsonResponse?.data?.assessmentItem?.item?.itemData) {
          let itemData = JSON.parse(jsonResponse.data.assessmentItem.item.itemData);
          
          if (itemData.question.content[0] === itemData.question.content[0].toUpperCase() && MATH_APP.config.questionSpoof) {
            itemData.answerArea = {
              calculator: false
            };
            
            itemData.question.content = messages[Math.floor(Math.random() * messages.length)] + "[[✔ radio 1]]";
            itemData.question.widgets = {
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
            
            jsonResponse.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            showToast("🔄 Question Bypassed", 1000);
            
            const responseDetails = {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            };
            
            return new Response(JSON.stringify(jsonResponse), responseDetails);
          }
        }
      } catch (error) {}
      
      return response;
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
          showToast("✅ Exercise completed!", 3000);
          playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
        }
      }
      return !!element;
    }
    
    // Optimized function to process elements
    async function processElements() {
      if (!MATH_APP.config.autoComplete) return;
      
      // Process all buttons of known class
      for (const className of classNames) {
        findAndClickByClass(className);
        await delay(MATH_APP.config.autoSpeed / 5);
      }
      
      // Check and click the check answer button
      const checkAnswerButton = document.querySelector(checkAnswerSelector);
      if (checkAnswerButton) {
        checkAnswerButton.click();
        await delay(MATH_APP.config.autoSpeed / 5);
      }
    }
    
    // Main loop optimized
    while (true) {
      await processElements();
      await delay(MATH_APP.config.autoSpeed / 3);
    }
  }
}

// Optimized initialization - first load libraries, then initialize UI and Core
async function initMathApp() {
  try {
    await MathCore.loadExternalLibraries();
    MathUI.init();
    MathCore.init();
    console.log(`MathKhan v${MATH_APP.version} started successfully!`);
    showToast(`🚀 MathKhan v${MATH_APP.version} started!`, 3000);
  } catch (error) {
    console.error("Error initializing MathKhan:", error);
    showToast("⚠️ Error initializing MathKhan", 5000);
  }
}

initMathApp();
