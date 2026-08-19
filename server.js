const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const areas = [
  { id: 'new-strip', name: 'New Strip', subtitle: 'Resorts, shows, and late-night energy', x: 58, y: 48, base: 2, tags: ['resorts', 'shows', 'nightlife'] },
  { id: 'old-strip', name: 'Old Strip', subtitle: 'Classic casinos and local landmarks', x: 48, y: 60, base: 1, tags: ['classic vegas', 'casinos', 'history'] },
  { id: 'downtown', name: 'Downtown / Fremont', subtitle: 'Neon canopy, museums, and street life', x: 37, y: 31, base: 2, tags: ['fremont', 'neon', 'food'] },
  { id: 'arts-district', name: 'Arts District', subtitle: 'Galleries, breweries, and independent shops', x: 40, y: 49, base: 1, tags: ['art', 'food', 'walkable'] },
  { id: 'chinatown', name: 'Chinatown', subtitle: 'Pan-Asian dining and late-night food', x: 29, y: 61, base: 1, tags: ['dining', 'shopping', 'local'] },
  { id: 'airport', name: 'Airport Corridor', subtitle: 'McCarran access, rentals, and transfers', x: 62, y: 76, base: 1, tags: ['airport', 'transit', 'hotels'] },
  { id: 'summerlin', name: 'Summerlin', subtitle: 'Trails, golf, and Red Rock access', x: 11, y: 29, base: 0, tags: ['outdoors', 'golf', 'red rock'] },
  { id: 'henderson', name: 'Henderson', subtitle: 'Quiet resorts, lakes, and family stays', x: 80, y: 74, base: 0, tags: ['family', 'lakes', 'resorts'] }
];

const events = [
  { id: 'demo-1', area: 'new-strip', title: 'Demo: road closure near resort corridor', type: 'transport', severity: 'watch', time: '18 min ago', verified: false },
  { id: 'demo-2', area: 'downtown', title: 'Demo: large public gathering', type: 'crowd', severity: 'watch', time: '42 min ago', verified: false },
  { id: 'demo-3', area: 'airport', title: 'Demo: rideshare pickup congestion', type: 'travel', severity: 'info', time: '1 hr ago', verified: false }
];

function json(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

function hourRisk(hour, base) {
  const nightlife = hour >= 21 || hour < 3 ? 2 : hour >= 17 ? 1 : 0;
  return Math.min(3, base + nightlife);
}

function riskLabel(level) {
  return ['Calm', 'Active', 'Busy', 'High activity'][level];
}

function snapshot(hour = new Date().getHours()) {
  return areas.map(area => ({ ...area, riskLevel: hourRisk(hour, area.base), riskLabel: riskLabel(hourRisk(hour, area.base)) }));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (request.method === 'GET' && url.pathname === '/api/health') return json(response, 200, { status: 'ok' });
  if (request.method === 'GET' && url.pathname === '/api/areas') return json(response, 200, { hour: new Date().getHours(), areas: snapshot() });
  if (request.method === 'GET' && url.pathname === '/api/events') return json(response, 200, { live: false, disclaimer: 'Demo events only. Connect a verified public-safety feed before displaying live incidents.', events: events.slice(0, 10) });
  if (request.method === 'GET' && url.pathname === '/api/areas/' + url.pathname.split('/').pop()) {
    const area = snapshot().find(item => item.id === url.pathname.split('/').pop());
    return area ? json(response, 200, area) : json(response, 404, { error: 'area not found' });
  }

  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.join(__dirname, requested);
  const relative = path.relative(__dirname, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return json(response, 403, { error: 'forbidden' });
  fs.readFile(file, (error, content) => {
    if (error) return json(response, 404, { error: 'not found' });
    const type = file.endsWith('.css') ? 'text/css; charset=utf-8' : file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
    response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    response.end(content);
  });
});

module.exports = { areas, events, hourRisk, snapshot };
if (require.main === module) server.listen(Number(process.env.PORT || 3000), () => console.log('Vegas Travel Intelligence on http://localhost:' + (process.env.PORT || 3000)));
