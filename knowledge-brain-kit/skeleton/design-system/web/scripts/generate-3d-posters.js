const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const MODELS_DIR = path.join(__dirname, '../components/foundations/model-viewer');
const OUT_DIR = path.join(__dirname, '../public/assets/3d-posters');
const PORT = 3456;

// Create output directory if it doesn't exist
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Set up a simple Express server to host the local model files
const app = express();
app.use('/models', express.static(MODELS_DIR));

// Simple HTML template using Google's model-viewer to quickly render the GLB
// for the screenshot. We use this instead of React just for the sheer simplicity
// and speed of generating a high-quality screenshot.
app.get('/preview', (req, res) => {
    const modelUrl = req.query.model;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D Preview</title>
      <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #ffffff; overflow: hidden; }
        model-viewer { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <model-viewer 
         src="/models/${modelUrl}" 
         environment-image="neutral" 
         exposure="1.2"
         shadow-intensity="1" 
         camera-controls 
         auto-rotate
      ></model-viewer>
      
      <script>
        const viewer = document.querySelector('model-viewer');
        // Let puppeteer know when the model is visually ready
        viewer.addEventListener('poster-dismissed', () => {
           // We add a tiny delay to ensure the scene is 100% rendered and no loading artifacts remain
           setTimeout(() => {
              window.modelReady = true;
           }, 500);
        });
      </script>
    </body>
    </html>
  `;
    res.send(html);
});

async function run() {
    const server = app.listen(PORT, async () => {
        console.log(`Server running at http://localhost:${PORT}`);

        // Find all glb and gltf files
        const files = fs.readdirSync(MODELS_DIR).filter(file => file.endsWith('.glb') || file.endsWith('.gltf'));

        if (files.length === 0) {
            console.log('No 3D models found in components/foundations/model-viewer');
            server.close();
            return;
        }

        console.log(`Found ${files.length} models to process...`);

        const browser = await puppeteer.launch({
            headless: 'new',
            // Make the viewport size typical for a poster (e.g., 800x600 or 16:9)
            defaultViewport: { width: 1200, height: 800, deviceScaleFactor: 2 } // 2x DPI for high-res
        });

        for (const file of files) {
            const page = await browser.newPage();
            console.log(`Processing ${file}...`);

            try {
                await page.goto(`http://localhost:${PORT}/preview?model=${file}`, { waitUntil: 'networkidle0' });

                // Wait for the model-viewer implementation to flag `window.modelReady = true`
                await page.waitForFunction('window.modelReady === true', { timeout: 30000 });

                const outName = file.replace(/\.(glb|gltf)$/, '.webp');
                const outPath = path.join(OUT_DIR, outName);

                // Take a screenshot as webp
                await page.screenshot({ path: outPath, type: 'webp', quality: 90 });
                console.log(`  -> Saved poster to public/assets/3d-posters/${outName}`);
            } catch (err) {
                console.error(`  -> Failed to generate poster for ${file}:`, err.message);
            } finally {
                await page.close();
            }
        }

        await browser.close();
        server.close();
        console.log('Done! All posters generated.');
    });
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
