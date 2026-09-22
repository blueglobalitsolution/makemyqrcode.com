const state = {
  dataType: 'url',
  url: '',
  text: '',
  email: { address: '', subject: '', body: '' },
  phone: '',
  sms: { phone: '', message: '' },
  vcard: { firstName: '', lastName: '', organization: '', position: '', phoneWork: '', phonePrivate: '', email: '', street: '', city: '', state: '', country: '' },
  location: { latitude: '', longitude: '', address: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA' },
  event: { title: '', location: '', startTime: '', endTime: '' },
  crypto: { asset: 'bitcoin', address: '', amount: '' },
  fgColor: '#000000',
  bgColor: '#ffffff',
  includeMargin: true,
  level: 'H',
  logo: undefined,
  logoPresetId: null,
  dotType: 'square',
  cornerSquareType: 'square',
  cornerDotType: 'square',
  activeTab: 'logo',
};

const DEFAULT_URL = 'https://example.com';

let qrCodeInstance = null;
let mapInstance = null;
let mapMarker = null;

const LOGO_PRESETS = [
  {
    id: 'globe', name: 'Website',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  },
  { id: 'facebook', name: 'Facebook', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { id: 'instagram', name: 'Instagram', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1"/></svg>' },
  { id: 'twitter', name: 'X / Twitter', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
  { id: 'linkedin', name: 'LinkedIn', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  { id: 'whatsapp', name: 'WhatsApp', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
  { id: 'youtube', name: 'YouTube', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
  { id: 'tiktok', name: 'TikTok', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
];

const PRESETS = [
  { id: 'black-white', name: 'Black & White', fgColor: '#000000', bgColor: '#FFFFFF', style: 'squares' },
  { id: 'grey-green', name: 'Grey & Vibrant Green', fgColor: '#4B5563', bgColor: '#bef264', style: 'dots' },
  { id: 'black-orange', name: 'Black & Orange', fgColor: '#000000', bgColor: '#f59e0b', style: 'squares' },
  { id: 'blue-orange', name: 'Blue & Orange', fgColor: '#3b82f6', bgColor: '#f97316', style: 'dots' },
  { id: 'coral-teal', name: 'Coral & Teal', fgColor: '#fb7185', bgColor: '#2dd4bf', style: 'squares' },
  { id: 'blue-red', name: 'Blue & Red', fgColor: '#2563eb', bgColor: '#ef4444', style: 'dots' },
  { id: 'black-yellow', name: 'Black & Yellow', fgColor: '#1f2937', bgColor: '#facc15', style: 'squares' },
  { id: 'violet-dahlia', name: 'Ultra Violet & Blooming Dahlia', fgColor: '#7c3aed', bgColor: '#fda4af', style: 'dots' },
];

const DOT_TYPE_OPTIONS = [
  { id: 'square', name: 'Square', type: 'square', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="4" y="4" width="16" height="16"/></svg>' },
  { id: 'rounded', name: 'Rounded', type: 'rounded', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>' },
  { id: 'dots', name: 'Dots', type: 'dots', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="8"/></svg>' },
  { id: 'classy', name: 'Classy', type: 'classy', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M12 4L20 12L12 20L4 12Z"/></svg>' },
  { id: 'classy-rounded', name: 'Classy Rounded', type: 'classy-rounded', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M12 4C16 4 20 8 20 12C20 16 16 20 12 20C8 20 4 16 4 12C4 8 8 4 12 4Z"/></svg>' },
  { id: 'extra-rounded', name: 'Extra Rounded', type: 'extra-rounded', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" rx="6"/></svg>' },
];

const CORNER_SQUARE_OPTIONS = [
  { id: 'square', name: 'Square', type: 'square', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" stroke="{fgColor}" stroke-width="2" fill="none"/><rect x="7" y="7" width="10" height="10" fill="{fgColor}"/></svg>' },
  { id: 'dot', name: 'Dot', type: 'dot', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="9" stroke="{fgColor}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="5" fill="{fgColor}"/></svg>' },
  { id: 'extra-rounded', name: 'Extra Rounded', type: 'extra-rounded', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" rx="6" stroke="{fgColor}" stroke-width="2" fill="none"/><rect x="7" y="7" width="10" height="10" rx="3" fill="{fgColor}"/></svg>' },
  { id: 'none', name: 'None', type: null, svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' },
];

const CORNER_DOT_OPTIONS = [
  { id: 'square', name: 'Square', type: 'square', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="6" y="6" width="12" height="12"/></svg>' },
  { id: 'dot', name: 'Dot', type: 'dot', svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="6"/></svg>' },
  { id: 'none', name: 'None', type: null, svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/></svg>' },
];

const DATA_TYPES = [
  { id: 'url', label: 'URL', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
  { id: 'text', label: 'Text', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>' },
  { id: 'email', label: 'Email', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' },
  { id: 'phone', label: 'Phone', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
  { id: 'sms', label: 'SMS', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { id: 'vcard', label: 'vCard', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id: 'location', label: 'Location', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { id: 'wifi', label: 'WiFi', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>' },
  { id: 'event', label: 'Event', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { id: 'crypto', label: 'Bitcoin', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>' },
];

function svgIcon(path, size = 16) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

const ICONS = {
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  palette: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  qrcode: '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/>',
  refresh: '<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  shapes: '<path d="M8.3 10a.7.7 0 0 1-.6-.3L4.3 5.7a.7.7 0 0 1 0-.9L7.7 1.3a.7.7 0 0 1 .6-.3h5.4a.7.7 0 0 1 .6.3l3.4 3.5a.7.7 0 0 1 0 .9L14.3 9.7a.7.7 0 0 1-.6.3H8.3Z"/><circle cx="12" cy="17" r="5"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  contact: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  bitcoin: '<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  infinity: '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};

let downloading = null;
let copying = false;
let leadCaptured = false;
const LEAD_API_URL = 'https://app.makemyqrcode.com/api/leads/capture/';

function generateLogoDataUrl(svgTemplate, fgColor) {
  return 'data:image/svg+xml,' + encodeURIComponent(svgTemplate.replace(/{fgColor}/g, fgColor));
}

function getLogoDataUrl() {
  if (state.logoPresetId) {
    const preset = LOGO_PRESETS.find(p => p.id === state.logoPresetId);
    if (preset) return generateLogoDataUrl(preset.svgTemplate, state.fgColor);
  }
  return state.logo;
}

function getQRData() {
  const c = state;
  if (c.dataType === 'url') return c.url || DEFAULT_URL;
  if (c.dataType === 'text') return c.text || 'Enter text to generate QR code';
  if (c.dataType === 'email') return c.email.address ? `mailto:${c.email.address}?subject=${encodeURIComponent(c.email.subject)}&body=${encodeURIComponent(c.email.body)}` : 'mailto:';
  if (c.dataType === 'phone') return c.phone ? `tel:${c.phone}` : 'tel:';
  if (c.dataType === 'sms') return c.sms.phone ? `smsto:${c.sms.phone}:${c.sms.message}` : 'smsto:';
  if (c.dataType === 'location') return (c.location.latitude && c.location.longitude) ? `geo:${c.location.latitude},${c.location.longitude}` : 'geo:';
  if (c.dataType === 'vcard') {
    const v = c.vcard;
    const parts = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `N:${v.lastName};${v.firstName}`,
      `FN:${v.firstName} ${v.lastName}`,
      `ORG:${v.organization}`,
      `TITLE:${v.position}`,
      `TEL;TYPE=work,voice:${v.phoneWork}`,
      `TEL;TYPE=home,voice:${v.phonePrivate}`,
      `EMAIL:${v.email}`,
      `ADR;TYPE=intl,postal,parcel,work:;;${v.street};${v.city};${v.state};;${v.country}`,
      'END:VCARD'
    ].filter(p => !p.endsWith(':') && !p.endsWith('; '));
    return v.firstName || v.lastName || v.organization ? parts.join('\n') : 'BEGIN:VCARD\nVERSION:3.0\nEND:VCARD';
  }
  if (c.dataType === 'wifi') return c.wifi.ssid ? `WIFI:S:${c.wifi.ssid};T:${c.wifi.encryption};P:${c.wifi.password};;` : 'WIFI:';
  if (c.dataType === 'event') {
    const fmt = t => t ? t.replace(/[-:]/g, '') + '00' : '';
    return c.event.title ? `BEGIN:VEVENT\nSUMMARY:${c.event.title}\nLOCATION:${c.event.location}\nDTSTART:${fmt(c.event.startTime)}\nDTEND:${fmt(c.event.endTime)}\nEND:VEVENT` : 'BEGIN:VEVENT\nEND:VEVENT';
  }
  if (c.dataType === 'crypto') return c.crypto.address ? `${c.crypto.asset}:${c.crypto.address}${c.crypto.amount ? `?amount=${c.crypto.amount}` : ''}` : `${c.crypto.asset}:`;
  return DEFAULT_URL;
}

function needsInput() {
  const c = state;
  return (c.dataType === 'url' && !c.url) || (c.dataType === 'text' && !c.text) ||
    (c.dataType === 'email' && !c.email.address) || (c.dataType === 'phone' && !c.phone) ||
    (c.dataType === 'sms' && !c.sms.phone) || (c.dataType === 'vcard' && !c.vcard.firstName) ||
    (c.dataType === 'location' && !c.location.latitude) || (c.dataType === 'wifi' && !c.wifi.ssid) ||
    (c.dataType === 'event' && !c.event.title) || (c.dataType === 'crypto' && !c.crypto.address);
}

function updateQR() {
  const logoDataUrl = getLogoDataUrl();
  const qrData = getQRData();

  const options = {
    width: 1024, height: 1024, type: 'svg', data: qrData,
    dotsOptions: { color: state.fgColor, type: state.dotType },
    backgroundOptions: { color: state.bgColor },
    qrOptions: { errorCorrectionLevel: state.level },
    margin: state.includeMargin ? 40 : 10,
    image: logoDataUrl,
    imageOptions: { hideBackgroundDots: true, imageSize: 0.28, margin: 10 },
    cornersSquareOptions: state.cornerSquareType ? { color: state.fgColor, type: state.cornerSquareType } : undefined,
    cornersDotOptions: state.cornerDotType ? { color: state.fgColor, type: state.cornerDotType } : undefined,
  };

  if (!qrCodeInstance) {
    qrCodeInstance = new QRCodeStyling(options);
  } else {
    qrCodeInstance.update(options);
  }

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const mobileContainer = document.getElementById('qr-mobile');
  const desktopContainer = document.getElementById('qr-desktop');

  if (isDesktop && desktopContainer) {
    if (mobileContainer) mobileContainer.innerHTML = '';
    desktopContainer.innerHTML = '';
    qrCodeInstance.append(desktopContainer);
    styleSvg(desktopContainer);
  } else if (mobileContainer) {
    if (desktopContainer) desktopContainer.innerHTML = '';
    mobileContainer.innerHTML = '';
    qrCodeInstance.append(mobileContainer);
    styleSvg(mobileContainer);
  }

  updatePreviewOverlay();
}

function styleSvg(container) {
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.borderRadius = '2px';
    svg.setAttribute('viewBox', '0 0 1024 1024');
    if (!state.bgColor || state.bgColor === 'transparent') {
      svg.style.backgroundColor = '#ffffff';
    }
  }
}

function updatePreviewOverlay() {
  const overlays = document.querySelectorAll('.preview-overlay');
  const needInput = needsInput();
  overlays.forEach(el => {
    el.style.display = needInput ? 'flex' : 'none';
  });
  document.querySelectorAll('.qr-container').forEach(el => {
    el.style.filter = needInput ? 'blur(4px)' : 'blur(0)';
    el.style.opacity = needInput ? '0.2' : '1';
  });
  document.querySelectorAll('.logo-badge').forEach(el => {
    el.style.display = (needInput && (state.logo || state.logoPresetId)) ? 'block' : 'none';
  });
}

function updateDataTypeTabs() {
  document.querySelectorAll('.data-type-btn').forEach(btn => {
    const type = btn.dataset.type;
    btn.className = `data-type-btn w-full flex justify-center items-center gap-1 md:gap-2 px-1 md:px-2 py-2.5 rounded-[2px] font-medium text-sm transition-all whitespace-nowrap ${type === state.dataType ? 'bg-[#bd1819] text-white' : 'bg-white text-[#666666] hover:bg-[#f3f3f3] hover:text-[#000000] border border-[#f3f3f3]'}`;
  });
}

function renderDataTypeInput() {
  const container = document.getElementById('data-type-input');
  if (!container) return;
  const c = state;
  let html = '';

  if (c.dataType === 'url') {
    html = `
      <div>
        <div class="flex items-center gap-2 mb-4">
          ${svgIcon(ICONS.link, 20)}
          <h2 class="text-lg font-semibold text-[#000000]">Destination URL</h2>
        </div>
        <div class="relative group">
          <input type="url" id="input-url" placeholder="https://yourlink.com" value="${c.url}"
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-4 px-5 text-lg transition-all text-[#000000] placeholder:text-[#666666]"/>
          <button id="btn-clear-url" class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#f3f3f3] rounded-[2px] text-[#666666] transition-colors">
            ${svgIcon(ICONS.refresh, 20)}
          </button>
        </div>
      </div>`;
  } else if (c.dataType === 'text') {
    html = `
      <div>
        <div class="flex items-center gap-2 mb-4">
          ${svgIcon(ICONS.type, 20)}
          <h2 class="text-lg font-semibold text-[#000000]">Text Content</h2>
        </div>
        <textarea id="input-text" placeholder="Enter your text here..."
          class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-4 px-5 text-lg transition-all text-[#000000] placeholder:text-[#666666] min-h-[120px] resize-y">${c.text}</textarea>
      </div>`;
  } else if (c.dataType === 'email') {
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.mail, 20)}<h2 class="text-lg font-semibold text-[#000000]">Email Details</h2></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-1">Your Email</label>
          <input type="email" id="input-email-address" placeholder="name@mail.com" value="${c.email.address}"
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-1">Subject</label>
          <input type="text" id="input-email-subject" placeholder="Email Subject" value="${c.email.subject}"
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-1">Message</label>
          <textarea id="input-email-body" placeholder="Write your message here..."
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666] min-h-[100px] resize-y">${c.email.body}</textarea></div>
      </div>`;
  } else if (c.dataType === 'phone') {
    html = `
      <div>
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.phone, 20)}<h2 class="text-lg font-semibold text-[#000000]">Phone Number</h2></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-1">Your Phone Number</label>
          <input type="tel" id="input-phone" placeholder="+49 172 45921..." value="${c.phone}"
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
      </div>`;
  } else if (c.dataType === 'sms') {
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.message, 20)}<h2 class="text-lg font-semibold text-[#000000]">SMS Details</h2></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-1">Your Phone Number</label>
          <input type="tel" id="input-sms-phone" placeholder="+49 172 45921..." value="${c.sms.phone}"
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-1">Your Message</label>
          <textarea id="input-sms-message" placeholder="Enter SMS message..."
            class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666] min-h-[100px] resize-y">${c.sms.message}</textarea></div>
      </div>`;
  } else if (c.dataType === 'vcard') {
    const fields = [
      ['firstName', 'First Name'], ['lastName', 'Last Name'], ['organization', 'Organization'],
      ['position', 'Position'], ['phoneWork', 'Phone Work'], ['phonePrivate', 'Phone Private'],
      ['email', 'Email'], ['street', 'Street'], ['city', 'City'], ['state', 'State'], ['country', 'Country']
    ];
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.contact, 20)}<h2 class="text-lg font-semibold text-[#000000]">vCard Contact Details</h2></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${fields.map(([key, label]) => `
            <div><label class="block text-sm font-medium text-[#000000] mb-1 capitalize">${label}</label>
              <input type="${key === 'email' ? 'email' : 'text'}" id="input-vcard-${key}" value="${(c.vcard[key] || '')}"
                class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          `).join('')}
        </div>
      </div>`;
  } else if (c.dataType === 'location') {
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.mapPin, 20)}<h2 class="text-lg font-semibold text-[#000000]">Location Coordinates</h2></div>
        <div class="mb-4 relative">
            <label class="block text-sm font-medium text-[#000000] mb-1">Search Address</label>
            <input type="text" id="input-loc-search" placeholder="Type an address to point automatically..." value="${c.location.address || ''}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/>
            <div id="loc-search-status" class="text-xs text-green-600 mt-1 hidden">Location found!</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Latitude</label>
            <input type="text" id="input-loc-lat" placeholder="51.049259" value="${c.location.latitude}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Longitude</label>
            <input type="text" id="input-loc-lng" placeholder="13.73836" value="${c.location.longitude}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
        </div>
        <div class="mt-4 rounded-[2px] overflow-hidden border border-[#f3f3f3] h-[300px] w-full bg-[#f3f3f3] relative z-0">
          <div id="map-container" style="height:100%;width:100%;"></div>
        </div>
      </div>`;
  } else if (c.dataType === 'wifi') {
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.wifi, 20)}<h2 class="text-lg font-semibold text-[#000000]">WiFi Network Details</h2></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Wireless SSID</label>
            <input type="text" id="input-wifi-ssid" placeholder="Network name" value="${c.wifi.ssid}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Password</label>
            <input type="text" id="input-wifi-password" placeholder="Password" value="${c.wifi.password}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Encryption</label>
            <select id="input-wifi-encryption"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]">
              <option value="WPA" ${c.wifi.encryption === 'WPA' ? 'selected' : ''}>WPA/WPA2</option>
              <option value="WEP" ${c.wifi.encryption === 'WEP' ? 'selected' : ''}>WEP</option>
              <option value="nopass" ${c.wifi.encryption === 'nopass' ? 'selected' : ''}>No Encryption</option>
            </select></div>
        </div>
      </div>`;
  } else if (c.dataType === 'event') {
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.calendar, 20)}<h2 class="text-lg font-semibold text-[#000000]">Event Details</h2></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2"><label class="block text-sm font-medium text-[#000000] mb-1">Event Title</label>
            <input type="text" id="input-event-title" placeholder="Event Title" value="${c.event.title}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div class="md:col-span-2"><label class="block text-sm font-medium text-[#000000] mb-1">Event Location</label>
            <input type="text" id="input-event-location" placeholder="Location" value="${c.event.location}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Start Time</label>
            <input type="datetime-local" id="input-event-start" value="${c.event.startTime}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div><label class="block text-sm font-medium text-[#000000] mb-1">End Time</label>
            <input type="datetime-local" id="input-event-end" value="${c.event.endTime}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
        </div>
      </div>`;
  } else if (c.dataType === 'crypto') {
    const assets = ['bitcoin', 'bitcoincash', 'ethereum', 'litecoin', 'dash'];
    html = `
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">${svgIcon(ICONS.bitcoin, 20)}<h2 class="text-lg font-semibold text-[#000000]">Cryptocurrency Address</h2></div>
        <div><label class="block text-sm font-medium text-[#000000] mb-3">Select Cryptocurrency</label>
          <div class="flex flex-wrap gap-4">
            ${assets.map(a => `
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="crypto-asset" value="${a}" ${c.crypto.asset === a ? 'checked' : ''} class="w-4 h-4 text-[#bd1819]"/>
                <span class="text-sm text-[#000000] capitalize">${a === 'bitcoincash' ? 'Bitcoin Cash' : a}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="md:col-span-2"><label class="block text-sm font-medium text-[#000000] mb-1">Address</label>
            <input type="text" id="input-crypto-address" placeholder="Wallet Address" value="${c.crypto.address}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
          <div><label class="block text-sm font-medium text-[#000000] mb-1">Amount (optional)</label>
            <input type="text" id="input-crypto-amount" placeholder="Amount" value="${c.crypto.amount}"
              class="w-full bg-white border border-[#f3f3f3] focus:border-[#bd1819] focus:outline-none focus:ring-4 focus:ring-[#bd1819]/25 rounded-[2px] py-3 px-4 transition-all text-[#000000] placeholder:text-[#666666]"/></div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
  bindInputEvents();
  if (c.dataType === 'location') initMap();
}

function bindInputEvents() {
  const fieldMap = {
    'input-url': ['url', v => state.url = v],
    'btn-clear-url': [null, () => { state.url = ''; renderDataTypeInput(); updateQR(); }],
    'input-text': ['text', v => state.text = v],
    'input-email-address': ['email', v => state.email.address = v],
    'input-email-subject': ['email', v => state.email.subject = v],
    'input-email-body': ['email', v => state.email.body = v],
    'input-phone': ['phone', v => state.phone = v],
    'input-sms-phone': ['sms', v => state.sms.phone = v],
    'input-sms-message': ['sms', v => state.sms.message = v],
  };

  const vcardFields = ['firstName', 'lastName', 'organization', 'position', 'phoneWork', 'phonePrivate', 'email', 'street', 'city', 'state', 'country'];
  vcardFields.forEach(f => {
    fieldMap[`input-vcard-${f}`] = ['vcard', v => state.vcard[f] = v];
  });

  fieldMap['input-loc-lat'] = ['location', v => state.location.latitude = v];
  fieldMap['input-loc-lng'] = ['location', v => state.location.longitude = v];

  const searchInput = document.getElementById('input-loc-search');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      state.location.address = query;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (query.length > 3) {
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat).toFixed(6);
                const lon = parseFloat(data[0].lon).toFixed(6);
                const numLat = parseFloat(lat);
                const numLon = parseFloat(lon);
                const latInput = document.getElementById('input-loc-lat');
                const lngInput = document.getElementById('input-loc-lng');
                if (latInput) { latInput.value = lat; state.location.latitude = lat; }
                if (lngInput) { lngInput.value = lon; state.location.longitude = lon; }
                updateQR();
                if (mapInstance && mapMarker) {
                  mapInstance.setView([numLat, numLon], 13);
                  mapMarker.setLatLng([numLat, numLon]);
                }
                const status = document.getElementById('loc-search-status');
                if (status) {
                  status.classList.remove('hidden');
                  setTimeout(() => status.classList.add('hidden'), 3000);
                }
              }
            }).catch(err => console.error(err));
        }
      }, 1000);
    });
  }

  fieldMap['input-wifi-ssid'] = ['wifi', v => state.wifi.ssid = v];
  fieldMap['input-wifi-password'] = ['wifi', v => state.wifi.password = v];

  fieldMap['input-event-title'] = ['event', v => state.event.title = v];
  fieldMap['input-event-location'] = ['event', v => state.event.location = v];
  fieldMap['input-event-start'] = ['event', v => state.event.startTime = v];
  fieldMap['input-event-end'] = ['event', v => state.event.endTime = v];

  fieldMap['input-crypto-address'] = ['crypto', v => state.crypto.address = v];
  fieldMap['input-crypto-amount'] = ['crypto', v => state.crypto.amount = v];

  for (const [id, [, handler]] of Object.entries(fieldMap)) {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'btn-clear-url') {
        el.addEventListener('click', handler);
      } else {
        el.addEventListener('input', () => {
          let val = el.value;
          // Real-time sanitization based on input type or ID
          if (el.type === 'tel') {
            val = val.replace(/[^0-9+\-() ]/g, '');
            if (val !== el.value) el.value = val;
          } else if (id === 'input-loc-lat' || id === 'input-loc-lng') {
            val = val.replace(/[^0-9.\-]/g, '');
            if (val !== el.value) el.value = val;
            handler(val); 
            updateQR();
            if (mapInstance && mapMarker) {
              const numLat = parseFloat(state.location.latitude) || 51.049259;
              const numLon = parseFloat(state.location.longitude) || 13.73836;
              mapInstance.setView([numLat, numLon], 13);
              mapMarker.setLatLng([numLat, numLon]);
            }
            return;
          } else if (id === 'input-crypto-amount') {
            val = val.replace(/[^0-9.]/g, '');
            const parts = val.split('.');
            if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
            if (val !== el.value) el.value = val;
          } else if (el.type === 'email') {
            val = val.replace(/\s/g, '');
            if (val !== el.value) el.value = val;
          }
          handler(val); 
          updateQR(); 
        });
      }
    }
  }

  const wifiEnc = document.getElementById('input-wifi-encryption');
  if (wifiEnc) wifiEnc.addEventListener('change', () => { state.wifi.encryption = wifiEnc.value; updateQR(); });

  document.querySelectorAll('input[name="crypto-asset"]').forEach(el => {
    el.addEventListener('change', () => { state.crypto.asset = el.value; updateQR(); });
  });
}

function initMap() {
  const container = document.getElementById('map-container');
  if (!container) return;
  container.innerHTML = '';

  const lat = parseFloat(state.location.latitude) || 51.049259;
  const lng = parseFloat(state.location.longitude) || 13.73836;

  if (mapInstance) { mapInstance.remove(); mapInstance = null; }

  mapInstance = L.map(container).setView([lat, lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapInstance);

  mapMarker = L.marker([lat, lng]).addTo(mapInstance);

  mapInstance.on('click', (e) => {
    const latVal = e.latlng.lat.toFixed(6);
    const lngVal = e.latlng.lng.toFixed(6);
    state.location.latitude = latVal;
    state.location.longitude = lngVal;
    mapMarker.setLatLng(e.latlng);
    const latInput = document.getElementById('input-loc-lat');
    const lngInput = document.getElementById('input-loc-lng');
    if (latInput) latInput.value = latVal;
    if (lngInput) lngInput.value = lngVal;
    updateQR();
  });

  setTimeout(() => mapInstance.invalidateSize(), 100);
}

function updateColorUI() {
  const fgInput = document.getElementById('fg-color');
  const bgInput = document.getElementById('bg-color');
  const fgLabel = document.getElementById('fg-color-label');
  const bgLabel = document.getElementById('bg-color-label');
  if (fgInput) fgInput.value = state.fgColor;
  if (bgInput) bgInput.value = state.bgColor;
  if (fgLabel) fgLabel.textContent = state.fgColor.toUpperCase();
  if (bgLabel) bgLabel.textContent = state.bgColor.toUpperCase();
}

function updateTabContent() {
  const logoContent = document.getElementById('tab-logo-content');
  const customizeContent = document.getElementById('tab-customize-content');
  const stylesContent = document.getElementById('tab-styles-content');
  const tabs = document.querySelectorAll('.settings-tab');

  tabs.forEach(tab => {
    const t = tab.dataset.tab;
    tab.className = `settings-tab w-1/3 flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold transition-all ${t === state.activeTab ? 'text-white bg-[#bd1819] border-b-2 border-[#bd1819]' : 'text-[#666666] hover:text-[#000000] hover:bg-white'}`;
  });

  logoContent.style.display = state.activeTab === 'logo' ? 'block' : 'none';
  customizeContent.style.display = state.activeTab === 'customize' ? 'block' : 'none';
  stylesContent.style.display = state.activeTab === 'styles' ? 'block' : 'none';
}

function renderLogoContent() {
  const container = document.getElementById('tab-logo-content');
  if (!container) return;
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-wrap gap-3">
        <button id="btn-upload-logo" class="flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#bd1819] hover:bg-[#a31213] text-white font-medium transition-all">
          ${svgIcon(ICONS.upload, 16)} Upload Logo
        </button>
        ${(state.logo || state.logoPresetId) ? `
        <button id="btn-remove-logo" class="flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#f3f3f3] hover:bg-[#e5e5e5] text-[#000000] font-medium transition-all border border-[#f3f3f3]">
          ${svgIcon(ICONS.trash, 16)} Remove Logo
        </button>` : ''}
      </div>
      <div>
        <p class="text-sm text-[#666666] mb-3">Or choose a preset icon:</p>
        <div class="flex flex-wrap gap-2">
          ${LOGO_PRESETS.map(p => {
            const url = generateLogoDataUrl(p.svgTemplate, '#334155');
            return `<button data-preset="${p.id}" class="logo-preset-btn w-10 h-10 rounded-[2px] border flex items-center justify-center transition-all ${state.logoPresetId === p.id ? 'border-[#bd1819] bg-[#bd1819]' : 'border-[#f3f3f3] hover:border-[#bd1819] bg-white'}" title="${p.name}">
              <img src="${url}" alt="${p.name}" class="w-6 h-6"/></button>`;
          }).join('')}
        </div>
      </div>
      <div id="logo-badge-area">
        ${(state.logo || state.logoPresetId) ? `
        <div class="flex items-center gap-3 p-3 bg-white rounded-[2px] border border-[#f3f3f3]">
          <img src="${getLogoDataUrl()}" alt="Selected logo" class="w-10 h-10 object-contain rounded-[2px] bg-white p-1 border border-[#f3f3f3]"/>
          <div>
            <p class="text-sm font-medium text-[#000000]">Logo applied</p>
            <p class="text-xs text-[#666666]">${state.logoPresetId ? 'Color adapts to QR foreground' : 'Auto-scaled to 28% for scannability'}</p>
          </div>
        </div>` : ''}
      </div>
    </div>`;

  document.getElementById('btn-upload-logo')?.addEventListener('click', () => {
    document.getElementById('file-input')?.click();
  });

  document.getElementById('btn-remove-logo')?.addEventListener('click', () => {
    state.logo = undefined;
    state.logoPresetId = null;
    renderLogoContent();
    updateQR();
  });

  document.querySelectorAll('.logo-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.preset;
      state.logoPresetId = id;
      state.logo = undefined;
      renderLogoContent();
      updateQR();
    });
  });
}

function renderCustomizeContent() {
  const container = document.getElementById('tab-customize-content');
  if (!container) return;

  const dotBtns = DOT_TYPE_OPTIONS.map(o => {
    const url = 'data:image/svg+xml,' + encodeURIComponent(o.svgTemplate.replace(/{fgColor}/g, '#334155'));
    return `<button data-dot-type="${o.type}" class="customize-opt-btn w-[40px] h-[40px] p-[5px] rounded-[2px] border flex items-center justify-center transition-all ${state.dotType === o.type ? 'border-[#bd1819] bg-[#bd1819]' : 'border-[#f3f3f3] hover:border-[#bd1819] bg-white'}" title="${o.name}"><img src="${url}" alt="${o.name}" class="w-full h-full"/></button>`;
  }).join('');

  const cornerBtns = CORNER_SQUARE_OPTIONS.map(o => {
    const url = 'data:image/svg+xml,' + encodeURIComponent(o.svgTemplate.replace(/{fgColor}/g, '#334155'));
    return `<button data-cs-type="${o.type}" class="customize-opt-btn w-[40px] h-[40px] p-[5px] rounded-[2px] border flex items-center justify-center transition-all ${state.cornerSquareType === o.type ? 'border-[#bd1819] bg-[#bd1819]' : 'border-[#f3f3f3] hover:border-[#bd1819] bg-white'}" title="${o.name}"><img src="${url}" alt="${o.name}" class="w-full h-full"/></button>`;
  }).join('');

  const cornerDotBtns = CORNER_DOT_OPTIONS.map(o => {
    const url = 'data:image/svg+xml,' + encodeURIComponent(o.svgTemplate.replace(/{fgColor}/g, '#334155'));
    return `<button data-cd-type="${o.type}" class="customize-opt-btn w-[40px] h-[40px] p-[5px] rounded-[2px] border flex items-center justify-center transition-all ${state.cornerDotType === o.type ? 'border-[#bd1819] bg-[#bd1819]' : 'border-[#f3f3f3] hover:border-[#bd1819] bg-white'}" title="${o.name}"><img src="${url}" alt="${o.name}" class="w-full h-full"/></button>`;
  }).join('');

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-medium text-[#666666] mb-3">Body Shape</h3>
        <div class="flex flex-wrap gap-2">${dotBtns}</div>
      </div>
      <div>
        <h3 class="text-sm font-medium text-[#666666] mb-3">Eye Frame Shape</h3>
        <div class="flex flex-wrap gap-2">${cornerBtns}</div>
      </div>
      <div>
        <h3 class="text-sm font-medium text-[#666666] mb-3">Eye Ball Shape</h3>
        <div class="flex flex-wrap gap-2">${cornerDotBtns}</div>
      </div>
      <div class="pt-4 border-t border-[#f3f3f3] space-y-6">
        <div>
          <h3 class="text-sm font-medium text-[#666666] mb-3">Error Correction Level (Scannability vs Details)</h3>
          <div class="flex bg-[#f3f3f3] p-1 rounded-[2px]" id="error-level-group">
            ${['L', 'M', 'Q', 'H'].map(l => `
              <button data-level="${l}" class="level-btn flex-1 py-2 px-3 rounded-[2px] text-sm font-medium transition-all ${state.level === l ? 'bg-white text-[#000000] border border-[#f3f3f3]' : 'text-[#666666] hover:text-[#000000]'}">
                ${l === 'L' ? 'Low (7%)' : l === 'M' ? 'Med (15%)' : l === 'Q' ? 'Quart (25%)' : 'High (30%)'}
              </button>
            `).join('')}
          </div>
          <p class="text-xs text-[#666666] mt-2">Higher levels allow the QR code to be scanned even if part of it is covered (like by a logo).</p>
        </div>
        <div class="flex items-center justify-between p-4 bg-white rounded-[2px] border border-[#f3f3f3]">
          <div>
            <h3 class="text-sm font-medium text-[#000000]">Include Margin</h3>
            <p class="text-xs text-[#666666]">Adds a white safe-zone border around the QR code</p>
          </div>
          <button id="margin-toggle" class="relative inline-flex h-6 w-11 items-center rounded-[2px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#bd1819] focus:ring-offset-2 ${state.includeMargin ? 'bg-[#bd1819]' : 'bg-[#e5e5e5]'}">
            <span id="margin-toggle-dot" class="inline-block h-4 w-4 transform rounded-[2px] bg-white transition-transform ${state.includeMargin ? 'translate-x-6' : 'translate-x-1'}"></span>
          </button>
        </div>
      </div>
    </div>`;

  container.querySelectorAll('[data-dot-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.dotType = btn.dataset.dotType;
      renderCustomizeContent();
      updateQR();
    });
  });
  container.querySelectorAll('[data-cs-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.cornerSquareType = btn.dataset.csType;
      renderCustomizeContent();
      updateQR();
    });
  });
  container.querySelectorAll('[data-cd-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.cornerDotType = btn.dataset.cdType;
      renderCustomizeContent();
      updateQR();
    });
  });
  container.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.level = btn.dataset.level;
      renderCustomizeContent();
      updateQR();
    });
  });
  document.getElementById('margin-toggle')?.addEventListener('click', () => {
    state.includeMargin = !state.includeMargin;
    renderCustomizeContent();
    updateQR();
  });
}

