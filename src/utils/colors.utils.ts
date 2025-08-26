export function computeThemeColor(cssColorString: string) {
  const tempElement = document.createElement('div');
  tempElement.style.color = cssColorString;
  document.body.appendChild(tempElement);

  const computedColor = getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);

  return computedColor;
}

export function oklchToHex(l: string, c: string, h: string) {
  const tempElement = document.createElement('div');
  tempElement.style.color = `oklch(${l}% ${c} ${h})`;
  document.body.appendChild(tempElement);

  const computedColor = getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);

  if (computedColor.startsWith('rgb')) {
    return rgbToHex(computedColor);
  }

  return computedColor;
}

export function rgbToHex(rgb: string) {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;

  const [, r, g, b] = match;
  return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
}

export function updateThemeColorFromCSS(cssColorValue: string) {
  try {
    const computedColor = computeThemeColor(cssColorValue);
    const hexColor = computedColor.startsWith('rgb') ? rgbToHex(computedColor) : computedColor;

    let metaThemeColor: any = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = hexColor;
    return hexColor;
  } catch (error) {
    console.warn('Failed to compute theme color:', error);
    return '#ffffff';
  }
}