// Colores y tipografías del diseño de referencia.

import { Platform } from 'react-native';

const light = {
  ink: '#1B1A17',
  paper: '#F4F1EA',
  surface: '#FFFDF8',
  surfacePressed: '#F7F3EA',
  tabBar: 'rgba(255,253,248,0.88)',
  muted: '#6E6A60',
  body: '#4A473F',
  track: '#E9E4D9',
  trackSoft: '#EFEBE2',
  tile: '#ECE7DC',
  switchOff: '#D6D0C3',
  white: '#FFFFFF',
  inkLabel: '#B9B3A5',
  inkBody: '#CFC9BB',
  green: '#22694C',
  greenSoft: '#DCEBDF',
  greenBar: '#7FBF9B',
  amber: '#8A5208',
  amberSoft: '#F6E5C4',
  amberBar: '#E7A93F',
  red: '#9A3523',
  redSoft: '#F2DAD3',
  redBar: '#D9735E',
  redBorder: '#B5432F',
  line06: 'rgba(27,26,23,0.06)',
  line08: 'rgba(27,26,23,0.08)',
  line10: 'rgba(27,26,23,0.1)',
  line12: 'rgba(27,26,23,0.12)',
  line15: 'rgba(27,26,23,0.15)',
  line20: 'rgba(27,26,23,0.2)',
  line30: 'rgba(27,26,23,0.3)',
  backdrop: 'rgba(27,26,23,0.4)',
  shadow12: 'rgba(27,26,23,0.12)',
  shadow15: 'rgba(27,26,23,0.15)',
  shadow25: 'rgba(27,26,23,0.25)',
  shadow30: 'rgba(27,26,23,0.3)',
  black12: 'rgba(0,0,0,0.12)',
  black25: 'rgba(0,0,0,0.25)',
  black50: 'rgba(0,0,0,0.5)',
  scanGlow: 'rgba(34,105,76,0.5)',
  receipt: '#F7F5EF',
  receiptText: '#333333',
  receiptMuted: '#777777',
  receiptDash: '#AAAAAA',
  receiptBar: '#E3E0D8',
  receiptBorder: '#E5E2DA',
  grayDark: '#BBBBBB',
  gray: '#DDDDDD',
  grayLight: '#EEEEEE',
  camera: '#111111',
  viewfinder: '#2A2824',
  white14: 'rgba(255,255,255,0.14)',
  white70: 'rgba(255,255,255,0.7)',
};

export type Palette = typeof light;
export type ColorScheme = 'light' | 'dark';

// El tema oscuro de la referencia es invert(.92) + hue-rotate(180deg) sobre el claro.
function toDark(color: string): string {
  const isHex = color.startsWith('#');
  const [r, g, b, alpha] = isHex
    ? [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16))
    : color.match(/[\d.]+/g)!.map(Number);
  const [x, y, z] = [r, g, b].map((channel) => 234.6 - 0.84 * channel);
  const channels = [
    -0.574 * x + 1.43 * y + 0.144 * z,
    0.426 * x + 0.43 * y + 0.144 * z,
    0.426 * x + 1.43 * y - 0.856 * z,
  ].map((channel) => Math.min(255, Math.max(0, Math.round(channel))));

  return isHex ? `rgb(${channels.join(',')})` : `rgba(${channels.join(',')},${alpha})`;
}

const dark = Object.fromEntries(
  Object.entries(light).map(([name, color]) => [name, toDark(color)]),
) as Palette;

export const palettes: Record<ColorScheme, Palette> = { light, dark };

// Fondos de la galería simulada.
const galleryLight = [
  '#6B6458', '#8A8172', '#4F4A42', '#A39886', '#5E584E', '#7A7265', '#94897A', '#565047', '#837A6C',
];
export const galleryColors: Record<ColorScheme, readonly string[]> = {
  light: galleryLight,
  dark: galleryLight.map(toDark),
};

export const fonts = {
  sans: 'Geist-Regular',
  sansMedium: 'Geist-Medium',
  mono: 'GeistMono-Regular',
  monoMedium: 'GeistMono-Medium',
  // Los símbolos (→ ●) usan la monoespaciada del sistema, como la referencia.
  symbol: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  display: 'BricolageGrotesque-Bold',
  displaySemi: 'BricolageGrotesque-SemiBold',
} as const;

export const maxContentWidth = 480;
