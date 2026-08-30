// Scene Data Structure
const scenes = [
    {
        id: 1,
        start: 0.0,
        end: 4.2,
        title: "Overview / Home",
        render: renderOverview
    },
    {
        id: 2,
        start: 4.2,
        end: 6.4,
        title: "Make Payment",
        render: renderMakePayment
    },
    {
        id: 3,
        start: 6.4,
        end: 17.0,
        title: "Typing Account Name",
        render: renderTypingAccountName
    },
    {
        id: 4,
        start: 17.0,
        end: 21.3,
        title: "Typing Bank Name",
        render: renderTypingBankName
    },
    {
        id: 5,
        start: 21.3,
        end: 38.3,
        title: "Typing IBAN",
        render: renderTypingIBAN
    },
    {
        id: 6,
        start: 38.3,
        end: 40.5,
        title: "Typing BIC",
        render: renderTypingBIC
    },
    {
        id: 7,
        start: 40.5,
        end: 46.9,
        title: "Amount & Fee Estimate",
        render: renderAmountAndFees
    },
    {
        id: 8,
        start: 46.9,
        end: 51.1,
        title: "Payment Verification",
        render: renderVerification
    },
    {
        id: 9,
        start: 51.1,
        end: 53.3,
        title: "Biometric Verification",
        render: renderBiometric
    },
    {
        id: 10,
        start: 53.3,
        end: 55.4,
        title: "Processing Payment",
        render: renderProcessing
    },
    {
        id: 11,
        start: 55.4,
        end: 63.9,
        title: "Payment Sent - Success",
        render: renderSuccess
    },
    {
        id: 12,
        start: 63.9,
        end: 66.1,
        title: "Back to Overview",
        render: renderOverviewUpdated
    },
    {
        id: 13,
        start: 66.1,
        end: 68.2,
        title: "History / Transactions",
        render: renderHistory
    },
    {
        id: 14,
        start: 68.2,
        end: 76.7,
        title: "Transaction Receipt",
        render: renderReceipt
    }
];

// Application State
let currentTime = 0;
let isPlaying = false;
let animationFrameId = null;
let currentSceneIndex = 0;
let isRecording = false;
let mediaRecorder = null;
let recordedChunks = [];
let recordingStartTime = 0;
let recordingCanvas = null;
let recordingContext = null;

// DOM Elements
const screenElement = document.getElementById('screen');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const recordBtn = document.getElementById('recordBtn');
const downloadBtn = document.getElementById('downloadBtn');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const progressFill = document.getElementById('progressFill');
const sceneInfo = document.getElementById('sceneInfo');
const recordingStatus = document.getElementById('recordingStatus');
const recordingTime = document.getElementById('recordingTime');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalTimeDisplay.textContent = '76.7s';
    renderScene(0);
    setupEventListeners();
    setupVideoRecording();
});

function setupEventListeners() {
    playBtn.addEventListener('click', play);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);
    recordBtn.addEventListener('click', toggleRecording);
    downloadBtn.addEventListener('click', downloadVideo);
}

function setupVideoRecording() {
    // Create a canvas element for recording the phone screen
    recordingCanvas = document.createElement('canvas');
    recordingCanvas.width = 360;
    recordingCanvas.height = 720;
    recordingContext = recordingCanvas.getContext('2d');
}

function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    isRecording = true;
    recordedChunks = [];
    recordingStartTime = currentTime;
    
    recordBtn.classList.add('recording');
    recordBtn.disabled = true;
    playBtn.disabled = false;
    resetBtn.disabled = true;
    recordingStatus.style.display = 'flex';
    
    // Use canvas to record the screen
    const stream = recordingCanvas.captureStream(30); // 30 FPS
    
    try {
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 2500000
        });
    } catch (e) {
        // Fallback for browsers that don't support vp9
        try {
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8',
                videoBitsPerSecond: 2500000
            });
        } catch (e2) {
            mediaRecorder = new MediaRecorder(stream, {
                videoBitsPerSecond: 2500000
            });
        }
    }
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    mediaRecorder.start();
    
    // Start animation to capture frames
    recordingLoop();
    
    console.log('Recording started');
}

function recordingLoop() {
    if (!isRecording || currentTime >= 76.7) {
        if (isRecording) {
            stopRecording();
        }
        return;
    }
    
    // Draw current frame to canvas
    captureFrameToCanvas();
    
    // Update recording time display
    recordingTime.textContent = Math.floor(currentTime - recordingStartTime) + 's';
    
    // Continue animation
    animationFrameId = requestAnimationFrame(recordingLoop);
}

