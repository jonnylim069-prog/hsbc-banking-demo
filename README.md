# HSBC Mobile Banking - Interactive Demo

A fully interactive prototype of HSBC Corporate Banking's international payment flow. Watch the complete 76.7-second demonstration with smooth animations, realistic keyboard typing, biometric verification, and payment confirmation.

## 🎯 Features

✅ **14 Interactive Scenes** covering the complete IBAN-to-IBAN payment flow
✅ **Realistic Mobile UI** - Responsive phone frame with notch and home indicator
✅ **Animated Typing** - Watch as form fields populate character-by-character
✅ **Biometric Animation** - Pulsing fingerprint sensor during verification
✅ **Processing Status** - Real-time progress indicators during payment processing
✅ **Success Animation** - Scale-in checkmark and detailed receipt confirmation
✅ **Playback Controls** - Play, pause, and reset functionality with time tracking
✅ **Clean Fintech Design** - HSBC brand colors (red #E31837), modern UI patterns

## 📱 Scenes Included

1. **Overview / Home** (0.0s - 4.2s) - Dashboard with account balance and quick actions
2. **Make Payment Form** (4.2s - 6.4s) - Payment form initialization
3. **Typing Account Name** (6.4s - 17.0s) - "EDIBURGH EURO VENTURES LTD"
4. **Typing Bank Name** (17.0s - 21.3s) - "HSBC CONTINENTAL EUROPE SA"
5. **Typing IBAN** (21.3s - 38.3s) - Full IBAN entry with progression
6. **Typing BIC** (38.3s - 40.5s) - BIC/SWIFT code
7. **Amount & Fees** (40.5s - 46.9s) - €49M transfer with fee estimate
8. **Payment Verification** (46.9s - 51.1s) - Summary confirmation screen
9. **Biometric Verification** (51.1s - 53.3s) - Animated fingerprint sensor
10. **Processing** (53.3s - 55.4s) - Status indicators during transfer
11. **Success Screen** (55.4s - 63.9s) - Payment confirmation with transaction ID
12. **Updated Overview** (63.9s - 66.1s) - Return to dashboard
13. **Transaction History** (66.1s - 68.2s) - Latest transaction details
14. **Receipt** (68.2s - 76.7s) - Full payment receipt with sender/beneficiary info

## 🚀 Quick Start

### Option 1: View Online
Open `index.html` directly in your browser:
```bash
# Clone the repository
git clone https://github.com/jonnylim069-prog/hsbc-banking-demo.git
cd hsbc-banking-demo

# Open in browser
open index.html
# or
firefox index.html
# or drag index.html into your browser
```

### Option 2: Live Server
If you have Node.js installed:
```bash
npx http-server
# Navigate to http://localhost:8080
```

Or use Python:
```bash
python3 -m http.server 8000
# Navigate to http://localhost:8000
```

## 🎮 How to Use

1. **Play** - Click the ▶ Play button to start the 76.7-second demonstration
2. **Pause** - Click ⏸ Pause to freeze at any point
3. **Reset** - Click ↻ Reset to return to the beginning
4. **Progress Bar** - Visual indicator of current playback position
5. **Time Display** - Real-time counter showing current time / total duration
6. **Scene Info** - Text showing which scene is currently active

## 🎨 Design Details

### Color Scheme
- **Primary Red**: #E31837 (HSBC brand)
- **Text Dark**: #1a1a2e
- **Background Light**: #f5f5f5, #f9f9f9
- **Border Gray**: #ddd, #e0e0e0
- **Success Green**: #2e7d32
- **Warning Orange**: #f57c00

### Typography
- **Font Family**: System sans-serif (San Francisco, Segoe UI, etc.)
- **Balance Display**: 32px, bold, #E31837
- **Labels**: 12px, uppercase, letterspaced
- **Form Inputs**: 15px, readable contrast

### Animations
- **Keyboard Typing**: Progressive character reveal
- **Biometric Pulse**: Continuous 1.5s pulse animation
- **Status Indicators**: Active/completed state animations
- **Success Checkmark**: Scale-in animation (0.5s)
- **Button Hover**: Smooth background and scale transitions

## 📁 File Structure

```
hsbc-banking-demo/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling & animations
├── app.js              # Scene logic & playback engine
└── README.md           # This file
```

## 🔧 Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Flexbox layout, animations, gradients
- **Vanilla JavaScript** - No dependencies, pure ES6+
- **RequestAnimationFrame** - Smooth 60 FPS playback

## 🎬 Customization

### Change the HSBC Brand Color
In `styles.css`, search for `#E31837` and replace with your color:
```css
.header-logo { color: #YOUR_COLOR; }
.balance { color: #YOUR_COLOR; }
.success-icon { background: #YOUR_COLOR; }
/* ... etc */
```

### Adjust Animation Speed
In `app.js`, modify the `deltaTime` value:
```javascript
const deltaTime = 1 / 60; // Change 60 to speed up/slow down
```

### Add More Scenes
1. Create a new renderer function in `app.js`:
```javascript
function renderCustomScene(timeInScene, sceneDuration) {
    screenElement.innerHTML = `<!-- your HTML -->`;
}
```
2. Add to the `scenes` array with timing
3. Update `totalTime` display

## 📊 Demo Account Details

**Account**: Fnd German Re Gmbh (Corporate Banking - Tier 1)
**Balance**: € 98.487.652,23
**IBAN**: DE47 •••• •••• 567890
**BIC**: TUBDDEDXXX

**Transfer Details**:
- **Beneficiary**: EDIBURGH EURO VENTURES LTD
- **Amount**: EUR 49,000,000.00
- **Type**: IBAN TO IBAN
- **Reference**: HSBC899783627739
- **Status**: Completed

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The prototype is optimized for:
- Desktop (full-size phone frame)
- Tablet (scaled down)
- Mobile (stacked layout)

## 🚀 Performance

- No external dependencies
- Lightweight CSS animations
- Efficient DOM updates via innerHTML
- ~50KB total (unminified)

## 💡 Use Cases

- 📢 Product demos and pitch decks
- 📚 Training and onboarding materials
- 🎯 User testing & feedback gathering
- 🎨 Design portfolio showcase
- 💼 Investor presentations

## 📝 License

Public repository - feel free to fork, modify, and use for your projects.

## 🤝 Contributing

Have ideas to improve the demo? You can:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Questions?

For issues or suggestions, create a GitHub issue in this repository.

---

**Created**: August 30, 2026
**Duration**: 76.7 seconds of interactive storytelling
**Scenes**: 14 fully animated screens
**Technologies**: HTML5 + CSS3 + Vanilla JavaScript
