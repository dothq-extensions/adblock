import { rgb } from 'color-convert'
import { RGB } from 'color-convert/conversions'
import ContrastColor from 'contrast-color'

// =============================================================================
// Conversion stuff

export const rgbaToHex = (rgba: string): string => {
  if (rgba.includes('rgb')) {
    const clean = rgba.replace('rgba(', '').replace(')', '')
    const asArray = clean.split(',').map((x) => parseInt(x))
    if (asArray.length == 4) {
      asArray.pop()
    }
    return `#${rgb.hex(asArray as RGB)}`
  }

  return rgba
}

// =============================================================================
// Contrast logic

const contrastManager = new ContrastColor({
  bgColor: rgbaToHex('white'),
  fgDarkColor: 'black',
  fgLightColor: 'white',
  defaultColor: 'red',
  threshold: 130,
})

export const getContrast = (bg: string) =>
  contrastManager.contrastColor({ bgColor: rgbaToHex(bg) })