function renderStylesContent() {
  const container = document.getElementById('tab-styles-content');
  if (!container) return;
  container.innerHTML = `
    <div class="flex flex-wrap gap-3">
      ${PRESETS.map(p => `
        <button data-preset-id="${p.id}" class="preset-btn group relative flex items-center gap-3 px-4 py-3 rounded-[2px] bg-white border border-[#f3f3f3] hover:border-[#bd1819] transition-all hover:bg-[#f3f3f3]">
          <div class="flex -space-x-3">
            <div class="w-6 h-6 rounded-[2px] border border-[#f3f3f3] z-10" style="background-color:${p.fgColor}"></div>
            <div class="w-6 h-6 rounded-[2px] border border-[#f3f3f3]" style="background-color:${p.bgColor}"></div>
          </div>
          <span class="text-sm font-medium text-[#000000]">${p.name}</span>
        </button>
      `).join('')}
    </div>`;

  container.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = PRESETS.find(p => p.id === btn.dataset.presetId);
      if (preset) {
        state.fgColor = preset.fgColor;
        state.bgColor = preset.bgColor;
        state.dotType = preset.style === 'dots' ? 'dots' : 'square';
        updateColorUI();
        renderCustomizeContent();
        updateQR();
      }
    });
  });
}

function updateDownloadButtons() {
  const need = needsInput();
  const isDownloading = downloading !== null;
  const btns = document.querySelectorAll('.download-btn');
  btns.forEach(btn => {
    btn.disabled = need || isDownloading;
  });
}

