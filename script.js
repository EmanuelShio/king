/* ============================================
   KINGDOM ASSESSORIA - QUIZ FUNNEL
   JavaScript Engine
   ============================================ */

// ===== CONFIGURATION =====
const CONFIG = {
    // Replace with your actual n8n webhook URL
    webhookUrl: 'https://n8n.atenderzap.shop/webhook/kingdom-lead',
    // Replace with your WhatsApp number (with country code, no +)
    whatsappNumber: '5500000000000',
    // Analysis animation duration (ms)
    analysisDuration: 5000,
};

// ===== STATE =====
let currentStep = 1;
const totalSteps = 5;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initHeader();

    // Initialize Modals
    initModalSelect('marketing', 'marketingModal', 'marketingTrigger', 'marketingLabel');
    initModalSelect('interesse', 'interesseModal', 'interesseTrigger', 'interesseLabel');
    initModalSelect('servico', 'servicoModal', 'servicoTrigger', 'servicoLabel');

    initForm();
    initWhatsAppMask();
    updateProgress(1);
    initIntersectionObserver();
});

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        const colors = ['#0066FF', '#00D4FF', '#7C3AED', '#3AA0FF'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

// ===== HEADER SCROLL EFFECT =====
function initHeader() {
    const header = document.getElementById('header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== STEP NAVIGATION =====
function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    const currentEl = document.getElementById(`step${currentStep}`);
    const nextEl = document.getElementById(`step${step}`);

    if (!currentEl || !nextEl) return;

    // Fade out current
    currentEl.style.animation = 'none';
    currentEl.style.opacity = '1';
    currentEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    currentEl.style.opacity = '0';
    currentEl.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        currentEl.classList.remove('active');
        currentEl.style.cssText = '';

        nextEl.classList.add('active');
        currentStep = step;
        updateProgress(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger step-specific actions
        if (step === 3) startAnalysis();
        if (step === 4) animateCounters();
    }, 300);
}

// ===== PROGRESS BAR =====
function updateProgress(step) {
    const progressBar = document.getElementById('progressBar');
    const percentage = (step / totalSteps) * 100;
    progressBar.style.setProperty('--progress', percentage + '%');

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach(el => {
        const stepNum = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (stepNum === step) el.classList.add('active');
        if (stepNum < step) el.classList.add('completed');
    });
}

// ===== MODAL SELECT SYSTEM =====
/**
 * Initializes a selection field that opens in a modal popup
 * @param {string} fieldId - ID of the hidden input
 * @param {string} modalId - ID of the modal overlay
 * @param {string} triggerId - ID of the trigger div
 * @param {string} labelId - ID of the label inside the trigger
 */
function initModalSelect(fieldId, modalId, triggerId, labelId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(modalId + 'Close');
    const label = document.getElementById(labelId);
    const hiddenInput = document.getElementById(fieldId);
    const options = modal.querySelectorAll('.modal-option');

    if (!trigger || !modal || !hiddenInput) return;

    // Open Modal
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Select Option
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            label.textContent = value;
            hiddenInput.value = value;
            trigger.classList.add('selected');

            // Update UI selected state
            options.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            closeModal();
            clearFieldError(fieldId);
        });
    });
}

// ===== WHATSAPP MASK =====
function initWhatsAppMask() {
    const input = document.getElementById('whatsapp');
    if (!input) return;

    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }

        e.target.value = value;
    });
}

// ===== FORM HANDLING =====
function initForm() {
    const form = document.getElementById('quizForm');
    if (!form) return;

    // Real-time validation on blur
    ['nome', 'email', 'whatsapp', 'siteInstagram'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('blur', () => validateField(fieldId));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(fieldId);
                }
            });
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const btn = document.getElementById('btnSubmit');
        btn.disabled = true;
        btn.innerHTML = `
            <span class="btn-spinner"></span>
            <span>Enviando...</span>
        `;
        btn.style.opacity = '0.7';

        const formData = {
            nome: document.getElementById('nome').value.trim(),
            whatsapp: document.getElementById('whatsapp').value.trim(),
            marketing: document.getElementById('marketing').value,
            interesse: document.getElementById('interesse').value,
            siteInstagram: document.getElementById('siteInstagram').value.trim(),
            email: document.getElementById('email').value.trim(),
            servico: document.getElementById('servico').value,
            timestamp: new Date().toISOString(),
            source: 'quiz-funnel',
            page_url: window.location.href,
        };

        try {
            await sendToWebhook(formData);
        } catch (error) {
            console.warn('Webhook send failed, continuing flow:', error);
        }

        // Always proceed to next step
        setTimeout(() => {
            goToStep(3);
        }, 500);
    });
}

