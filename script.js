const state = { person: null, current: null, destination: null };
const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll('.screen')];

function showScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
const rounded = n => Math.round(Number(n));

document.querySelectorAll('.person-preview').forEach(el => {
  const person = el.dataset.preview;
  el.innerHTML = CharacterAssets.preview(person);
});

document.querySelectorAll('.person-card').forEach(btn => {
  btn.addEventListener('click', () => {
    state.person = btn.dataset.person;
    localStorage.setItem('weatherWearPerson', state.person);
    showScreen('screen-location');
  });
});

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=zh&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const item = (await res.json()).results?.[0];
    return item?.name || item?.admin2 || item?.admin1 || '目前位置';
  } catch { return '目前位置'; }
}

async function fetchForecast(lat, lon) {
  const qs = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: 'temperature_2m,apparent_temperature,precipitation,weather_code,is_day',
    hourly: 'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,is_day',
    timezone: 'auto', forecast_days: '2'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${qs}`);
  if (!res.ok) throw new Error('weather');
  return res.json();
}

$('locateBtn').addEventListener('click', () => {
  $('locationStatus').textContent = '定位中…';
  if (!navigator.geolocation) return $('locationStatus').textContent = '無法定位';
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude: lat, longitude: lon } = pos.coords;
      const [forecast, place] = await Promise.all([fetchForecast(lat, lon), reverseGeocode(lat, lon)]);
      state.current = { lat, lon, place, forecast };
      $('currentPlace').textContent = place;
      $('currentWeatherMini').textContent = `${OutfitEngine.weatherIcon(forecast.current.weather_code, forecast.current.is_day)} ${rounded(forecast.current.temperature_2m)}°`;
      showScreen('screen-mode');
    } catch { $('locationStatus').textContent = '天氣暫時讀不到'; }
  }, () => $('locationStatus').textContent = '請允許定位', { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 });
});

function currentConditions() {
  const c = state.current.forecast.current;
  return OutfitEngine.classify(c.temperature_2m, c.apparent_temperature, c.weather_code, c.precipitation);
}

$('nearbyBtn').addEventListener('click', () => {
  const c = state.current.forecast.current;
  const cond = currentConditions();
  const outfit = OutfitEngine.outfitFor(state.person, cond);
  $('nearbyWeatherIcon').textContent = OutfitEngine.weatherIcon(c.weather_code, c.is_day);
  $('nearbyTemp').textContent = `${rounded(c.temperature_2m)}°`;
  $('nearbyHeadline').textContent = outfit.headline;
  $('nearbyCharacter').innerHTML = CharacterAssets.img(state.person, cond, 'stand', 'solo-character');
  $('nearbyAccessories').innerHTML = cond.rain ? `<span class="accessory-pill">☂️</span>` : '';
  $('nearbyCharacter').dataset.weather = cond.rain ? 'rain' : cond.warmth;
  showScreen('screen-result-nearby');
});

$('tripBtn').addEventListener('click', async () => {
  $('destinationStatus').textContent = '';
  showScreen('screen-destination');

  try {
    $('googlePlaceHost').hidden = false;
    await GooglePlacesSearch.mount($('googlePlaceHost'), {
      currentLocation: state.current,
      onSelect: selectDestination
    });
    $('destinationStatus').textContent = '';
  } catch (error) {
    console.error('[Google Places]', error);
    $('googlePlaceHost').hidden = true;
    $('destinationStatus').textContent = 'Google 地點搜尋未載入';
    $('destinationStatus').title = error?.message || '';
  }
});

function haversineKm(a, b) {
  const R = 6371, dLat = (b.lat-a.lat)*Math.PI/180, dLon = (b.lon-a.lon)*Math.PI/180;
  const lat1 = a.lat*Math.PI/180, lat2 = b.lat*Math.PI/180;
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function estimateTravelMinutes(a, b) {
  const km = haversineKm(a,b);
  if (km < 3) return 20;
  if (km < 10) return Math.round(20 + km*3.2);
  if (km < 40) return Math.round(25 + km*2.1);
  return Math.round(35 + km*1.35);
}
function hourlyAt(forecast, targetTime) {
  const target = targetTime.getTime(); let idx = 0, diff = Infinity;
  forecast.hourly.time.forEach((t,i) => { const d = Math.abs(new Date(t).getTime()-target); if (d < diff) { diff=d; idx=i; } });
  return {
    temperature_2m: forecast.hourly.temperature_2m[idx], apparent_temperature: forecast.hourly.apparent_temperature[idx],
    precipitation_probability: forecast.hourly.precipitation_probability[idx], precipitation: forecast.hourly.precipitation[idx],
    weather_code: forecast.hourly.weather_code[idx], is_day: forecast.hourly.is_day[idx], time: forecast.hourly.time[idx]
  };
}

async function selectDestination(r) {
  $('destinationStatus').textContent = '…';
  try {
    const dest = { lat: Number(r.latitude), lon: Number(r.longitude), place: r.name || '目的地', address: r.address || '' };
    dest.travelMin = estimateTravelMinutes(state.current, dest);
    dest.arrival = new Date(Date.now() + dest.travelMin*60000);
    dest.forecast = await fetchForecast(dest.lat, dest.lon);
    state.destination = dest;
    renderTrip();
  } catch { $('destinationStatus').textContent = '目的地天氣讀不到'; }
}

function sceneClass(cond, isDay) {
  if (cond.rain) return 'rain';
  if (!isDay) return 'night';
  if (cond.warmth === 'hot' || cond.warmth === 'warm') return 'sun';
  return 'cloud';
}

function renderTrip() {
  const now = state.current.forecast.current;
  const nowCond = OutfitEngine.classify(now.temperature_2m, now.apparent_temperature, now.weather_code, now.precipitation);
  const nowOutfit = OutfitEngine.outfitFor(state.person, nowCond);
  const destHour = hourlyAt(state.destination.forecast, state.destination.arrival);
  const destCond = OutfitEngine.classify(destHour.temperature_2m, destHour.apparent_temperature, destHour.weather_code, destHour.precipitation);
  const destOutfit = OutfitEngine.outfitFor(state.person, destCond);

  $('tripCurrentIcon').textContent = OutfitEngine.weatherIcon(now.weather_code, now.is_day);
  $('tripCurrentTemp').textContent = `${rounded(now.temperature_2m)}°`;
  $('tripCurrentPlace').textContent = state.current.place;
  $('tripDestIcon').textContent = OutfitEngine.weatherIcon(destHour.weather_code, destHour.is_day);
  $('tripDestTemp').textContent = `${rounded(destHour.temperature_2m)}°`;
  $('tripDestPlace').textContent = state.destination.place;

  $('tripCurrentCharacter').innerHTML = CharacterAssets.img(state.person, nowCond, 'walk', 'walking-character');
  $('tripDestCharacter').innerHTML = CharacterAssets.img(state.person, destCond, 'stand', 'arrival-character');
  $('tripCurrentScene').className = `scene-bubble ${sceneClass(nowCond, now.is_day)}`;
  $('tripDestScene').className = `scene-bubble ${sceneClass(destCond, destHour.is_day)}`;

  $('tripHeadline').textContent = OutfitEngine.tripHeadline(nowOutfit, destOutfit, nowCond, destCond);
  const carry = OutfitEngine.carryAdvice(nowOutfit, destOutfit, nowCond, destCond);
  $('tripCarry').innerHTML = carry.map(x => `<span class="accessory-pill">${x}</span>`).join('');
  const hh = String(state.destination.arrival.getHours()).padStart(2,'0');
  const mm = String(state.destination.arrival.getMinutes()).padStart(2,'0');
  $('tripEta').textContent = `${hh}:${mm} · ${state.destination.travelMin}分`;
  showScreen('screen-result-trip');
}

document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.back)));
document.querySelectorAll('.restart-btn').forEach(btn => btn.addEventListener('click', () => showScreen('screen-mode')));
const remembered = localStorage.getItem('weatherWearPerson');
if (remembered === 'a' || remembered === 'b') state.person = remembered;

window.addEventListener('weatherwear:places-error', (e) => { const el = document.getElementById('destinationStatus'); if (el) { el.textContent = '這個地點暫時讀不到'; el.title = e.detail?.message || ''; } });