function downloadQR(extension) {
  const svg = document.querySelector('#qr-desktop svg, #qr-mobile svg');
  if (!svg) return;

  if (!leadCaptured) {
    downloading = extension;
    updateDownloadButtons();
    showLeadModal(extension);
    return;
  }

  performDownload(extension);
}

async function copyToClipboard() {
  const svg = document.querySelector('#qr-desktop svg, #qr-mobile svg');
  if (!svg) return;
  copying = true;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = state.bgColor || '#ffffff';
    ctx.fillRect(0, 0, 1024, 1024);
    const src = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);
      canvas.toBlob(async (b) => {
        if (b) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]);
          } catch (e) { console.error('Clipboard failed:', e); }
        }
        setTimeout(() => { copying = false; }, 2000);
      });
    };
    img.src = url;
  } catch (err) {
    console.error('Copy failed:', err);
    setTimeout(() => { copying = false; }, 2000);
  }
}

let pendingDownloadExt = null;

function injectLeadModal() {
  const existing = document.getElementById('lead-modal-overlay');
  if (existing) return;

  const modalHTML = `
    <div id="lead-modal-overlay" class="lead-modal-overlay">
      <div class="lead-modal-card">
        <button id="lead-modal-close" class="lead-modal-close">&times;</button>
        <div class="lead-modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bd1819" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/></svg>
        </div>
        <h3 class="lead-modal-title">Download Your QR Code</h3>
        <p class="lead-modal-subtitle">Enter your details to start your free download</p>
        <div class="lead-modal-form">
          <div class="lead-field">
            <label for="lead-name">Full Name <span class="lead-required">*</span></label>
            <input type="text" id="lead-name" placeholder="e.g. John Doe" autocomplete="name" required/>
          </div>
          <div class="lead-field">
            <label for="lead-email">Email Address <span class="lead-required">*</span></label>
            <input type="email" id="lead-email" placeholder="e.g. john@example.com" autocomplete="email" required/>
          </div>
          <div class="lead-field">
            <label for="lead-phone">Phone Number <span class="lead-required">*</span></label>
            <input type="tel" id="lead-phone" placeholder="e.g. +1234567890" autocomplete="tel" required/>
          </div>
          <div id="lead-modal-error" class="lead-modal-error" style="display:none;"></div>
          <button id="lead-modal-submit" class="lead-modal-submit">
            <span id="lead-submit-text">Download QR Code</span>
            <span id="lead-submit-loader" style="display:none;">
              <svg class="lead-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </span>
          </button>
        </div>
        <p class="lead-modal-footer">We respect your privacy. Your data is safe with us.</p>
      </div>
    </div>
  `;

  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .lead-modal-overlay {
      position: fixed; inset: 0; z-index: 999999;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: leadFadeIn 0.25s ease;
    }
    @keyframes leadFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes leadSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .lead-modal-card {
      background: #fff; border-radius: 12px; padding: 40px 36px 32px;
      max-width: 420px; width: 100%; position: relative;
      box-shadow: 0 25px 60px rgba(0,0,0,0.2); animation: leadSlideUp 0.3s ease;
      font-family: 'Inter', 'Satoshi', sans-serif;
    }
    .lead-modal-close {
      position: absolute; top: 12px; right: 16px; background: none; border: none;
      font-size: 28px; color: #999; cursor: pointer; line-height: 1; padding: 4px;
      transition: color 0.2s;
    }
    .lead-modal-close:hover { color: #333; }
    .lead-modal-icon {
      text-align: center; margin-bottom: 16px;
    }
    .lead-modal-title {
      font-size: 22px; font-weight: 700; color: #000; text-align: center;
      margin: 0 0 6px 0; font-family: 'Raleway', sans-serif;
    }
    .lead-modal-subtitle {
      font-size: 14px; color: #666; text-align: center; margin: 0 0 24px 0;
    }
    .lead-modal-form { display: flex; flex-direction: column; gap: 16px; }
    .lead-field label {
      display: block; font-size: 13px; font-weight: 600; color: #000;
      margin-bottom: 4px;
    }
    .lead-required { color: #bd1819; }
    .lead-field input {
      width: 100%; padding: 12px 14px; border: 1px solid #e0e0e0;
      border-radius: 6px; font-size: 15px; color: #000;
      background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .lead-field input:focus {
      border-color: #bd1819; box-shadow: 0 0 0 3px rgba(189,24,25,0.1);
    }
    .lead-field input::placeholder { color: #aaa; }
    .lead-modal-error {
      background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
      padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: 500;
    }
    .lead-modal-submit {
      width: 100%; padding: 14px; border: none; border-radius: 6px;
      background: #bd1819; color: #fff; font-size: 16px; font-weight: 700;
      cursor: pointer; transition: background 0.2s, transform 0.1s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .lead-modal-submit:hover { background: #a31213; }
    .lead-modal-submit:active { transform: scale(0.98); }
    .lead-modal-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    @keyframes leadSpin { to { transform: rotate(360deg); } }
    .lead-spinner { animation: leadSpin 1s linear infinite; }
    .lead-modal-footer {
      text-align: center; font-size: 12px; color: #999; margin-top: 20px;
    }
  `;

  document.body.appendChild(modalStyle);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHTML.trim();
  document.body.appendChild(wrapper.firstChild);
}

function showLeadModal(extension) {
  pendingDownloadExt = extension;
  injectLeadModal();

  const overlay = document.getElementById('lead-modal-overlay');
  overlay.style.display = 'flex';

  document.getElementById('lead-modal-close').onclick = () => {
    overlay.style.display = 'none';
    downloading = null;
    updateDownloadButtons();
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      downloading = null;
      updateDownloadButtons();
    }
  });

  document.getElementById('lead-modal-submit').onclick = submitLead;

  document.getElementById('lead-name').focus();

  document.querySelectorAll('#lead-name, #lead-email, #lead-phone').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitLead();
    });
  });
}

async function submitLead() {
  const name = document.getElementById('lead-name').value.trim();
  const email = document.getElementById('lead-email').value.trim();
  const phone = document.getElementById('lead-phone').value.trim();
  const errorEl = document.getElementById('lead-modal-error');
  const submitBtn = document.getElementById('lead-modal-submit');
  const submitText = document.getElementById('lead-submit-text');
  const submitLoader = document.getElementById('lead-submit-loader');

  errorEl.style.display = 'none';

  if (!name) { showLeadError('Please enter your full name.'); return; }
  if (!email) { showLeadError('Please enter your email address.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showLeadError('Please enter a valid email address.'); return; }
  if (!phone) { showLeadError('Please enter your phone number.'); return; }

  submitBtn.disabled = true;
  submitText.style.display = 'none';
  submitLoader.style.display = 'flex';

  const qrValue = getQRData();

  try {
    const response = await fetch(LEAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        qr_type: state.dataType,
        qr_value: qrValue,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || errData.email?.[0] || 'Failed to submit. Please try again.');
    }

    leadCaptured = true;
    document.getElementById('lead-modal-overlay').style.display = 'none';
    if (pendingDownloadExt) {
      performDownload(pendingDownloadExt);
      pendingDownloadExt = null;
    }
  } catch (err) {
    showLeadError(err.message);
    submitBtn.disabled = false;
    submitText.style.display = 'inline';
    submitLoader.style.display = 'none';
  }
}

function showLeadError(msg) {
  const el = document.getElementById('lead-modal-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function performDownload(extension) {
  downloading = extension;
  updateDownloadButtons();

  const svg = document.querySelector('#qr-desktop svg, #qr-mobile svg');
  if (!svg) { downloading = null; updateDownloadButtons(); return; }

  try {
    if (extension === 'svg') {
      const cloned = svg.cloneNode(true);
      cloned.setAttribute('width', '250px');
      cloned.setAttribute('height', '250px');
      const src = new XMLSerializer().serializeToString(cloned);
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'makemyqrcode-com.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = state.bgColor || '#ffffff';
      ctx.fillRect(0, 0, 1024, 1024);
      const src = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1024, 1024);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'makemyqrcode-com.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        downloading = null;
        updateDownloadButtons();
      };
      img.src = url;
      return;
    }
  } catch (err) {
    console.error('Download failed:', err);
  }
  downloading = null;
  updateDownloadButtons();
}

function init() {
  renderDataTypeInput();
  updateColorUI();
  renderLogoContent();
  renderCustomizeContent();
  renderStylesContent();

  document.querySelectorAll('.data-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.dataType = btn.dataset.type;
      updateDataTypeTabs();
      renderDataTypeInput();
      updateQR();
    });
  });

  document.getElementById('fg-color')?.addEventListener('input', (e) => {
    state.fgColor = e.target.value;
    updateColorUI();
    updateQR();
  });
  document.getElementById('bg-color')?.addEventListener('input', (e) => {
    state.bgColor = e.target.value;
    updateColorUI();
    updateQR();
  });

  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.activeTab = tab.dataset.tab;
      updateTabContent();
    });
  });

  document.getElementById('file-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.logo = ev.target.result;
      state.logoPresetId = null;
      renderLogoContent();
      updateQR();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  document.getElementById('btn-png')?.addEventListener('click', () => downloadQR('png'));
  document.getElementById('btn-svg')?.addEventListener('click', () => downloadQR('svg'));
  document.getElementById('btn-copy')?.addEventListener('click', copyToClipboard);

  window.addEventListener('resize', () => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const mobileContainer = document.getElementById('qr-mobile');
    const desktopContainer = document.getElementById('qr-desktop');

    if (isDesktop && desktopContainer && !desktopContainer.querySelector('svg') && qrCodeInstance) {
      if (mobileContainer) mobileContainer.innerHTML = '';
      desktopContainer.innerHTML = '';
      qrCodeInstance.append(desktopContainer);
      styleSvg(desktopContainer);
    } else if (!isDesktop && mobileContainer && !mobileContainer.querySelector('svg') && qrCodeInstance) {
      if (desktopContainer) desktopContainer.innerHTML = '';
      mobileContainer.innerHTML = '';
      qrCodeInstance.append(mobileContainer);
      styleSvg(mobileContainer);
    }
  });

  updateQR();
}

document.addEventListener('DOMContentLoaded', init);
