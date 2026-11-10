const fs = require('fs');
const path = require('path');
const https = require('https');

const PYODIDE_VERSION = 'v0.25.1';
const BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const TARGET_DIR = path.join(__dirname, '..', 'public', 'pyodide');

const FILES = [
  'pyodide.mjs',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'repodata.json',
  'pyodide-lock.json'
];

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function downloadFile(file) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(TARGET_DIR, file);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`[Pyodide Bundle] Already downloaded: ${file} (${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)`);
      return resolve();
    }

    console.log(`[Pyodide Bundle] Downloading ${file}...`);
    const fileStream = fs.createWriteStream(filePath);
    const url = BASE_URL + file;

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`[Pyodide Bundle] Saved ${file} (${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)`);
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[Pyodide Bundle] Saved ${file} (${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${file}: HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`Starting Pyodide offline assets download for standalone APK...`);
  for (const file of FILES) {
    try {
      await downloadFile(file);
    } catch (err) {
      console.error(`Error downloading ${file}:`, err.message);
    }
  }
  console.log(`Pyodide offline assets ready in ${TARGET_DIR}`);
}

main();