function captureFrameToCanvas() {
    // Draw white background
    recordingContext.fillStyle = '#f5f5f5';
    recordingContext.fillRect(0, 0, recordingCanvas.width, recordingCanvas.height);
    
    // Draw phone frame border
    recordingContext.fillStyle = '#000';
    recordingContext.fillRect(0, 0, recordingCanvas.width, 12);
    recordingContext.fillRect(0, recordingCanvas.height - 12, recordingCanvas.width, 12);
    
    // Draw notch
    recordingContext.fillRect(105, 0, 150, 28);
    
    // Draw screen content
    const phoneScreenRect = recordingCanvas.getBoundingClientRect();
    const screen = screenElement;
    
    // Create a temporary canvas to render the DOM
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 336;
    tempCanvas.height = 696;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill background
    tempCtx.fillStyle = '#f5f5f5';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw current scene content as SVG/HTML to canvas
    // For simplicity, we'll capture the actual screen element
    try {
        const html2canvas = window.html2canvas;
        if (html2canvas) {
            // Use html2canvas if available (would need to be included)
            html2canvas(screen).then(canvas => {
                recordingContext.drawImage(canvas, 12, 12, 336, 696);
            });
        } else {
            // Fallback: draw a placeholder
            recordingContext.fillStyle = '#fff';
            recordingContext.fillRect(12, 12, 336, 696);
            recordingContext.fillStyle = '#1a1a2e';
            recordingContext.font = '12px Arial';
            recordingContext.fillText(sceneInfo.textContent, 20, 30);
        }
    } catch (e) {
        // Silent fallback
        recordingContext.fillStyle = '#fff';
        recordingContext.fillRect(12, 12, 336, 696);
    }
    
    // Draw home indicator
    recordingContext.fillStyle = '#000';
    recordingContext.fillRect(165, 702, 30, 4);
}

function stopRecording() {
    if (!mediaRecorder || !isRecording) return;
    
    isRecording = false;
    mediaRecorder.stop();
    
    recordBtn.classList.remove('recording');
    recordBtn.disabled = false;
    recordingStatus.style.display = 'none';
    
    mediaRecorder.onstop = () => {
        // Convert WebM to MP4 or download as WebM
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        window.recordedVideoBlob = blob;
        downloadBtn.style.display = 'block';
        console.log('Recording stopped and saved');
    };
}

