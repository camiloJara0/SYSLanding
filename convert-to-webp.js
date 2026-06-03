import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, 'public/images/rural');
const destDir = path.join(__dirname, 'public/images/animacion');

// Crear directorio destino si no existe
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Obtener todas las imágenes JPG
const files = fs.readdirSync(sourceDir).filter(file => 
    file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
);

let converted = 0;
let failed = 0;

console.log(`Iniciando conversión de ${files.length} imágenes...`);

// Convertir cada imagen a WebP
for (const file of files) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(destDir, file.replace(/\.[^.]+$/, '.webp'));
    
    try {
        await sharp(inputPath)
            .webp({ quality: 90 })
            .toFile(outputPath);
        converted++;
        console.log(`✓ Convertido: ${file}`);
    } catch (err) {
        failed++;
        console.error(`✗ Error en ${file}: ${err.message}`);
    }
}

console.log(`\n=== Conversión completada ===`);
console.log(`Total: ${files.length} imágenes`);
console.log(`Exitosas: ${converted}`);
console.log(`Fallidas: ${failed}`);