// ===== FIELD VALIDATION =====
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return true;

    const value = input.value.trim();
    let isValid = true;
    let errorMsg = '';

    switch (fieldId) {
        case 'nome':
            if (!value) {
                isValid = false;
                errorMsg = 'Por favor, insira seu nome';
            } else if (value.length < 2) {
                isValid = false;
                errorMsg = 'Nome muito curto';
            }
            break;

        case 'whatsapp':
            const cleanPhone = value.replace(/\D/g, '');
            if (!value) {
                isValid = false;
                errorMsg = 'Por favor, insira seu WhatsApp';
            } else if (cleanPhone.length < 10) {
                isValid = false;
                errorMsg = 'WhatsApp inválido';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMsg = 'Por favor, insira seu e-mail';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMsg = 'E-mail inválido. Exemplo: seunome@email.com';
            }
            break;

        case 'siteInstagram':
            if (!value) {
                isValid = false;
                errorMsg = 'Por favor, insira o site ou Instagram';
            }
            break;
    }

    if (!isValid) {
        showFieldError(fieldId, errorMsg);
    } else {
        clearFieldError(fieldId);
        input.classList.add('valid');
    }

    return isValid;
}

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (input) {
        input.classList.add('error');
        input.classList.remove('valid');
    }
    if (errorEl) errorEl.textContent = message;

    // Shake animation
    if (input) {
        input.style.animation = 'shake 0.4s ease';
        setTimeout(() => { input.style.animation = ''; }, 400);
    }
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (input) {
        input.classList.remove('error');
    }
    if (errorEl) errorEl.textContent = '';
}

function validateForm() {
    const fields = ['nome', 'whatsapp', 'email', 'siteInstagram'];
    let allValid = true;

    fields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            allValid = false;
        }
    });

    // Validate custom selects
    const customSelects = [
        { id: 'marketing', errorId: 'marketingError', msg: 'Por favor, selecione uma opção' },
        { id: 'interesse', errorId: 'interesseError', msg: 'Por favor, selecione uma opção' },
        { id: 'servico', errorId: 'servicoError', msg: 'Por favor, selecione um serviço' }
    ];

    customSelects.forEach(sel => {
        const val = document.getElementById(sel.id).value;
        if (!val) {
            const errorEl = document.getElementById(sel.errorId);
            if (errorEl) errorEl.textContent = sel.msg;
            allValid = false;
        }
    });

    return allValid;
}

// ===== WEBHOOK INTEGRATION =====
async function sendToWebhook(data) {
    try {
        const response = await fetch(CONFIG.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        console.log('✅ Lead enviado com sucesso para n8n');
        return true;
    } catch (error) {
        console.error('❌ Erro ao enviar lead:', error);
        // Store locally as fallback
        storeLeadLocally(data);
        throw error;
    }
}

function storeLeadLocally(data) {
    try {
        const leads = JSON.parse(localStorage.getItem('kingdom_leads') || '[]');
        leads.push(data);
        localStorage.setItem('kingdom_leads', JSON.stringify(leads));
        console.log('💾 Lead salvo localmente como backup');
    } catch (e) {
        console.error('Erro ao salvar localmente:', e);
    }
}

// ===== ANALYSIS ANIMATION (STEP 3) =====
function startAnalysis() {
    const progressFill = document.getElementById('analysisProgress');
    const percentText = document.getElementById('analysisPercent');
    const statusText = document.getElementById('analysisStatus');

    if (!progressFill || !percentText || !statusText) return;

    const steps = [
        { percent: 30, time: 1200, status: 'Verificando dados de contato...', stepId: 'analysisStep1' },
        { percent: 60, time: 2400, status: 'Analisando segmento de mercado...', stepId: 'analysisStep2' },
        { percent: 100, time: 4000, status: 'Direcionamento estratégico preparado!', stepId: 'analysisStep3' },
    ];

    // Reset
    progressFill.style.width = '0%';
    percentText.textContent = '0%';
    document.querySelectorAll('.analysis-step-item').forEach(el => {
        el.classList.remove('active', 'completed');
    });

    // Activate first step immediately
    setTimeout(() => {
        const step1 = document.getElementById('analysisStep1');
        if (step1) step1.classList.add('active');
    }, 200);

    steps.forEach((step, index) => {
        setTimeout(() => {
            // Animate progress
            progressFill.style.width = step.percent + '%';
            animateValue(percentText, parseInt(percentText.textContent), step.percent, 600);
            statusText.textContent = step.status;

            // Update step indicators
            const stepEl = document.getElementById(step.stepId);
            if (stepEl) {
                stepEl.classList.remove('active');
                stepEl.classList.add('completed');
            }

            // Activate next step
            if (index < steps.length - 1) {
                const nextStepEl = document.getElementById(steps[index + 1].stepId);
                if (nextStepEl) {
                    setTimeout(() => nextStepEl.classList.add('active'), 300);
                }
            }
        }, step.time);
    });

    // Auto-transition to Step 4
    setTimeout(() => {
        goToStep(4);
    }, CONFIG.analysisDuration);
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        const current = Math.floor(start + (end - start) * eased);
        element.textContent = current + '%';

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== COUNTER ANIMATION (STEP 4) =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        if (isNaN(target)) return;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out

            counter.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that need scroll-based animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== SHAKE ANIMATION (added via JS) =====
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}

.btn-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