function downloadVideo() {
    if (!window.recordedVideoBlob) {
        alert('No recording available. Please record first.');
        return;
    }
    
    const url = URL.createObjectURL(window.recordedVideoBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `HSBC-Banking-Demo-${new Date().getTime()}.webm`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function play() {
    // If recording, continue recording with auto-play
    if (isRecording) {
        // Continue with current recording
    } else {
        isPlaying = true;
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    }
    animate();
}

function pause() {
    isPlaying = false;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

function reset() {
    currentTime = 0;
    isPlaying = false;
    if (isRecording) {
        stopRecording();
    }
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    currentSceneIndex = 0;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    updateDisplay();
    renderScene(0);
}

function animate() {
    const deltaTime = 1 / 60; // 60 FPS
    currentTime += deltaTime;

    if (currentTime >= 76.7) {
        currentTime = 76.7;
        isPlaying = false;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        if (isRecording) {
            stopRecording();
        }
    }

    updateDisplay();
    updateSceneIndex();

    if ((isPlaying || isRecording) && currentTime < 76.7) {
        animationFrameId = requestAnimationFrame(animate);
    }
}

function updateDisplay() {
    currentTimeDisplay.textContent = currentTime.toFixed(1) + 's';
    progressFill.style.width = (currentTime / 76.7) * 100 + '%';
}

function updateSceneIndex() {
    const newSceneIndex = scenes.findIndex(
        scene => currentTime >= scene.start && currentTime < scene.end
    );

    if (newSceneIndex !== currentSceneIndex) {
        currentSceneIndex = newSceneIndex >= 0 ? newSceneIndex : currentSceneIndex;
        renderScene(currentSceneIndex);
    }

    if (currentSceneIndex >= 0) {
        const scene = scenes[currentSceneIndex];
        sceneInfo.textContent = `Scene ${scene.id}: ${scene.title}`;
    }
}

function renderScene(sceneIndex) {
    if (sceneIndex >= 0 && sceneIndex < scenes.length) {
        const scene = scenes[sceneIndex];
        const timeInScene = currentTime - scene.start;
        scene.render(timeInScene, scene.end - scene.start);
    }
}

// Scene Renderers

function renderOverview(timeInScene, sceneDuration) {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div class="header-avatar">UA</div>
            </div>
            <div class="scene-content">
                <div class="account-card">
                    <div class="account-card-header">
                        <div>
                            <div class="account-name">Fnd German Re Gmbh</div>
                            <span class="badge">2FA Active</span>
                        </div>
                    </div>
                    <div class="balance">€ 98.487.652,23</div>
                    <div class="quick-actions">
                        <button class="action-btn">New Payment</button>
                        <button class="action-btn">Int. Transfer</button>
                        <button class="action-btn">Beneficiaries</button>
                        <button class="action-btn">Statements</button>
                    </div>
                    <div class="action-btn" style="text-align: center;">Estimate Transfer Fees - Get Quote</div>
                </div>
                <div style="font-size: 12px; color: #666; line-height: 1.6;">
                    <div><strong>Mon, 10 Aug 2026 10:23 CET</strong></div>
                    <div>EU Markets Open</div>
                    <div>0 Pending Approvals | 3 Scheduled Payments</div>
                    <div>1.0821 EUR/USD | €0 Pending Debits</div>
                </div>
            </div>
            <div class="scene-footer">
                <span style="color: #E31837; font-weight: 600;">Overview</span>
                <span>Accounts</span>
                <span>Payments</span>
                <span>History</span>
            </div>
        </div>
    `;
}

function renderMakePayment() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Make Payment</div>
                <div class="transfer-types">
                    <button class="transfer-type-btn active">IBAN TO IBAN</button>
                    <button class="transfer-type-btn">DIRECT WIRE</button>
                    <button class="transfer-type-btn">SEPA</button>
                    <button class="transfer-type-btn">TT</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Account Name</label>
                    <input type="text" class="form-input" placeholder="Full account title">
                </div>
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" placeholder="Beneficiary bank">
                </div>
                <div class="form-group">
                    <label class="form-label">IBAN</label>
                    <input type="text" class="form-input" value="DE83 3003 0880...">
                </div>
                <div class="form-group">
                    <label class="form-label">BIC / SWIFT</label>
                    <input type="text" class="form-input" value="TUBDDEDD">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-input" value="0.00 EUR">
                </div>
                <div class="form-group">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-input" value="HSBC899783627739">
                </div>
            </div>
        </div>
    `;
}

function renderTypingAccountName(timeInScene, sceneDuration) {
    const steps = ['E', 'EDIBU', 'EDIBURGH EU', 'EDIBURGH EURO', 'EDIBURGH EURO VENTURES LTD'];
    const stepDuration = sceneDuration / steps.length;
    const stepIndex = Math.floor(timeInScene / stepDuration);
    const displayText = steps[Math.min(stepIndex, steps.length - 1)];

    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Make Payment</div>
                <div class="transfer-types">
                    <button class="transfer-type-btn active">IBAN TO IBAN</button>
                    <button class="transfer-type-btn">DIRECT WIRE</button>
                    <button class="transfer-type-btn">SEPA</button>
                    <button class="transfer-type-btn">TT</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Account Name</label>
                    <input type="text" class="form-input active" value="${displayText}" style="border-color: #E31837;">
                </div>
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" placeholder="Beneficiary bank">
                </div>
                <div class="form-group">
                    <label class="form-label">IBAN</label>
                    <input type="text" class="form-input" value="DE83 3003 0880...">
                </div>
                <div class="form-group">
                    <label class="form-label">BIC / SWIFT</label>
                    <input type="text" class="form-input" value="TUBDDEDD">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-input" value="0.00 EUR">
                </div>
                <div class="form-group">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-input" value="HSBC899783627739">
                </div>
            </div>
        </div>
    `;
}

function renderTypingBankName(timeInScene, sceneDuration) {
    const steps = ['HSBC', 'HSBC CONTINENTAL EUROPE SA'];
    const stepDuration = sceneDuration / steps.length;
    const stepIndex = Math.floor(timeInScene / stepDuration);
    const displayText = steps[Math.min(stepIndex, steps.length - 1)];

    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Make Payment</div>
                <div class="transfer-types">
                    <button class="transfer-type-btn active">IBAN TO IBAN</button>
                    <button class="transfer-type-btn">DIRECT WIRE</button>
                    <button class="transfer-type-btn">SEPA</button>
                    <button class="transfer-type-btn">TT</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Account Name</label>
                    <input type="text" class="form-input" value="EDIBURGH EURO VENTURES LTD">
                </div>
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input active" value="${displayText}" style="border-color: #E31837;">
                </div>
                <div class="form-group">
                    <label class="form-label">IBAN</label>
                    <input type="text" class="form-input" value="DE83 3003 0880...">
                </div>
                <div class="form-group">
                    <label class="form-label">BIC / SWIFT</label>
                    <input type="text" class="form-input" value="TUBDDEDD">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-input" value="0.00 EUR">
                </div>
                <div class="form-group">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-input" value="HSBC899783627739">
                </div>
            </div>
        </div>
    `;
}

function renderTypingIBAN(timeInScene, sceneDuration) {
    const steps = ['D', 'DE83300', 'DE8330030', 'DE83300308800', 'DE833003088005501', 'DE8330030880055011201', 'DE83300308800550112019'];
    const stepDuration = sceneDuration / steps.length;
    const stepIndex = Math.floor(timeInScene / stepDuration);
    const displayText = steps[Math.min(stepIndex, steps.length - 1)];

    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Make Payment</div>
                <div class="transfer-types">
                    <button class="transfer-type-btn active">IBAN TO IBAN</button>
                    <button class="transfer-type-btn">DIRECT WIRE</button>
                    <button class="transfer-type-btn">SEPA</button>
                    <button class="transfer-type-btn">TT</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Account Name</label>
                    <input type="text" class="form-input" value="EDIBURGH EURO VENTURES LTD">
                </div>
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" value="HSBC CONTINENTAL EUROPE SA">
                </div>
                <div class="form-group">
                    <label class="form-label">IBAN</label>
                    <input type="text" class="form-input active" value="${displayText}" style="border-color: #E31837;">
                </div>
                <div class="form-group">
                    <label class="form-label">BIC / SWIFT</label>
                    <input type="text" class="form-input" value="TUBDDEDD">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-input" value="0.00 EUR">
                </div>
                <div class="form-group">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-input" value="HSBC899783627739">
                </div>
            </div>
        </div>
    `;
}

function renderTypingBIC(timeInScene, sceneDuration) {
    const steps = ['TU', 'TUBDDEDXXX'];
    const stepDuration = sceneDuration / steps.length;
    const stepIndex = Math.floor(timeInScene / stepDuration);
    const displayText = steps[Math.min(stepIndex, steps.length - 1)];

    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Make Payment</div>
                <div class="transfer-types">
                    <button class="transfer-type-btn active">IBAN TO IBAN</button>
                    <button class="transfer-type-btn">DIRECT WIRE</button>
                    <button class="transfer-type-btn">SEPA</button>
                    <button class="transfer-type-btn">TT</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Account Name</label>
                    <input type="text" class="form-input" value="EDIBURGH EURO VENTURES LTD">
                </div>
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" value="HSBC CONTINENTAL EUROPE SA">
                </div>
                <div class="form-group">
                    <label class="form-label">IBAN</label>
                    <input type="text" class="form-input" value="DE83300308800550112019">
                </div>
                <div class="form-group">
                    <label class="form-label">BIC / SWIFT</label>
                    <input type="text" class="form-input active" value="${displayText}" style="border-color: #E31837;">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-input" value="0.00 EUR">
                </div>
                <div class="form-group">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-input" value="HSBC899783627739">
                </div>
            </div>
        </div>
    `;
}

function renderAmountAndFees() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Make Payment</div>
                <div class="transfer-types">
                    <button class="transfer-type-btn active">IBAN TO IBAN</button>
                    <button class="transfer-type-btn">DIRECT WIRE</button>
                    <button class="transfer-type-btn">SEPA</button>
                    <button class="transfer-type-btn">TT</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Account Name</label>
                    <input type="text" class="form-input" value="EDIBURGH EURO VENTURES LTD">
                </div>
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" value="HSBC CONTINENTAL EUROPE SA">
                </div>
                <div class="form-group">
                    <label class="form-label">IBAN</label>
                    <input type="text" class="form-input" value="DE83300308800550112019">
                </div>
                <div class="form-group">
                    <label class="form-label">BIC / SWIFT</label>
                    <input type="text" class="form-input" value="TUBDDEDXXX">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-input" value="49,000,000.00 EUR">
                </div>
                <div class="form-group">
                    <label class="form-label">Reference</label>
                    <input type="text" class="form-input" value="HSBC899783627739">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-input" value="Investment">
                </div>
                <div class="fee-estimate">
                    <div class="fee-range">€500.00 – €309.00</div>
                    <div class="fee-note">Standard fee for transfers up to €6,000</div>
                </div>
                <div style="font-size: 13px; color: #666; margin-top: 16px;">
                    <strong>Available Balance:</strong> € 98.487.652,23
                </div>
            </div>
        </div>
    `;
}

function renderVerification() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Payment Verification</div>
                <div class="verification-section">
                    <div class="verification-item">
                        <div class="verification-label">Beneficiary</div>
                        <div class="verification-value">EDIBURGH EURO VENTURES LTD</div>
                    </div>
                    <div class="verification-item">
                        <div class="verification-label">IBAN</div>
                        <div class="verification-value">DE83300308800550112019</div>
                    </div>
                    <div class="verification-item">
                        <div class="verification-label">Amount</div>
                        <div class="verification-value">EUR 49,000,000.00</div>
                    </div>
                    <div class="verification-item">
                        <div class="verification-label">Type</div>
                        <div class="verification-value">IBAN TO IBAN</div>
                    </div>
                    <div class="verification-item">
                        <div class="verification-label">Reference</div>
                        <div class="verification-value">HSBC899783627739</div>
                    </div>
                </div>
                <div style="margin-top: 16px; margin-bottom: 16px;">
                    <div style="font-size: 12px; font-weight: 600; color: #666; margin-bottom: 8px; text-transform: uppercase;">Authentication</div>
                    <div class="auth-options">
                        <div class="auth-option">Enter Payment Sending Code</div>
                        <div class="auth-option selected">Use Biometric Instead</div>
                    </div>
                </div>
                <button class="btn-primary">Confirm Payment</button>
            </div>
        </div>
    `;
}

function renderBiometric() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div class="biometric-container">
                    <div class="fingerprint">👆</div>
                    <div class="biometric-status">Verifying biometric...</div>
                </div>
            </div>
        </div>
    `;
}

function renderProcessing() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div class="processing-container">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #1a1a2e;">Processing Payment</div>
                    <div class="status-list">
                        <div class="status-item">
                            <div class="status-indicator active">✓</div>
                            <div class="status-text">Verifying authorization</div>
                        </div>
                        <div class="status-item">
                            <div class="status-indicator active">✓</div>
                            <div class="status-text">Validating beneficiary details</div>
                        </div>
                        <div class="status-item">
                            <div class="status-indicator active">✓</div>
                            <div class="status-text">Processing transfer</div>
                        </div>
                        <div class="status-item">
                            <div class="status-indicator">✓</div>
                            <div class="status-text">Sending confirmation</div>
                        </div>
                    </div>
                    <div class="processing-message">
                        Securely transferring funds to EDIBURGH EURO VENTURES LTD. Please do not close this window.
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSuccess() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">✓</div>
            </div>
            <div class="scene-content">
                <div class="success-container">
                    <div class="success-icon">✓</div>
                    <div class="success-title">Payment Submitted</div>
                    <div class="success-details">
                        <div class="detail-row">
                            <span class="detail-label">Transaction ID</span>
                            <span class="detail-value">HSBC-DE-80YXRH6DXATC</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date & Time</span>
                            <span class="detail-value">2026-08-10 · 10:23:22 CET</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Beneficiary</span>
                            <span class="detail-value">EDIBURGH EURO VENTURES LTD</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">IBAN</span>
                            <span class="detail-value">DE83300308800550112019</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">BIC</span>
                            <span class="detail-value">TUBDDEDXXX</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Bank</span>
                            <span class="detail-value">HSBC CONTINENTAL EUROPE SA</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type</span>
                            <span class="detail-value">IBAN TO IBAN</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Reference</span>
                            <span class="detail-value">HSBC899783627739</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Amount</span>
                            <span class="detail-value">EUR 49,000,000.00</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Fee</span>
                            <span class="detail-value">€500 – €309</span>
                        </div>
                    </div>
                    <div class="receipt-sent">Receipt sent to: med*********@aol.com</div>
                </div>
            </div>
        </div>
    `;
}

function renderOverviewUpdated() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div class="header-avatar">UA</div>
            </div>
            <div class="scene-content">
                <div class="account-card">
                    <div class="account-card-header">
                        <div>
                            <div class="account-name">Fnd German Re Gmbh</div>
                            <span class="badge">2FA Active</span>
                        </div>
                    </div>
                    <div class="balance">€ 98.487.652,23</div>
                    <div class="quick-actions">
                        <button class="action-btn">New Payment</button>
                        <button class="action-btn">Int. Transfer</button>
                        <button class="action-btn">Beneficiaries</button>
                        <button class="action-btn">Statements</button>
                    </div>
                </div>
                <div style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
                    <div style="font-size: 14px; font-weight: 600; color: #1a1a2e;">14:47 CET</div>
                </div>
            </div>
            <div class="scene-footer">
                <span style="color: #E31837; font-weight: 600;">Overview</span>
                <span>Accounts</span>
                <span>Payments</span>
                <span>History</span>
            </div>
        </div>
    `;
}

function renderHistory() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div class="header-avatar">UA</div>
            </div>
            <div class="scene-content">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">History</div>
                <div class="verification-section">
                    <div class="verification-item">
                        <div class="verification-label">Total Transactions</div>
                        <div class="verification-value">118</div>
                    </div>
                    <div class="verification-item">
                        <div class="verification-label">Total Out</div>
                        <div class="verification-value" style="color: #c91230;">-€3.119.995.469</div>
                    </div>
                    <div class="verification-item">
                        <div class="verification-label">Total In</div>
                        <div class="verification-value" style="color: #2e7d32;">+€8.005.207.507</div>
                    </div>
                </div>
                <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 12px;">
                    <div style="font-size: 13px; font-weight: 600; color: #1a1a2e; margin-bottom: 8px;">Latest Transaction</div>
                    <div style="font-size: 12px; color: #666;">EDIBURGH EURO VENTURES LTD</div>
                    <div style="font-size: 12px; color: #666;">10 Aug 2026 · IBAN TO IBAN</div>
                    <div style="font-size: 14px; font-weight: 600; color: #c91230; margin-top: 8px;">-EUR 49,000,000.00</div>
                    <div style="font-size: 11px; color: #2e7d32; margin-top: 4px;">✓ Completed</div>
                </div>
            </div>
            <div class="scene-footer">
                <span>Overview</span>
                <span>Accounts</span>
                <span>Payments</span>
                <span style="color: #E31837; font-weight: 600;">History</span>
            </div>
        </div>
    `;
}

