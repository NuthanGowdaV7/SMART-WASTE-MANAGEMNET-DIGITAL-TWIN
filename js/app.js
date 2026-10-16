/**
 * EcoTwin Enterprise - Master Application Orchestrator
 * Dayananda Sagar University - Campus Operations Platform
 * CODE CLASH 2.0 (Problem Statement 01)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize State and Modules
  let digitalTwin = null;
  let computerVision = null;
  const genAI = new GenAISustainabilityAdvisor();

  // Initialize Computer Vision with Neural Ensemble
  computerVision = new WasteComputerVision('cvCanvas', 'cvVideo', 'cvOverlay');
  window.cvInstance = computerVision; // Expose for quick chip actions

  // Live Font Switcher
  const fontSelector = document.getElementById('fontThemeSelector');
  const applyFontChoice = (choice) => {
    const root = document.documentElement;
    if (choice === 'figtree') {
      root.style.setProperty('--font-display', "'Figtree', sans-serif");
      root.style.setProperty('--font-sans', "'Figtree', sans-serif");
    } else if (choice === 'space') {
      root.style.setProperty('--font-display', "'Space Grotesk', sans-serif");
      root.style.setProperty('--font-sans', "'Space Grotesk', sans-serif");
    } else if (choice === 'lexend') {
      root.style.setProperty('--font-display', "'Lexend', sans-serif");
      root.style.setProperty('--font-sans', "'Lexend', sans-serif");
    } else if (choice === 'inter') {
      root.style.setProperty('--font-display', "'Inter', sans-serif");
      root.style.setProperty('--font-sans', "'Inter', sans-serif");
    } else { // default outfit + inter
      root.style.setProperty('--font-display', "'Outfit', 'Inter', sans-serif");
      root.style.setProperty('--font-sans', "'Inter', -apple-system, BlinkMacSystemFont, sans-serif");
    }
  };

  const savedFont = localStorage.getItem('ecotwin_font_choice') || 'outfit';
  if (fontSelector) {
    fontSelector.value = savedFont;
    applyFontChoice(savedFont);
    fontSelector.addEventListener('change', (e) => {
      const choice = e.target.value;
      applyFontChoice(choice);
      localStorage.setItem('ecotwin_font_choice', choice);
      showToast(`Font updated: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });
  } else {
    applyFontChoice(savedFont);
  }

  // Initialize 3D Digital Twin Spatial View
  if (window.THREE) {
    digitalTwin = new CampusDigitalTwin('canvas3DContainer', (selectedBin) => {
      openBinDetailDrawer(selectedBin);
    });
  }

  // Hook truck emptying callback to app notifications
  window.onCampusBinAutoEmptied = (bin) => {
    showToast(`🚛 EV Compactor Pickup: ${bin.name} emptied (0.0 kg, 8% baseline)`, 'success');
    renderTelemetryTable();
    updateCampusSummaryKPIs();
  };

  // 2. Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const viewSections = document.querySelectorAll('.view-section');

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-target');
      navTabs.forEach(t => t.classList.remove('active'));
      viewSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(targetView);
      if (targetEl) targetEl.classList.add('active');

      // Resize 3D canvas if switching to twin
      if (targetView === 'viewDigitalTwin' && digitalTwin) {
        setTimeout(() => digitalTwin.onWindowResize(), 100);
      }
    });
  });

  // 3. Render Enterprise IoT Telemetry Table
  function renderTelemetryTable() {
    const tbody = document.getElementById('telemetryTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    ECO_DATA.bins.forEach(bin => {
      const tr = document.createElement('tr');
      const isCritical = bin.fillLevel >= 80;
      const isWarning = bin.fillLevel >= 60 && bin.fillLevel < 80;
      const statusBadge = isCritical 
        ? `<span class="status-tag status-danger">Critical (${bin.fillLevel}%)</span>`
        : isWarning 
        ? `<span class="status-tag status-warning">Elevated (${bin.fillLevel}%)</span>`
        : `<span class="status-tag status-success">Normal (${bin.fillLevel}%)</span>`;

      tr.innerHTML = `
        <td><strong style="color: var(--primary-blue); font-family: var(--font-mono);">${bin.id}</strong></td>
        <td>
          <div style="font-weight: 700; color: var(--text-headline);">${bin.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${bin.zone} • ${bin.hardwareUid || 'DSU-IOT'}</div>
        </td>
        <td>
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${bin.colorTag}; margin-right:6px;"></span>
          ${bin.category}
        </td>
        <td>
          <div class="bar-fill-track">
            <div class="bar-fill-progress ${isCritical ? 'bar-red' : isWarning ? 'bar-amber' : 'bar-green'}" style="width: ${bin.fillLevel}%"></div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">${bin.fillLevel}% Full</div>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 600;">${bin.currentWeightKg} / ${bin.capacityKg} kg</td>
        <td style="font-family: var(--font-mono);">${bin.temperatureC.toFixed(1)} °C</td>
        <td style="font-family: var(--font-mono);">
          <span style="color: ${bin.gasMethanePpm > 80 ? 'var(--crimson-danger)' : 'var(--forest-green)'}; font-weight:700;">
            ${bin.gasMethanePpm} ppm
          </span>
        </td>
        <td style="font-family: var(--font-mono); color: var(--text-muted);">${bin.batteryVoltage || '3.88'} V</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-outline btn-sm view-bin-btn" data-id="${bin.id}">Inspect</button>
          <button class="btn btn-outline btn-sm empty-bin-btn" data-id="${bin.id}" style="color: var(--primary-blue);">Empty</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach row events
    document.querySelectorAll('.view-bin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const binId = btn.getAttribute('data-id');
        const bin = ECO_DATA.bins.find(b => b.id === binId);
        if (bin) {
          openBinDetailDrawer(bin);
          if (digitalTwin) digitalTwin.selectBin(binId);
        }
      });
    });

    document.querySelectorAll('.empty-bin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const binId = btn.getAttribute('data-id');
        const bin = ECO_DATA.bins.find(b => b.id === binId);
        if (bin) {
          bin.fillLevel = 6;
          bin.currentWeightKg = Number((bin.capacityKg * 0.06).toFixed(1));
          bin.status = "NORMAL";
          bin.lastEmptied = "Just now (Manual)";
          if (digitalTwin) digitalTwin.updateBinTelemetryVisual(bin.id);
          renderTelemetryTable();
          updateCampusSummaryKPIs();
          showToast(`Manual Action: ${bin.name} emptied successfully`, 'info');
        }
      });
    });
  }

  // 4. Update Header & Summary KPIs
  function updateCampusSummaryKPIs() {
    const totalBins = ECO_DATA.bins.length;
    const avgFill = Math.round(ECO_DATA.bins.reduce((sum, b) => sum + b.fillLevel, 0) / totalBins);
    const criticalCount = ECO_DATA.bins.filter(b => b.fillLevel >= 80).length;
    const totalWeight = ECO_DATA.bins.reduce((sum, b) => sum + b.currentWeightKg, 0).toFixed(0);

    const kpiAvgFill = document.getElementById('kpiAvgFill');
    if (kpiAvgFill) kpiAvgFill.textContent = `${avgFill}%`;

    const kpiCritical = document.getElementById('kpiCritical');
    if (kpiCritical) kpiCritical.textContent = criticalCount;

    const kpiWeight = document.getElementById('kpiWeight');
    if (kpiWeight) kpiWeight.textContent = `${totalWeight} kg`;

    const headerFill = document.getElementById('headerCampusFill');
    if (headerFill) headerFill.textContent = `${avgFill}%`;
  }

  // 5. Drawer & Modal Inspector for Bins
  const drawer = document.getElementById('binDetailDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  function openBinDetailDrawer(bin) {
    if (!drawer) return;
    document.getElementById('drawerBinId').textContent = bin.id;
    document.getElementById('drawerBinName').textContent = bin.name;
    document.getElementById('drawerBinZone').textContent = bin.zone;
    document.getElementById('drawerBinCategory').textContent = bin.category;
    document.getElementById('drawerBinFill').textContent = `${bin.fillLevel}%`;
    document.getElementById('drawerBinWeight').textContent = `${bin.currentWeightKg} / ${bin.capacityKg} kg`;
    document.getElementById('drawerBinTemp').textContent = `${bin.temperatureC.toFixed(1)} °C`;
    document.getElementById('drawerBinGas').textContent = `${bin.gasMethanePpm} ppm`;
    document.getElementById('drawerBinBattery').textContent = `${bin.batteryVoltage || '3.88'} V (${bin.batteryPct}%)`;
    document.getElementById('drawerBinAccuracy').textContent = `${bin.segregationAccuracy}%`;

    const alertBox = document.getElementById('drawerContaminationAlert');
    if (bin.contaminationDetected) {
      alertBox.style.display = 'block';
      alertBox.textContent = "⚠️ Cross-Contamination Alert: Foreign material detected by aperture camera.";
    } else {
      alertBox.style.display = 'none';
    }

    drawer.classList.add('open');
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  // 6. Camera Presets Controls for 3D View
  document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (digitalTwin) digitalTwin.focusCameraPreset(preset);
    });
  });

  // 7. Operational Simulation Controls
  const btnSimPeak = document.getElementById('btnSimPeak');
  if (btnSimPeak) {
    btnSimPeak.addEventListener('click', () => {
      const b1 = ECO_DATA.bins.find(b => b.id === 'BIN-01');
      const b2 = ECO_DATA.bins.find(b => b.id === 'BIN-02');
      if (b1) { b1.fillLevel = 96; b1.gasMethanePpm = 175; }
      if (b2) { b2.fillLevel = 91; }

      if (digitalTwin) {
        digitalTwin.updateBinTelemetryVisual('BIN-01');
        digitalTwin.updateBinTelemetryVisual('BIN-02');
      }
      renderTelemetryTable();
      updateCampusSummaryKPIs();
      showToast('⚠️ Simulation: Food Court Peak Lunch Rush! BIN-01 at 96% and BIN-02 at 91%', 'warning');
    });
  }

  const btnSimContamination = document.getElementById('btnSimContamination');
  if (btnSimContamination) {
    btnSimContamination.addEventListener('click', () => {
      const b2 = ECO_DATA.bins.find(b => b.id === 'BIN-02');
      if (b2) {
        b2.contaminationDetected = true;
        b2.segregationAccuracy = 74.2;
      }
      renderTelemetryTable();
      showToast('🚨 Optical Alert: Foreign liquid contamination detected in BIN-02!', 'danger');
    });
  }

  const btnSimDispatchTruck = document.getElementById('btnSimDispatchTruck');
  if (btnSimDispatchTruck) {
    btnSimDispatchTruck.addEventListener('click', () => {
      if (digitalTwin) {
        digitalTwin.calculateDynamicRoute();
        showToast('🚛 Autonomous EV Compactor Dispatched on Real-Time Optimized TSP Route', 'info');
      }
    });
  }

  const btnResetSimulation = document.getElementById('btnResetSimulation');
  if (btnResetSimulation) {
    btnResetSimulation.addEventListener('click', () => {
      ECO_DATA.bins.forEach(b => {
        b.fillLevel = Math.floor(Math.random() * 35) + 20;
        b.currentWeightKg = Number((b.capacityKg * (b.fillLevel / 100)).toFixed(1));
        b.contaminationDetected = false;
        b.gasMethanePpm = Math.floor(Math.random() * 20) + 10;
        if (digitalTwin) digitalTwin.updateBinTelemetryVisual(b.id);
      });
      renderTelemetryTable();
      updateCampusSummaryKPIs();
      showToast('Campus Digital Twin reset to baseline telemetry', 'success');
    });
  }

  // 8. Computer Vision Station Controls
  document.querySelectorAll('.preset-thumbnail').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.preset-thumbnail').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const sampleId = card.getAttribute('data-sample-id');
      computerVision.loadSample(sampleId);
    });
  });

  const btnStartWebcam = document.getElementById('btnStartWebcam');
  if (btnStartWebcam) {
    btnStartWebcam.addEventListener('click', () => {
      computerVision.startWebcam();
      showToast('Live camera feed initialized (720p HD Neural Detection)', 'info');
    });
  }

  const btnStopWebcam = document.getElementById('btnStopWebcam');
  if (btnStopWebcam) {
    btnStopWebcam.addEventListener('click', () => {
      computerVision.stopWebcam();
      computerVision.loadSample(ECO_DATA.cvSamples[0].id);
      showToast('Camera stopped. Restored benchmark sample mode', 'info');
    });
  }

  const btnDeepScan = document.getElementById('btnDeepScan');
  if (btnDeepScan) {
    btnDeepScan.addEventListener('click', () => {
      computerVision.triggerDeepMultimodalScan();
    });
  }

  const fileInput = document.getElementById('cvFileUpload');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        computerVision.handleImageUpload(e.target.files[0]);
        showToast(`Analyzed uploaded image: ${e.target.files[0].name}`, 'info');
      }
    });
  }

  const toggleSpeechBtn = document.getElementById('toggleSpeechBtn');
  if (toggleSpeechBtn) {
    toggleSpeechBtn.addEventListener('click', () => {
      computerVision.speechEnabled = !computerVision.speechEnabled;
      toggleSpeechBtn.textContent = computerVision.speechEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
      showToast(`Audio Guidance: ${computerVision.speechEnabled ? 'Enabled' : 'Muted'}`, 'info');
    });
  }

  // 9. Logistics Advisory Execution & Prompts
  const chatMessages = document.getElementById('genAiChatMessages');
  const chatInput = document.getElementById('genAiChatInput');
  const sendBtn = document.getElementById('btnGenAiSend');

  async function handleSendMessage(promptText) {
    const text = promptText || (chatInput ? chatInput.value.trim() : '');
    if (!text) return;

    if (chatInput) chatInput.value = '';

    appendChatMessage('user', text);
    const typingId = appendChatMessage('system', 'Analyzing real-time Digital Twin telemetry and generating optimal dispatch directive...');

    const response = await genAI.queryGemini(text);

    const msgEl = document.getElementById(typingId);
    if (msgEl) {
      msgEl.innerHTML = `<div class="bubble-sender-label" style="color:var(--primary-blue);">🤖 EcoTwin Enterprise Copilot</div><div>${formatMarkdown(response)}</div>`;
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleSendMessage());
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      handleSendMessage(prompt);
    });
  });

  function appendChatMessage(sender, text) {
    if (!chatMessages) return '';
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const div = document.createElement('div');
    div.className = `chat-card-bubble bubble-${sender}`;
    div.id = id;

    if (sender === 'user') {
      div.innerHTML = `<div class="bubble-sender-label">👤 Campus Operations Admin</div><div>${escapeHtml(text)}</div>`;
    } else {
      div.innerHTML = `<div class="bubble-sender-label" style="color:var(--primary-blue);">🤖 EcoTwin Enterprise Copilot</div><div>${formatMarkdown(text)}</div>`;
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
  }

  // 10. ESG Executive Report Modal
  const btnGenerateESG = document.getElementById('btnGenerateESG');
  const esgModal = document.getElementById('esgReportModal');
  const closeEsgModal = document.getElementById('closeEsgModal');
  const printReportBtn = document.getElementById('printReportBtn');

  if (btnGenerateESG) {
    btnGenerateESG.addEventListener('click', () => {
      const report = genAI.generateExecutiveReport();
      document.getElementById('esgReportTitle').textContent = report.title;
      document.getElementById('esgReportDate').textContent = `Generated on: ${report.generatedDate}`;
      document.getElementById('esgScoreVal').textContent = `${report.score}/100`;

      const kpiContainer = document.getElementById('esgReportKPIs');
      kpiContainer.innerHTML = '';
      report.kpis.forEach(k => {
        const card = document.createElement('div');
        card.style.cssText = 'background:#F8FAFC; border:1px solid #E2E8F0; padding:0.85rem; text-align:center; border-radius:8px;';
        card.innerHTML = `
          <div style="font-size:1.3rem; font-weight:800; color:var(--primary-blue); font-family:var(--font-mono);">${k.value}</div>
          <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; font-weight:600; margin-top:3px;">${k.label}</div>
          <div style="font-size:0.72rem; color:var(--forest-green); font-weight:600;">${k.change}</div>
        `;
        kpiContainer.appendChild(card);
      });

      const recList = document.getElementById('esgReportRecs');
      recList.innerHTML = '';
      report.recommendations.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        recList.appendChild(li);
      });

      if (esgModal) esgModal.classList.add('open');
    });
  }

  if (closeEsgModal) {
    closeEsgModal.addEventListener('click', () => {
      esgModal.classList.remove('open');
    });
  }

  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 11. Gemini API Key Configuration Modal
  const btnConfigApiKey = document.getElementById('btnConfigApiKey');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const closeApiKeyModal = document.getElementById('closeApiKeyModal');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const apiKeyInput = document.getElementById('geminiApiKeyInput');

  if (btnConfigApiKey) {
    btnConfigApiKey.addEventListener('click', () => {
      apiKeyInput.value = genAI.apiKey;
      apiKeyModal.classList.add('open');
    });
  }

  if (closeApiKeyModal) {
    closeApiKeyModal.addEventListener('click', () => {
      apiKeyModal.classList.remove('open');
    });
  }

  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener('click', () => {
      genAI.setApiKey(apiKeyInput.value);
      apiKeyModal.classList.remove('open');
      showToast('Gemini API configuration successfully saved', 'success');
    });
  }

  // 12. Periodic Telemetry Jitter Simulation
  setInterval(() => {
    const randomBin = ECO_DATA.bins[Math.floor(Math.random() * ECO_DATA.bins.length)];
    if (randomBin.fillLevel < 95) {
      randomBin.fillLevel = Math.min(100, randomBin.fillLevel + (Math.random() > 0.65 ? 1 : 0));
      randomBin.currentWeightKg = Number((randomBin.capacityKg * (randomBin.fillLevel / 100)).toFixed(1));
      randomBin.temperatureC += (Math.random() - 0.5) * 0.15;
      
      if (digitalTwin) digitalTwin.updateBinTelemetryVisual(randomBin.id);
      renderTelemetryTable();
      updateCampusSummaryKPIs();
    }
  }, 3500);

  // Initial renders
  renderTelemetryTable();
  updateCampusSummaryKPIs();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
});

// Helper: Live Clock
function updateLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
}

// Helper: Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'danger' ? '🚨' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// Helper: Markdown Formatter
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h4 style="color:var(--text-headline); font-weight:800; margin: 10px 0 4px 0;">$1</h4>')
    .replace(/^#### (.*$)/gim, '<h5 style="color:var(--primary-blue); font-weight:700; margin: 8px 0 3px 0;">$1</h5>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:var(--text-headline);">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 3px; color:var(--text-body);">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 3px; color:var(--text-body);">$1</li>')
    .replace(/\n\n/gim, '<br/><br/>');
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}
