import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function main() {
  try {
    const cwd = process.cwd();
    const svgPath = path.join(cwd, 'public/og-image.svg');
    const fontPath = path.join(cwd, 'public/fonts/Parkinsans-Bold.ttf');
    const outputPath = path.join(cwd, 'public/og-image.png');

    console.log(`Reading SVG from ${svgPath}...`);
    const svg = await readFile(svgPath);

    console.log(`Loading font from ${fontPath}...`);
    // Verify font file exists
    try {
      await readFile(fontPath);
    } catch (e) {
      console.error(`Font file not found at ${fontPath}`);
      process.exit(1);
    }

    const opts = {
      font: {
        fontFiles: [fontPath],
        loadSystemFonts: false, // Ensure consistent rendering
        defaultFontFamily: 'Parkinsans',
      },
      // Ensure the output size matches the SVG viewBox/width/height
      fitTo: {
        mode: 'width',
        value: 1200, // Standard OG image width
      },
    };

    console.log('Rendering SVG to PNG...');
    const resvg = new Resvg(svg, opts);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    console.log(`Writing PNG to ${outputPath}...`);
    await writeFile(outputPath, pngBuffer);

    console.log('Done!');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

main();
