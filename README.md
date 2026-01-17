# Sowmya Invitation Website - Static Site

A beautiful, interactive digital invitation website for a New Clothes Ceremony (నూతన వస్త్ర బహుకరణ). This static website features an interactive hero image reveal with scroll animations, fully responsive design, and Telugu language support.

## 🌟 Features

- **Interactive Hero Image Reveal**: Touch/mouse-based image reveal with smooth liquid animations
- **Scroll Animations**: Signature overlay appears as you scroll
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Telugu Language Support**: Full support for Telugu text with Google Fonts
- **Static Hosting Ready**: No backend required - can be deployed anywhere

## 📁 File Structure

```
sowmya invitation website/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles
├── js/
│   ├── reveal.js          # Image reveal functionality
│   └── hero-scroll-animation.js   # Scroll animations
└── images/
    ├── cover-artistic.jpg
    ├── cover-artistic1.jpg
    ├── hero-photo.jpg
    └── hero-photo1.jpg
```

## 🚀 Deployment Options

### Option 1: GitHub Pages

1. **Create a new repository on GitHub**:
   - Go to github.com and create a new repository
   - Name it something like `sowmya-invitation`

2. **Initialize Git and push your code**:
   ```bash
   cd "sowmya invitation website"
   git init
   git add .
   git commit -m "Initial commit - Static invitation website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sowmya-invitation.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://YOUR_USERNAME.github.io/sowmya-invitation/`

### Option 2: Render Static Site

1. **Create a Render account**: Go to render.com and sign up

2. **Deploy your site**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository (or upload files)
   - Leave build command empty
   - Set publish directory to `.` (current directory)
   - Click "Create Static Site"

3. **Your site will be live** at the URL provided by Render (e.g., `https://your-site-name.onrender.com`)

### Option 3: Netlify

1. **Create a Netlify account**: Go to netlify.com and sign up

2. **Deploy via drag-and-drop**:
   - Go to Netlify dashboard
   - Drag and drop the entire `sowmya invitation website` folder
   - Your site will be live instantly!

3. **Or deploy via Git**:
   - Connect your GitHub repository
   - Leave build settings empty (it's already static)
   - Click "Deploy"

### Option 4: Vercel

1. **Create a Vercel account**: Go to vercel.com and sign up

2. **Deploy**:
   - Click "New Project"
   - Import your GitHub repository
   - Leave framework preset as "Other"
   - Click "Deploy"

## 💻 Local Testing

### Method 1: Direct File Open
Simply double-click `index.html` to open it in your browser.

### Method 2: Local HTTP Server (Recommended)

**Using Python:**
```bash
cd "sowmya invitation website"
python -m http.server 8000
```
Then open: http://localhost:8000

**Using Node.js (npx):**
```bash
cd "sowmya invitation website"
npx serve
```

**Using PHP:**
```bash
cd "sowmya invitation website"
php -S localhost:8000
```

## 🎨 Customization

### Changing Event Details
Edit `index.html` and update the following sections:
- **Date**: Line 89 - `ది 24-1-2026 ఆదివారం`
- **Time**: Line 103 - `ఉదయం 11 గంటలకు`
- **Location**: Line 117 - `పాలగూడెం గ్రామంలోని`
- **Children Names**: Lines 71-72

### Changing Images
Replace the images in the `images/` folder:
- `cover-artistic.jpg` - The cover image (shown before reveal)
- `hero-photo.jpg` - The actual photo (revealed on touch/hover)

### Changing Colors
Edit `css/styles.css`:
- Primary color: Search for `#C71585` (pink)
- Gold accent: Search for `#D4AF37`
- Background: Search for `#FFF5EC`

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features

- Touch-based image reveal
- Prevents pinch-to-zoom during interaction
- Optimized for portrait orientation
- Responsive text sizing

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or build tools required
- **No backend needed**: Fully client-side
- **Canvas-based animations**: Smooth 60fps interactions
- **Optimized images**: Uses CSS background-size: cover for proper scaling

## 📄 License

This is a personal invitation website. Feel free to use it as inspiration for your own projects!

## 🙏 Credits

Designed with love for a special occasion ✨

---

**Need help?** If you encounter any issues during deployment, check the console for errors or verify all file paths are correct.
