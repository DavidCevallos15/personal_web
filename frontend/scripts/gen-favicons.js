/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @description Script determinista de generación de favicons
 */
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const SVG_PATH = resolve('../assets/brand/logo.svg')
const OUT_DIR = resolve('../../public')
const SIZES = [16, 32, 48, 180, 192, 512]

async function generateFavicons() {
  for (const size of SIZES) {
    await sharp(SVG_PATH)
      .resize(size, size)
      .png()
      .toFile(`${OUT_DIR}/favicon-${size}x${size}.png`)
    console.log(`✓ favicon-${size}x${size}.png generado`)
  }
  console.log('✓ Pipeline de favicons completado')
}

generateFavicons()
