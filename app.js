// ============================================================================
// NurAl-Amal (نور العمل) — 30 Days of Quranic Good Deeds & Habit Planner
// Core Application Logic & Modern Web Interactions
// Version 1.0.1 (updated 2026-11-01 22:18)
// ============================================================================

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Storage Keys & State
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    DEEDS: 'nuralamal_deeds_v1',
    REMINDERS: 'nuralamal_reminders_v1',
    WEEKLY_NOTES: 'nuralamal_weekly_notes_v1',
    THEME: 'nuralamal_theme_v1',
    MODE: 'nuralamal_mode_v1',
    SOUND: 'nuralamal_sound_v1',
    TASBIH: 'nuralamal_tasbih_v1',
    TASBIH_PHRASE: 'nuralamal_tasbih_phrase_v1',
    TASBIH_ROUNDS: 'nuralamal_tasbih_rounds_v1',
    ACTIVE_DAY: 'nuralamal_active_day_v1'
  };

  let state = {
    deeds: [],
    reminders: [],
    weeklyNotes: {},
    activeView: 'monthlyView',
    activeDay: 1,
    activeWeek: 1,
    searchQuery: '',
    selectedCategory: 'all',
    tasbihCount: 0,
    tasbihTarget: 33,
    tasbihPhrase: 'SubhanAllah',
    tasbihRounds: 1,
    soundEnabled: true,
    theme: 'emerald',
    mode: 'light'
  };

  // --------------------------------------------------------------------------
  // Web Audio Chime & Click Synthesizer (No external broken files)
  // --------------------------------------------------------------------------
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChimeSound() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Harmonic reflection chord (E5, G#5, B5, E6)
      const frequencies = [659.25, 830.61, 987.77, 1318.51];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  function playTasbihClick() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (err) {
      console.warn('Audio click error:', err);
    }
  }

  // --------------------------------------------------------------------------
  // Canvas Confetti Engine (Sparkles, Crescents, Stars)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animationFrameId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerConfetti(originX, originY) {
    if (!ctx) return;
    const count = 75;
    const colors = ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#3b82f6', '#8b5cf6', '#ec4899'];
    const startX = originX !== undefined ? originX : window.innerWidth / 2;
    const startY = originY !== undefined ? originY : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.4 ? 'circle' : (Math.random() > 0.5 ? 'rect' : 'crescent'),
        alpha: 1,
        gravity: 0.22,
        drag: 0.98
      });
    }

    if (!animationFrameId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.012;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'crescent') {
        ctx.font = `${p.size * 2}px serif`;
        ctx.fillText('🌙', -p.size, p.size);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }

      ctx.restore();
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animateConfetti);
    } else {
      animationFrameId = null;
    }
  }

  // --------------------------------------------------------------------------
  // Modern Web Guidance: Native Dialog closedby Fallback
  // (Pointerdown + pointerup coordinate check preventing false backdrop drags)
  // --------------------------------------------------------------------------
  function setupDialogFallbacks() {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e, dialog) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
        let pressedOutside = false;
        dialog.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, dialog); });
        dialog.addEventListener('pointerup', (e) => {
          if (pressedOutside && outside(e, dialog)) {
            dialog.close();
          }
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // Data Initialization & Persistence
  // --------------------------------------------------------------------------
  function initData() {
    try {
      const savedDeeds = localStorage.getItem(STORAGE_KEYS.DEEDS);
      if (savedDeeds) {
        state.deeds = JSON.parse(savedDeeds);
      } else if (typeof DEFAULT_DEEDS !== 'undefined') {
        state.deeds = JSON.parse(JSON.stringify(DEFAULT_DEEDS));
      }
    } catch (e) {
      console.error('Failed to parse deeds from storage, using defaults:', e);
      state.deeds = JSON.parse(JSON.stringify(DEFAULT_DEEDS));
    }

    // Ensure all deeds have transliteration & valid actionItems
    if (typeof DEFAULT_DEEDS !== 'undefined') {
      state.deeds.forEach(d => {
        if (!d.transliteration) {
          const def = DEFAULT_DEEDS.find(item => item.id === d.id);
          if (def && def.transliteration) d.transliteration = def.transliteration;
        }
        if (!d.actionItems || !Array.isArray(d.actionItems)) {
          d.actionItems = [{ id: `${d.id}-1`, text: d.title, done: false }];
        }
      });
    }

    try {
      const savedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (savedReminders) {
        state.reminders = JSON.parse(savedReminders);
      } else if (typeof DEFAULT_REMINDERS !== 'undefined') {
        state.reminders = JSON.parse(JSON.stringify(DEFAULT_REMINDERS));
      }
    } catch (e) {
      state.reminders = JSON.parse(JSON.stringify(DEFAULT_REMINDERS));
    }

    try {
      const savedWeeklyNotes = localStorage.getItem(STORAGE_KEYS.WEEKLY_NOTES);
      if (savedWeeklyNotes) {
        state.weeklyNotes = JSON.parse(savedWeeklyNotes);
      } else {
        state.weeklyNotes = { 1: '', 2: '', 3: '', 4: '', 5: '' };
      }
    } catch (e) {
      state.weeklyNotes = { 1: '', 2: '', 3: '', 4: '', 5: '' };
    }

    // Settings
    state.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'emerald';
    state.mode = localStorage.getItem(STORAGE_KEYS.MODE) || 'light';
    state.soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false';
    state.tasbihCount = parseInt(localStorage.getItem(STORAGE_KEYS.TASBIH) || '0', 10);
    state.tasbihPhrase = localStorage.getItem(STORAGE_KEYS.TASBIH_PHRASE) || 'SubhanAllah';
    state.tasbihRounds = parseInt(localStorage.getItem(STORAGE_KEYS.TASBIH_ROUNDS) || '1', 10);

    const savedActiveDay = parseInt(localStorage.getItem(STORAGE_KEYS.ACTIVE_DAY) || '0', 10);
    if (savedActiveDay >= 1 && savedActiveDay <= 30) {
      state.activeDay = savedActiveDay;
    } else {
      const nowDay = new Date().getDate();
      state.activeDay = ((nowDay - 1) % 30) + 1;
    }
    state.activeWeek = Math.min(5, Math.ceil(state.activeDay / 7));

    applyThemeAndMode();
  }

  function saveDeeds() {
    try {
      localStorage.setItem(STORAGE_KEYS.DEEDS, JSON.stringify(state.deeds));
    } catch (e) {
      console.error('Failed to save deeds:', e);
    }
    updateHeroStats();
    updateCategoryCountBadges();
  }

  function saveReminders() {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(state.reminders));
    } catch (e) {
      console.error('Failed to save reminders:', e);
    }
    updateNextReminderIndicator();
  }

  function saveWeeklyNotes() {
    try {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_NOTES, JSON.stringify(state.weeklyNotes));
    } catch (e) {
      console.error('Failed to save weekly notes:', e);
    }
  }

  function applyThemeAndMode() {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('data-mode', state.mode);

    const themeSelect = document.getElementById('themeSelector');
    if (themeSelect) themeSelect.value = state.theme;

    const modeIcon = document.getElementById('modeIcon');
    if (modeIcon) modeIcon.textContent = state.mode === 'dark' ? '☀️' : '🌙';

    const soundIcon = document.getElementById('soundIcon');
    if (soundIcon) soundIcon.textContent = state.soundEnabled ? '🔔' : '🔕';
  }

  // --------------------------------------------------------------------------
  // Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, icon = '✨') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // Hero Statistics & Robust Streak Calculator
  // --------------------------------------------------------------------------
  function updateHeroStats() {
    const completedCount = state.deeds.filter(d => d.completed).length;
    const totalCount = state.deeds.length || 30;
    const percent = Math.round((completedCount / totalCount) * 100);

    const completedVal = document.getElementById('completedVal');
    if (completedVal) completedVal.textContent = `${completedCount} / ${totalCount}`;

    const percentVal = document.getElementById('percentVal');
    if (percentVal) percentVal.textContent = `${percent}%`;

    const progressBarFill = document.getElementById('progressBarFill');
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;

    const progressStatusText = document.getElementById('progressStatusText');
    if (progressStatusText) progressStatusText.textContent = `${percent}% Complete`;

    // Robust streak calculation
    const streak = calculateStreak();
    const streakVal = document.getElementById('streakVal');
    if (streakVal) streakVal.textContent = `${streak} ${streak === 1 ? 'Day' : 'Days'}`;

    updateDailyViewElements();
  }

  function calculateStreak() {
    let maxRun = 0;
    let currentRun = 0;

    for (let i = 0; i < state.deeds.length; i++) {
      if (state.deeds[i].completed) {
        currentRun++;
        if (currentRun > maxRun) maxRun = currentRun;
      } else {
        currentRun = 0;
      }
    }

    let latestRun = 0;
    for (let i = state.deeds.length - 1; i >= 0; i--) {
      if (state.deeds[i].completed) {
        latestRun++;
      } else if (latestRun > 0) {
        break;
      }
    }

    return Math.max(latestRun, maxRun);
  }

  function updateCategoryCountBadges() {
    const total = state.deeds.length;
    const completed = state.deeds.filter(d => d.completed).length;
    const pending = total - completed;

    const countMap = {
      'count-all': total,
      'count-speech': state.deeds.filter(d => d.category === 'Speech & Character').length,
      'count-family': state.deeds.filter(d => d.category === 'Family & Kin').length,
      'count-charity': state.deeds.filter(d => d.category === 'Charity & Giving').length,
      'count-patience': state.deeds.filter(d => d.category === 'Patience & Forgiveness').length,
      'count-justice': state.deeds.filter(d => d.category === 'Justice & Integrity').length,
      'count-mercy': state.deeds.filter(d => d.category === 'Mercy & Community').length,
      'count-dhikr': state.deeds.filter(d => d.category === 'Worship & Dhikr').length,
      'count-completed': completed,
      'count-pending': pending
    };

    Object.keys(countMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = countMap[id];
    });
  }

  // --------------------------------------------------------------------------
  // VIEW 1: Monthly Plan Renderer
  // --------------------------------------------------------------------------
  function renderMonthlyGrid() {
    const grid = document.getElementById('monthlyGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const query = state.searchQuery.toLowerCase().trim();
    const filterCat = state.selectedCategory;

    // Show/hide search clear button
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }

    const filtered = state.deeds.filter(deed => {
      // Category filter
      if (filterCat === 'completed' && !deed.completed) return false;
      if (filterCat === 'pending' && deed.completed) return false;
      if (filterCat !== 'all' && filterCat !== 'completed' && filterCat !== 'pending') {
        if (deed.category !== filterCat) return false;
      }

      // Search query
      if (query) {
        const matchTitle = (deed.title || '').toLowerCase().includes(query);
        const matchRef = (deed.reference || '').toLowerCase().includes(query);
        const matchTrans = (deed.translation || '').toLowerCase().includes(query);
        const matchArabic = (deed.arabic || '').toLowerCase().includes(query);
        const matchWisdom = (deed.wisdom || '').toLowerCase().includes(query);
        const matchCategory = (deed.category || '').toLowerCase().includes(query);
        if (!matchTitle && !matchRef && !matchTrans && !matchArabic && !matchWisdom && !matchCategory) {
          return false;
        }
      }

      return true;
    });

    // Update search results count indicator
    const counterEl = document.getElementById('searchResultsCount');
    if (counterEl) {
      if (query || filterCat !== 'all') {
        counterEl.textContent = `Showing ${filtered.length} of ${state.deeds.length}`;
      } else {
        counterEl.textContent = '';
      }
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3>No matching deeds found</h3>
          <p>Try clearing your search query or selecting a different category filter.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(deed => {
      const card = document.createElement('article');
      card.className = `deed-card ${deed.completed ? 'completed' : ''}`;
      card.setAttribute('data-id', deed.id);

      const colorClass = deed.categoryColor || 'emerald';

      card.innerHTML = `
        <div class="card-top-bar">
          <span class="day-badge">Day ${deed.day}</span>
          <span class="category-tag ${colorClass}">${escapeHtml(deed.category)}</span>
        </div>

        <h3 class="card-title">${escapeHtml(deed.title)}</h3>

        <div class="arabic-snippet">${escapeHtml(deed.arabic)}</div>
        <span class="ayah-ref">${escapeHtml(deed.reference)}</span>
        <div class="deed-translation">"${escapeHtml(deed.translation)}"</div>

        <div class="action-preview">
          <strong>Key Action:</strong> ${escapeHtml(deed.actionItems?.[0]?.text || deed.title)}
        </div>

        <div class="card-footer">
          <div class="completion-toggle" data-action="toggle-complete">
            <div class="custom-checkbox" aria-label="Toggle completion">
              ${deed.completed ? '✓' : ''}
            </div>
            <span class="completion-label">${deed.completed ? 'Completed' : 'Mark Done'}</span>
          </div>

          <div class="card-actions-mini">
            <button class="btn-mini" data-action="focus" title="Open Daily Focus View">☀️ Focus</button>
            <button class="btn-mini" data-action="details" title="Read Details">📖 Info</button>
            <button class="btn-mini" data-action="edit" title="Edit this deed">✏️</button>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');
        if (action === 'toggle-complete') {
          e.stopPropagation();
          toggleDeedCompletion(deed.id, e.clientX, e.clientY);
        } else if (action === 'focus') {
          e.stopPropagation();
          jumpToDailyFocus(deed.day);
        } else if (action === 'details') {
          e.stopPropagation();
          openDetailModal(deed.id);
        } else if (action === 'edit') {
          e.stopPropagation();
          openEditModal(deed.id);
        }
      });

      grid.appendChild(card);
    });
  }

  function toggleDeedCompletion(deedId, clientX, clientY) {
    const deed = state.deeds.find(d => d.id === deedId);
    if (!deed) return;

    deed.completed = !deed.completed;
    deed.completedAt = deed.completed ? new Date().toISOString() : null;

    if (deed.completed) {
      playChimeSound();
      triggerConfetti(clientX, clientY);
      showToast(`Mabrook! Day ${deed.day} marked as completed.`, '🌟');
    }

    saveDeeds();
    renderMonthlyGrid();
    renderWeeklyView();
    updateDailyViewElements();
    renderYearlyHeatmap();
  }

  // --------------------------------------------------------------------------
  // VIEW 2: Weekly Plan Renderer
  // --------------------------------------------------------------------------
  function renderWeeklyView() {
    const week = state.activeWeek;
    const weekThemes = {
      1: {
        title: "Week 1: Character Foundations & Integrity (Days 1–7)",
        desc: "Build the spiritual bedrock of your everyday life through truthful speech, kindness to parents, secret charity, and gracious forgiveness."
      },
      2: {
        title: "Week 2: Compassion, Brotherhood & Kinship (Days 8–14)",
        desc: "Strengthen relationships through warm greetings, purifying the tongue from gossip, comforting orphans, and walking with gentle humility."
      },
      3: {
        title: "Week 3: Justice, Truth & Inner Mindfulness (Days 15–21)",
        desc: "Stand firmly for ethical truth, practice fair dealings, pursue knowledge, lighten others' burdens, and tranquilize the heart with Dhikr."
      },
      4: {
        title: "Week 4: Righteous Synergy, Tawbah & Family (Days 22–28)",
        desc: "Cooperate in community virtues, seek sincere forgiveness, uphold kinship ties, eliminate wasteful excess, and strive for Ihsan."
      },
      5: {
        title: "Days 29–30: Stewardship, Shukr & Lifelong Continuity",
        desc: "Protect Allah's creation, celebrate your month with exuberant praise (Tahmid) and humble Istighfar, turning deeds into lifelong habits."
      }
    };

    const theme = weekThemes[week] || weekThemes[1];
    const themeTitle = document.getElementById('weekThemeTitle');
    const themeDesc = document.getElementById('weekThemeDescription');
    if (themeTitle) themeTitle.textContent = theme.title;
    if (themeDesc) themeDesc.textContent = theme.desc;

    // Filter deeds for this week
    const startDay = (week - 1) * 7 + 1;
    const endDay = week === 5 ? 30 : Math.min(week * 7, 30);

    const weekDeeds = state.deeds.filter(d => d.day >= startDay && d.day <= endDay);
    const completedWeekCount = weekDeeds.filter(d => d.completed).length;

    const ratioDisplay = document.getElementById('weekCompletedRatio');
    if (ratioDisplay) ratioDisplay.textContent = `${completedWeekCount}/${weekDeeds.length}`;

    // Render Days List
    const daysList = document.getElementById('weekDaysList');
    if (daysList) {
      daysList.innerHTML = '';
      weekDeeds.forEach(deed => {
        const row = document.createElement('div');
        row.className = `week-day-row ${deed.completed ? 'completed' : ''}`;
        row.innerHTML = `
          <div class="week-day-label">Day ${deed.day}</div>
          <div class="week-day-content">
            <h4>${escapeHtml(deed.title)}</h4>
            <p>${escapeHtml(deed.reference)} — "${escapeHtml(deed.translation)}"</p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="btn-mini" data-focus="${deed.day}">Focus</button>
            <button class="btn-primary" data-toggle="${deed.id}" style="padding: 0.35rem 0.85rem; font-size: 0.75rem;">
              ${deed.completed ? '✓ Done' : 'Complete'}
            </button>
          </div>
        `;

        row.querySelector('[data-focus]')?.addEventListener('click', () => {
          jumpToDailyFocus(deed.day);
        });

        row.querySelector('[data-toggle]')?.addEventListener('click', (e) => {
          toggleDeedCompletion(deed.id, e.clientX, e.clientY);
        });

        daysList.appendChild(row);
      });
    }

    // Weekly Notes Input
    const weeklyNotesInput = document.getElementById('weeklyNotesInput');
    if (weeklyNotesInput) {
      weeklyNotesInput.value = state.weeklyNotes[week] || '';
    }
  }

  // --------------------------------------------------------------------------
  // VIEW 3: Daily Focus Mode Renderer
  // --------------------------------------------------------------------------
  function renderDailyFocus() {
    const deed = state.deeds.find(d => d.day === state.activeDay) || state.deeds[0];
    if (!deed) return;

    const navTitle = document.getElementById('dailyNavTitle');
    if (navTitle) navTitle.textContent = `Day ${deed.day} of 30`;

    const badge = document.getElementById('dailyBadge');
    if (badge) badge.textContent = `Day ${deed.day}`;

    const catTag = document.getElementById('dailyCategory');
    if (catTag) {
      catTag.textContent = deed.category;
      catTag.className = `category-tag ${deed.categoryColor || 'emerald'}`;
    }

    const title = document.getElementById('dailyTitle');
    if (title) title.textContent = deed.title;

    const arabic = document.getElementById('dailyArabic');
    if (arabic) arabic.textContent = deed.arabic;

    const ref = document.getElementById('dailyRef');
    if (ref) ref.textContent = deed.reference;

    const trans = document.getElementById('dailyTranslation');
    if (trans) trans.textContent = `"${deed.translation}"`;

    const transliteration = document.getElementById('dailyTransliteration');
    if (transliteration) {
      transliteration.textContent = deed.transliteration || 'Recite with reverence and presence.';
    }

    const wisdom = document.getElementById('dailyWisdom');
    if (wisdom) wisdom.textContent = deed.wisdom;

    // Reset blur filters
    document.getElementById('dailyArabicFrame')?.classList.remove('hidden-blur');
    document.getElementById('dailyTranslation')?.classList.remove('hidden-blur');

    // Render 3 Micro-tasks
    const tasksList = document.getElementById('dailyTasksList');
    if (tasksList) {
      tasksList.innerHTML = '';
      (deed.actionItems || []).forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = `task-item ${item.done ? 'done' : ''}`;
        itemEl.innerHTML = `
          <input type="checkbox" ${item.done ? 'checked' : ''} style="cursor: pointer; width: 18px; height: 18px; accent-color: var(--primary);">
          <div style="flex: 1; font-size: 0.9rem;">${escapeHtml(item.text)}</div>
        `;

        itemEl.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const checkbox = itemEl.querySelector('input');
            checkbox.checked = !checkbox.checked;
          }
          item.done = itemEl.querySelector('input').checked;
          itemEl.classList.toggle('done', item.done);
          saveDeeds();

          if (deed.actionItems.every(t => t.done) && !deed.completed) {
            playChimeSound();
            showToast('All daily micro-actions checked off!', '🎯');
          }
        });

        tasksList.appendChild(itemEl);
      });
    }

    // Daily Journal Textarea
    const journalInput = document.getElementById('dailyJournalInput');
    if (journalInput) {
      journalInput.value = deed.userNotes || '';
    }

    // Setup social share links for current deed
    setupDailyShareLinks(deed);

    updateDailyViewElements();
  }

  function setupDailyShareLinks(deed) {
    const shareText = `🌙 NurAl-Amal — Day ${deed.day}: ${deed.title}\n\n"${deed.arabic}"\n${deed.reference}\n\n"${deed.translation}"\n\nKey Deed: ${deed.actionItems?.[0]?.text || ''}`;
    const encodedText = encodeURIComponent(shareText);

    const waBtn = document.getElementById('dailyWhatsappShareBtn');
    if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${encodedText}`;

    const tgBtn = document.getElementById('dailyTelegramShareBtn');
    if (tgBtn) tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`;

    const copyBtn = document.getElementById('dailyCopyShareBtn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText);
          showToast('Shareable card copied to clipboard!', '📋');
        }
      };
    }
  }

  function updateDailyViewElements() {
    const deed = state.deeds.find(d => d.day === state.activeDay);
    if (!deed) return;

    const completeBtn = document.getElementById('dailyToggleCompleteBtn');
    const completeIcon = document.getElementById('dailyCompleteIcon');
    const completeText = document.getElementById('dailyCompleteText');

    if (completeBtn && completeText) {
      if (deed.completed) {
        completeBtn.style.background = '#059669';
        completeIcon.textContent = '✓';
        completeText.textContent = `Day ${deed.day} is Completed (Click to Undo)`;
      } else {
        completeBtn.style.background = 'var(--primary-gradient)';
        completeIcon.textContent = '★';
        completeText.textContent = `Mark Day ${deed.day} as Completed`;
      }
    }
  }

  function jumpToDailyFocus(dayNum) {
    state.activeDay = dayNum;
    state.activeWeek = Math.min(5, Math.ceil(dayNum / 7));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DAY, state.activeDay);
    switchView('dailyView');
    renderDailyFocus();
  }

  // --------------------------------------------------------------------------
  // Web Speech Synthesis (Ayah Pronunciation & English Voice Readout)
  // --------------------------------------------------------------------------
  function speakCurrentAyah() {
    const deed = state.deeds.find(d => d.day === state.activeDay);
    if (!deed) return;

    if (!('speechSynthesis' in window)) {
      playChimeSound();
      showToast('Speech synthesis not supported in this browser.', 'ℹ️');
      return;
    }

    window.speechSynthesis.cancel();

    const spokenText = `${deed.reference}. ${deed.translation}. Today's good deed: ${deed.actionItems?.[0]?.text || deed.title}`;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      showToast('Speaking Quranic translation & guidance...', '🔊');
    };

    window.speechSynthesis.speak(utterance);
  }

  // --------------------------------------------------------------------------
  // VIEW 4: Yearly Virtues & 365-Day Activity Heatmap (True Timestamping)
  // --------------------------------------------------------------------------
  function renderYearlyHeatmap() {
    const grid = document.getElementById('yearlyHeatmapGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const today = new Date();
    const currentYear = today.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    let activeDaysCount = 0;

    // Collect all exact completion dates (YYYY-MM-DD)
    const completedDatesMap = {};
    state.deeds.forEach(d => {
      if (d.completed && d.completedAt) {
        const dateStr = d.completedAt.slice(0, 10);
        completedDatesMap[dateStr] = (completedDatesMap[dateStr] || 0) + 1;
      }
    });

    for (let dayIdx = 0; dayIdx < 365; dayIdx++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + dayIdx);

      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';

      const isoDate = cellDate.toISOString().slice(0, 10);
      const isCompleted = !!completedDatesMap[isoDate];
      const completedCount = completedDatesMap[isoDate] || 0;

      if (isCompleted) {
        activeDaysCount++;
        const level = Math.min(4, completedCount);
        cell.setAttribute('data-level', level);
      }

      const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      cell.title = `${dateStr}: ${isCompleted ? `${completedCount} deed(s) completed` : 'No recorded activity'}`;

      cell.addEventListener('click', () => {
        showToast(`${dateStr} • ${isCompleted ? `${completedCount} good deed(s) completed!` : 'Plan your next deed!'}`, '🗓️');
      });

      grid.appendChild(cell);
    }

    const totalActiveDisplay = document.getElementById('yearlyTotalActiveDays');
    if (totalActiveDisplay) {
      totalActiveDisplay.textContent = `${activeDaysCount} Active Habit Days in ${currentYear}`;
    }
  }

  function renderTwelveMonthsThemes() {
    const grid = document.getElementById('twelveMonthsGrid');
    if (!grid || typeof YEARLY_MONTHS_THEMES === 'undefined') return;

    grid.innerHTML = '';

    YEARLY_MONTHS_THEMES.forEach(m => {
      const card = document.createElement('div');
      card.className = 'month-theme-card';
      card.innerHTML = `
        <div class="month-num-badge">Month ${m.month} • ${escapeHtml(m.name)}</div>
        <h4 class="month-theme-title">${escapeHtml(m.theme)}</h4>
        <div class="month-ayah-quote">${escapeHtml(m.ayah)}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem;">Surah (${m.ref})</div>
        <p class="month-focus-text">${escapeHtml(m.focus)}</p>
      `;
      grid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // Digital Tasbih (Dhikr Companion with Rounds, Haptics & Progress)
  // --------------------------------------------------------------------------
  function setupTasbih() {
    const display = document.getElementById('tasbihDisplay');
    const countBtn = document.getElementById('tasbihCountBtn');
    const resetBtn = document.getElementById('tasbihResetBtn');
    const targetSelect = document.getElementById('tasbihTargetSelect');
    const phraseSelect = document.getElementById('tasbihPhraseSelect');
    const progressFill = document.getElementById('tasbihProgressFill');
    const roundBadge = document.getElementById('tasbihRoundBadge');

    function updateDisplay() {
      if (display) display.textContent = state.tasbihCount;
      if (roundBadge) roundBadge.textContent = `Round ${state.tasbihRounds}`;

      const target = parseInt(targetSelect?.value || '33', 10);
      if (progressFill) {
        if (target < 900) {
          const currentInRound = state.tasbihCount % target;
          const pct = Math.min(100, Math.round((currentInRound / target) * 100));
          progressFill.style.width = `${pct}%`;
        } else {
          progressFill.style.width = '100%';
        }
      }

      localStorage.setItem(STORAGE_KEYS.TASBIH, state.tasbihCount);
      localStorage.setItem(STORAGE_KEYS.TASBIH_ROUNDS, state.tasbihRounds);
      localStorage.setItem(STORAGE_KEYS.TASBIH_PHRASE, state.tasbihPhrase);
    }

    function incrementTasbih() {
      state.tasbihCount++;
      playTasbihClick();

      // Haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }

      const target = parseInt(targetSelect?.value || '33', 10);
      if (target < 900 && state.tasbihCount > 0 && state.tasbihCount % target === 0) {
        state.tasbihRounds++;
        playChimeSound();
        triggerConfetti();
        if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
        showToast(`Alhamdulillah! Completed Round ${state.tasbihRounds - 1} (${target} Dhikr)!`, '📿');
      }

      updateDisplay();
    }

    if (display) display.addEventListener('click', incrementTasbih);
    if (countBtn) countBtn.addEventListener('click', incrementTasbih);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.tasbihCount = 0;
        state.tasbihRounds = 1;
        updateDisplay();
        showToast('Tasbih counter reset.', '🔄');
      });
    }

    if (targetSelect) {
      targetSelect.addEventListener('change', (e) => {
        state.tasbihTarget = parseInt(e.target.value, 10);
        updateDisplay();
      });
    }

    if (phraseSelect) {
      phraseSelect.value = state.tasbihPhrase;
      phraseSelect.addEventListener('change', (e) => {
        state.tasbihPhrase = e.target.value;
        updateDisplay();
        showToast(`Dhikr set to ${e.target.options[e.target.selectedIndex].text}`, '📿');
      });
    }

    // Spacebar listener for counting when on daily view
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && state.activeView === 'dailyView') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          incrementTasbih();
        }
      }
    });

    updateDisplay();
  }

  // --------------------------------------------------------------------------
  // Reminders & Browser Push Notification Scheduler
  // --------------------------------------------------------------------------
  function renderRemindersList() {
    const list = document.getElementById('remindersListContainer');
    if (!list) return;

    list.innerHTML = '';
    if (state.reminders.length === 0) {
      list.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">No reminders scheduled yet.</p>`;
      return;
    }

    state.reminders.forEach(rem => {
      const item = document.createElement('div');
      item.className = 'reminder-item';
      item.innerHTML = `
        <div class="reminder-meta">
          <h5>${escapeHtml(rem.title)}</h5>
          <p>⏰ ${escapeHtml(rem.time)} • ${escapeHtml(rem.frequency)}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <label class="switch" title="Toggle active">
            <input type="checkbox" ${rem.enabled ? 'checked' : ''} data-id="${rem.id}">
            <span class="slider"></span>
          </label>
          <button class="btn-mini" data-delete="${rem.id}" style="color: var(--accent-rose); border-color: rgba(225, 29, 72, 0.3);">🗑️</button>
        </div>
      `;

      item.querySelector('input[type="checkbox"]')?.addEventListener('change', (e) => {
        rem.enabled = e.target.checked;
        saveReminders();
        showToast(`Reminder "${rem.title}" ${rem.enabled ? 'activated' : 'paused'}.`, '⏰');
      });

      item.querySelector('[data-delete]')?.addEventListener('click', () => {
        state.reminders = state.reminders.filter(r => r.id !== rem.id);
        saveReminders();
        renderRemindersList();
        showToast('Reminder deleted.', '🗑️');
      });

      list.appendChild(item);
    });
  }

  function updateNextReminderIndicator() {
    const pill = document.getElementById('nextReminderPill');
    if (!pill) return;

    const activeReminders = state.reminders.filter(r => r.enabled);
    if (activeReminders.length === 0) {
      pill.textContent = 'None';
      return;
    }

    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    let nextRem = null;
    let minDiff = Infinity;

    activeReminders.forEach(r => {
      const parts = r.time.split(':').map(Number);
      const rMin = parts[0] * 60 + parts[1];
      let diff = rMin - currentMin;
      if (diff < 0) diff += 24 * 60; // Next day
      if (diff < minDiff) {
        minDiff = diff;
        nextRem = r;
      }
    });

    if (nextRem) {
      pill.textContent = `Next: ${nextRem.time}`;
    }
  }

  function startReminderChecker() {
    updateNextReminderIndicator();

    setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const dayOfWeek = now.getDay();

      state.reminders.forEach(rem => {
        if (!rem.enabled) return;
        if (rem.time !== currentTimeStr) return;

        if (rem.frequency === 'Weekdays' && (dayOfWeek === 0 || dayOfWeek === 6)) return;
        if (rem.frequency === 'Fridays' && dayOfWeek !== 5) return;

        const guardKey = `reminder_fired_${rem.id}_${now.toDateString()}_${currentTimeStr}`;
        if (sessionStorage.getItem(guardKey)) return;
        sessionStorage.setItem(guardKey, 'true');

        triggerReminderAlert(rem);
      });

      updateNextReminderIndicator();
    }, 20000);
  }

  function triggerReminderAlert(rem) {
    playChimeSound();

    // Trigger Floating In-App Banner
    const banner = document.getElementById('inAppAlarmBanner');
    const titleEl = document.getElementById('alarmBannerTitle');
    const textEl = document.getElementById('alarmBannerText');

    if (banner && titleEl && textEl) {
      titleEl.textContent = `⏰ ${rem.title}`;
      textEl.textContent = `Time for your daily Quranic reflection: "${state.deeds[state.activeDay - 1]?.title || 'Daily Good Deed'}"`;
      banner.classList.add('active');

      setTimeout(() => {
        banner.classList.remove('active');
      }, 9000);
    }

    showToast(`⏰ Reminder: ${rem.title}`, '🕌');

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`NurAl-Amal: ${rem.title}`, {
          body: `Time for your daily Quranic reflection and deed!`,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌙</text></svg>'
        });
      } catch (err) {
        console.warn('Notification error:', err);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Modals Management (Modern `<dialog closedby="any">`)
  // --------------------------------------------------------------------------
  function openEditModal(deedId, isNew = false) {
    const deed = state.deeds.find(d => d.id === deedId) || state.deeds[0];
    if (!deed && !isNew) return;

    const modal = document.getElementById('editDeedModal');
    if (!modal) return;

    document.getElementById('editDeedId').value = isNew ? 'new' : deed.id;
    document.getElementById('editDay').value = isNew ? Math.min(30, state.deeds.length + 1) : deed.day;
    document.getElementById('editTitle').value = isNew ? '' : deed.title;
    document.getElementById('editCategory').value = isNew ? 'Speech & Character' : deed.category;
    document.getElementById('editArabic').value = isNew ? '' : deed.arabic;
    document.getElementById('editRef').value = isNew ? '' : deed.reference;
    document.getElementById('editTranslation').value = isNew ? '' : deed.translation;
    document.getElementById('editWisdom').value = isNew ? '' : deed.wisdom;

    // Render action items list
    renderEditActionItemsList(isNew ? [] : (deed.actionItems || []));

    modal.showModal();
  }

  function renderEditActionItemsList(items) {
    const list = document.getElementById('editActionItemsList');
    if (!list) return;

    list.innerHTML = '';
    const workingItems = items.length > 0 ? items : [{ text: '' }];

    workingItems.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'action-item-edit-row';
      row.innerHTML = `
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; width: 16px;">${idx + 1}.</span>
        <input type="text" class="action-item-edit-input" value="${escapeHtml(item.text || '')}" placeholder="Action step ${idx + 1}..." required>
        <button type="button" class="btn-remove-action" title="Remove Step">✕</button>
      `;

      row.querySelector('.btn-remove-action')?.addEventListener('click', () => {
        row.remove();
      });

      list.appendChild(row);
    });
  }

  function openDetailModal(deedId) {
    const deed = state.deeds.find(d => d.id === deedId);
    if (!deed) return;

    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailModalBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span class="day-badge" style="font-size: 0.8rem;">Day ${deed.day}</span>
        <span class="category-tag ${deed.categoryColor || 'emerald'}">${escapeHtml(deed.category)}</span>
      </div>

      <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem;">${escapeHtml(deed.title)}</h3>

      <div class="arabic-ornate-frame" style="padding: 1.25rem; margin-bottom: 1rem;">
        <div class="arabic-large" style="font-size: 1.8rem;">${escapeHtml(deed.arabic)}</div>
        <div class="ayah-citation-large">${escapeHtml(deed.reference)}</div>
      </div>

      <div class="translation-large" style="font-size: 0.98rem; margin-bottom: 1.25rem;">
        "${escapeHtml(deed.translation)}"
      </div>

      <div class="wisdom-box" style="margin-bottom: 1rem;">
        <h4>Spiritual Wisdom</h4>
        <p style="font-size: 0.88rem;">${escapeHtml(deed.wisdom)}</p>
      </div>

      <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Action Items:</h4>
      <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-main); margin-bottom: 1rem;">
        ${(deed.actionItems || []).map(item => `<li>${escapeHtml(item.text)}</li>`).join('')}
      </ul>
    `;

    document.getElementById('detailJumpFocusBtn').onclick = () => {
      modal.close();
      jumpToDailyFocus(deed.day);
    };

    document.getElementById('detailShareBtn').onclick = () => {
      const shareText = `🌙 NurAl-Amal — Day ${deed.day}: ${deed.title}\n\n"${deed.arabic}"\n${deed.reference}\n\n"${deed.translation}"\n\nDaily Good Deed: ${deed.actionItems?.[0]?.text || ''}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        showToast('Shareable quote card copied to clipboard!', '📋');
      }
    };

    modal.showModal();
  }

  // --------------------------------------------------------------------------
  // Navigation & View Switching
  // --------------------------------------------------------------------------
  function switchView(viewId) {
    state.activeView = viewId;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      const matches = btn.getAttribute('data-view') === viewId;
      btn.classList.toggle('active', matches);
      btn.setAttribute('aria-selected', matches ? 'true' : 'false');
    });

    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === viewId);
    });

    if (viewId === 'monthlyView') {
      renderMonthlyGrid();
    } else if (viewId === 'weeklyView') {
      renderWeeklyView();
    } else if (viewId === 'dailyView') {
      renderDailyFocus();
    } else if (viewId === 'yearlyView') {
      renderYearlyHeatmap();
      renderTwelveMonthsThemes();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // Event Bindings
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // View Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) switchView(view);
      });
    });

    // Color Theme Picker
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => {
        state.theme = e.target.value;
        localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
        applyThemeAndMode();
        showToast(`Theme changed to ${e.target.options[e.target.selectedIndex].text}`, '🎨');
      });
    }

    // Mode Toggle (Light/Dark)
    const modeToggleBtn = document.getElementById('modeToggleBtn');
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener('click', () => {
        state.mode = state.mode === 'light' ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
        applyThemeAndMode();
        showToast(`${state.mode === 'dark' ? 'Dark' : 'Light'} mode enabled.`, state.mode === 'dark' ? '🌙' : '☀️');
      });
    }

    // Sound FX Toggle
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem(STORAGE_KEYS.SOUND, state.soundEnabled ? 'true' : 'false');
        applyThemeAndMode();
        if (state.soundEnabled) playChimeSound();
        showToast(`Audio chimes ${state.soundEnabled ? 'enabled' : 'muted'}.`, state.soundEnabled ? '🔔' : '🔕');
      });
    }

    // Search Input & Clear Search Button
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMonthlyGrid();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        state.searchQuery = '';
        renderMonthlyGrid();
      });
    }

    // Category Filter Chips
    const categoryContainer = document.getElementById('categoryFilterContainer');
    if (categoryContainer) {
      categoryContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        categoryContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        state.selectedCategory = chip.getAttribute('data-category') || 'all';
        renderMonthlyGrid();
      });
    }

    // Week Selector Tabs
    const weekSelector = document.getElementById('weekSelectorBar');
    if (weekSelector) {
      weekSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.week-tab-btn');
        if (!btn) return;

        weekSelector.querySelectorAll('.week-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.activeWeek = parseInt(btn.getAttribute('data-week') || '1', 10);
        renderWeeklyView();
      });
    }

    // Weekly Notes Input autosave
    const weeklyNotesInput = document.getElementById('weeklyNotesInput');
    if (weeklyNotesInput) {
      weeklyNotesInput.addEventListener('input', (e) => {
        state.weeklyNotes[state.activeWeek] = e.target.value;
        saveWeeklyNotes();
      });
    }

    // Daily Focus Previous / Next Day Buttons & Keyboard Navigation
    const prevDayBtn = document.getElementById('prevDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');

    function navigatePrevDay() {
      state.activeDay = state.activeDay > 1 ? state.activeDay - 1 : 30;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DAY, state.activeDay);
      renderDailyFocus();
    }

    function navigateNextDay() {
      state.activeDay = state.activeDay < 30 ? state.activeDay + 1 : 1;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DAY, state.activeDay);
      renderDailyFocus();
    }

    if (prevDayBtn) prevDayBtn.addEventListener('click', navigatePrevDay);
    if (nextDayBtn) nextDayBtn.addEventListener('click', navigateNextDay);

    window.addEventListener('keydown', (e) => {
      if (state.activeView === 'dailyView') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigatePrevDay();
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateNextDay();
          }
        }
      }
    });

    // Daily Focus Big Toggle Complete Button
    const dailyToggleBtn = document.getElementById('dailyToggleCompleteBtn');
    if (dailyToggleBtn) {
      dailyToggleBtn.addEventListener('click', (e) => {
        toggleDeedCompletion(state.activeDay, e.clientX, e.clientY);
      });
    }

    // Memorization Assistant Controls
    const voiceReadoutBtn = document.getElementById('voiceReadoutBtn');
    if (voiceReadoutBtn) {
      voiceReadoutBtn.addEventListener('click', speakCurrentAyah);
    }

    const toggleHideArabicBtn = document.getElementById('toggleHideArabicBtn');
    if (toggleHideArabicBtn) {
      toggleHideArabicBtn.addEventListener('click', () => {
        const frame = document.getElementById('dailyArabicFrame');
        if (frame) {
          const isHidden = frame.classList.toggle('hidden-blur');
          toggleHideArabicBtn.textContent = isHidden ? '👁️ Reveal Arabic' : '👁️ Hide Arabic';
          showToast(isHidden ? 'Arabic hidden to test your memory!' : 'Arabic revealed!', '🧠');
        }
      });
    }

    const toggleHideTransBtn = document.getElementById('toggleHideTransBtn');
    if (toggleHideTransBtn) {
      toggleHideTransBtn.addEventListener('click', () => {
        const trans = document.getElementById('dailyTranslation');
        if (trans) {
          const isHidden = trans.classList.toggle('hidden-blur');
          toggleHideTransBtn.textContent = isHidden ? '👁️ Reveal Meaning' : '👁️ Hide Meaning';
          showToast(isHidden ? 'Meaning hidden for recall!' : 'Meaning revealed!', '🧠');
        }
      });
    }

    // Daily Chime Button
    const dailyAudioBtn = document.getElementById('dailyAudioChimeBtn');
    if (dailyAudioBtn) {
      dailyAudioBtn.addEventListener('click', () => {
        playChimeSound();
        showToast('Peaceful reflection chime playing...', '🔔');
      });
    }

    // Daily Edit Trigger
    const dailyEditBtn = document.getElementById('dailyEditTrigger');
    if (dailyEditBtn) {
      dailyEditBtn.addEventListener('click', () => {
        openEditModal(state.activeDay);
      });
    }

    // Daily Journal Input autosave
    const dailyJournalInput = document.getElementById('dailyJournalInput');
    if (dailyJournalInput) {
      dailyJournalInput.addEventListener('input', (e) => {
        const deed = state.deeds.find(d => d.day === state.activeDay);
        if (deed) {
          deed.userNotes = e.target.value;
          saveDeeds();
        }
      });
    }

    // Random Inspiration Button
    const randomBtn = document.getElementById('randomInspirationBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        const randDay = Math.floor(Math.random() * 30) + 1;
        playChimeSound();
        jumpToDailyFocus(randDay);
        showToast(`Inspiration: Opened Day ${randDay}!`, '🎲');
      });
    }

    // Reminders Modal Triggers & Sound Test
    const openRemindersBtn = document.getElementById('openRemindersBtn');
    const remindersModal = document.getElementById('remindersModal');
    const closeRemindersBtn = document.getElementById('closeRemindersModalBtn');

    if (openRemindersBtn && remindersModal) {
      openRemindersBtn.addEventListener('click', () => {
        renderRemindersList();
        remindersModal.showModal();
      });
    }

    if (closeRemindersBtn && remindersModal) {
      closeRemindersBtn.addEventListener('click', () => remindersModal.close());
    }

    const testReminderSoundBtn = document.getElementById('testReminderSoundBtn');
    if (testReminderSoundBtn) {
      testReminderSoundBtn.addEventListener('click', () => {
        playChimeSound();
        showToast('Playing alarm chime test...', '🎵');
      });
    }

    // Dismiss In-App Alarm Banner
    const dismissAlarmBtn = document.getElementById('dismissAlarmBannerBtn');
    if (dismissAlarmBtn) {
      dismissAlarmBtn.addEventListener('click', () => {
        document.getElementById('inAppAlarmBanner')?.classList.remove('active');
      });
    }

    // Request Notification Permission
    const reqPermBtn = document.getElementById('requestNotificationPermissionBtn');
    if (reqPermBtn) {
      reqPermBtn.addEventListener('click', async () => {
        if (!('Notification' in window)) {
          showToast('Browser does not support notifications.', '⚠️');
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          showToast('Push Notifications enabled successfully!', '🔔');
        } else {
          showToast('Notification permission was not granted.', '⚠️');
        }
      });
    }

    // Add Reminder Form
    const addReminderForm = document.getElementById('addReminderForm');
    if (addReminderForm) {
      addReminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('newReminderTitle').value.trim();
        const time = document.getElementById('newReminderTime').value;
        const frequency = document.getElementById('newReminderFrequency').value;

        if (!title || !time) return;

        const newRem = {
          id: 'rem-' + Date.now(),
          title,
          time,
          frequency,
          enabled: true
        };

        state.reminders.push(newRem);
        saveReminders();
        renderRemindersList();
        addReminderForm.reset();
        showToast('New daily reminder added!', '✅');
      });
    }

    // Edit Deed Form Submission & Add Steps
    const editForm = document.getElementById('editDeedForm');
    const editModal = document.getElementById('editDeedModal');
    const closeEditBtn = document.getElementById('closeEditModalBtn');
    const addStepBtn = document.getElementById('addEditActionItemBtn');

    if (closeEditBtn && editModal) {
      closeEditBtn.addEventListener('click', () => editModal.close());
    }

    if (addStepBtn) {
      addStepBtn.addEventListener('click', () => {
        const list = document.getElementById('editActionItemsList');
        if (!list) return;
        const currentCount = list.children.length;
        const row = document.createElement('div');
        row.className = 'action-item-edit-row';
        row.innerHTML = `
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; width: 16px;">${currentCount + 1}.</span>
          <input type="text" class="action-item-edit-input" placeholder="New action step..." required>
          <button type="button" class="btn-remove-action" title="Remove Step">✕</button>
        `;
        row.querySelector('.btn-remove-action')?.addEventListener('click', () => row.remove());
        list.appendChild(row);
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const deedIdVal = document.getElementById('editDeedId').value;
        const dayVal = parseInt(document.getElementById('editDay').value, 10);

        let deed = null;
        if (deedIdVal === 'new') {
          deed = {
            id: Date.now(),
            day: dayVal,
            completed: false,
            completedAt: null,
            userNotes: '',
            actionItems: []
          };
          state.deeds.push(deed);
        } else {
          deed = state.deeds.find(d => d.id === parseInt(deedIdVal, 10));
        }

        if (!deed) return;

        deed.day = dayVal;
        deed.title = document.getElementById('editTitle').value.trim();
        deed.category = document.getElementById('editCategory').value;
        deed.arabic = document.getElementById('editArabic').value.trim();
        deed.reference = document.getElementById('editRef').value.trim();
        deed.translation = document.getElementById('editTranslation').value.trim();
        deed.wisdom = document.getElementById('editWisdom').value.trim();

        // Collect edited action items
        const stepInputs = document.querySelectorAll('#editActionItemsList .action-item-edit-input');
        deed.actionItems = Array.from(stepInputs)
          .map((input, idx) => ({ id: `${deed.id}-${idx + 1}`, text: input.value.trim(), done: false }))
          .filter(item => item.text.length > 0);

        if (deed.actionItems.length === 0) {
          deed.actionItems = [{ id: `${deed.id}-1`, text: deed.title, done: false }];
        }

        saveDeeds();
        editModal.close();
        renderMonthlyGrid();
        renderWeeklyView();
        renderDailyFocus();
        showToast(`Day ${deed.day} saved successfully!`, '💾');
      });
    }

    // Reset Deed to Default
    const resetDeedDefaultBtn = document.getElementById('resetDeedDefaultBtn');
    if (resetDeedDefaultBtn) {
      resetDeedDefaultBtn.addEventListener('click', () => {
        const deedIdVal = document.getElementById('editDeedId').value;
        const deedId = parseInt(deedIdVal, 10);
        const defaultDeed = DEFAULT_DEEDS.find(d => d.id === deedId);
        if (!defaultDeed) return;

        document.getElementById('editDay').value = defaultDeed.day;
        document.getElementById('editTitle').value = defaultDeed.title;
        document.getElementById('editCategory').value = defaultDeed.category;
        document.getElementById('editArabic').value = defaultDeed.arabic;
        document.getElementById('editRef').value = defaultDeed.reference;
        document.getElementById('editTranslation').value = defaultDeed.translation;
        document.getElementById('editWisdom').value = defaultDeed.wisdom;
        renderEditActionItemsList(defaultDeed.actionItems || []);
        showToast('Form fields filled with default Quranic deed.', '🔄');
      });
    }

    // Add Custom Deed Button
    const openAddDeedBtn = document.getElementById('openAddDeedBtn');
    if (openAddDeedBtn) {
      openAddDeedBtn.addEventListener('click', () => {
        openEditModal(null, true);
      });
    }

    // Detail Modal Close Button
    const detailModal = document.getElementById('detailModal');
    const closeDetailBtn = document.getElementById('closeDetailModalBtn');
    if (closeDetailBtn && detailModal) {
      closeDetailBtn.addEventListener('click', () => detailModal.close());
    }

    // Export Data Button
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const exportData = {
          version: '1.0.1',
          exportedAt: new Date().toISOString(),
          deeds: state.deeds,
          reminders: state.reminders,
          weeklyNotes: state.weeklyNotes,
          tasbihCount: state.tasbihCount,
          tasbihRounds: state.tasbihRounds
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nuralamal_quranic_deeds_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported successfully!', '📤');
      });
    }

    // Import Data Button
    const importBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    if (importBtn && importFileInput) {
      importBtn.addEventListener('click', () => importFileInput.click());

      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (imported.deeds && Array.isArray(imported.deeds)) {
              state.deeds = imported.deeds;
              if (imported.reminders) state.reminders = imported.reminders;
              if (imported.weeklyNotes) state.weeklyNotes = imported.weeklyNotes;
              if (imported.tasbihCount !== undefined) state.tasbihCount = imported.tasbihCount;
              if (imported.tasbihRounds !== undefined) state.tasbihRounds = imported.tasbihRounds;

              saveDeeds();
              saveReminders();
              saveWeeklyNotes();
              localStorage.setItem(STORAGE_KEYS.TASBIH, state.tasbihCount);

              renderMonthlyGrid();
              renderWeeklyView();
              renderDailyFocus();
              renderYearlyHeatmap();
              setupTasbih();
              showToast('Backup restored successfully!', '📥');
            } else {
              showToast('Invalid backup file format.', '⚠️');
            }
          } catch (err) {
            showToast('Failed to read backup JSON file.', '⚠️');
          }
        };
        reader.readAsText(file);
      });
    }

    // Print Button
    const printBtn = document.getElementById('printPlanBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Reset All Data Button
    const resetAllBtn = document.getElementById('resetAllDataBtn');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all deeds, streaks, and personal notes back to default?')) {
          localStorage.clear();
          initData();
          renderMonthlyGrid();
          renderWeeklyView();
          renderDailyFocus();
          renderYearlyHeatmap();
          setupTasbih();
          showToast('All progress reset to defaults.', '🔄');
        }
      });
    }
  }

  // Helper escape function
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // Application Bootstrap
  // --------------------------------------------------------------------------
  function bootstrap() {
    initData();
    setupDialogFallbacks();
    setupTasbih();
    renderMonthlyGrid();
    renderWeeklyView();
    renderDailyFocus();
    renderYearlyHeatmap();
    renderTwelveMonthsThemes();
    setupEventListeners();
    startReminderChecker();
    updateHeroStats();
    updateCategoryCountBadges();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