function renderReceipt() {
    screenElement.innerHTML = `
        <div class="scene active">
            <div class="scene-header">
                <div class="header-logo">HSBC</div>
                <div style="color: white;">←</div>
            </div>
            <div class="scene-content">
                <div class="receipt-container">
                    <div class="receipt-header">
                        <div class="receipt-title">Payment Receipt</div>
                        <div class="receipt-status">✓ PAYMENT SUCCESSFUL · 10 Aug 2026 at 10:23:22 CET</div>
                        <div style="font-size: 12px; color: #666; margin-top: 8px;">Reference: HSBC899783627739</div>
                    </div>
                    <div class="receipt-section">
                        <div class="receipt-section-title">Sender</div>
                        <div class="receipt-section-content">
                            <div><strong>FND GERMAN RE GMBH</strong></div>
                            <div>DE47 3003 0880 1234 5678 90</div>
                            <div>HSBC CONTINENTAL EUROPE S.A.</div>
                            <div>TUBDDEDXXX</div>
                        </div>
                    </div>
                    <div class="receipt-section">
                        <div class="receipt-section-title">Beneficiary</div>
                        <div class="receipt-section-content">
                            <div><strong>EDIBURGH EURO VENTURES LTD</strong></div>
                            <div>DE83300308800550112019</div>
                            <div>HSBC CONTINENTAL EUROPE SA</div>
                            <div>TUBDDEDXXX</div>
                        </div>
                    </div>
                    <div class="receipt-section">
                        <div class="receipt-section-title">Amount</div>
                        <div style="font-size: 20px; font-weight: 700; color: #E31837; padding: 12px; text-align: center;">EUR 49,000,000.00</div>
                    </div>
                    <div class="receipt-section">
                        <div class="receipt-section-title">Details</div>
                        <div class="receipt-section-content">
                            <div><strong>Method:</strong> IBAN TO IBAN</div>
                            <div><strong>Purpose:</strong> Investment</div>
                            <div><strong>Status:</strong> Completed</div>
                            <div><strong>Balance After:</strong> € 98.487.652,23</div>
                        </div>
                    </div>
                    <div style="text-align: center; font-size: 11px; color: #999; margin-top: 16px;">
                        HSBC Germany | Secure Banking
                    </div>
                </div>
            </div>
        </div>
    `;
}
