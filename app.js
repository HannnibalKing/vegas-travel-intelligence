const areaGrid = document.querySelector('#area-grid');
const map = document.querySelector('#map');
const events = document.querySelector('#events');
const hourInput = document.querySelector('#hour');
const hourLabel = document.querySelector('#hour-label');

async function loadAreas(hour = hourInput.value) {
  const response = await fetch('/api/areas');
  const data = await response.json();
  const selected = data.areas.map(area => ({ ...area, riskLevel: Math.min(3, area.base + (hour >= 21 || hour < 3 ? 2 : hour >= 17 ? 1 : 0)) }));
  areaGrid.innerHTML = selected.map((area, index) => `<article class="area-card"><span class="num">0${index + 1}</span><h3>${area.name}</h3><p>${area.subtitle}</p><div class="tags">${area.tags.map(tag => `<span>${tag}</span>`).join(' / ')}</div></article>`).join('');
  map.innerHTML = selected.map(area => `<button class="map-point ${['calm','active','busy','high'][area.riskLevel]}" style="left:${area.x}%;top:${area.y}%" aria-label="${area.name}: ${['Calm','Active','Busy','High activity'][area.riskLevel]}"><span>${area.name}</span></button>`).join('');
  hourLabel.textContent = `${String(hour).padStart(2, '0')}:00`;
  document.querySelector('#city-state').textContent = hour >= 21 || hour < 3 ? 'Late-night activity model' : hour >= 17 ? 'Evening activity model' : 'Daytime activity model';
}

async function loadEvents() {
  const response = await fetch('/api/events');
  const data = await response.json();
  events.innerHTML = data.events.map(event => `<li><strong>${event.title}</strong><small>${event.time} / ${event.area} / ${event.severity}</small></li>`).join('');
}

hourInput.addEventListener('input', () => loadAreas(Number(hourInput.value)));
document.querySelector('#save-plan').addEventListener('click', event => { event.currentTarget.textContent = 'Plan saved'; setTimeout(() => { event.currentTarget.textContent = 'Save plan'; }, 1400); });
loadAreas();
loadEvents();
