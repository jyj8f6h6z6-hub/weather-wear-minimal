const state = { person: null, current: null, destination: null };
const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll('.screen')];
const rounded = n => Math.round(Number(n));

function showScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openPersonModal(force = false) {
  const modal = $('personModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.dataset.force = force ? '1' : '0';
}
function closePersonModal() {
  if ($('personModal').dataset.force === '1' && !state.person) return;
  $('personModal').classList.remove('open');
  $('personModal').setAttribute('aria-hidden', 'true');
  $('personModal').dataset.force = '0';
}

function renderPersonPreviews() {
  document.querySelectorAll('.person-preview').forEach(el => {
    el.innerHTML = CharacterAssets.preview(el.dataset.preview);
  });
}

function previewConditions() {
  if (state.current) return currentConditions();
  return { warmth: 'warm', rain: false, feels: 26 };
}

function renderHomeCharacter() {
  const person = state.person || 'b';
  $('homeCharacter').innerHTML = CharacterAssets.img(person, previewConditions(), 'walk', 'home-character-img');
}

function weatherText(code) {
  if ([0].includes(code)) return '晴朗';
  if ([1,2].includes(code)) return '晴時多雲';
  if ([3,45,48].includes(code)) return '多雲';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '有雨';
  if ([71,73,75,77,85,86].includes(code)) return '降雪';
  if ([95,96,99].includes(code)) return '雷雨';
  return '天氣變化';
}

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
    current: 'temperature_2m,apparent_temperature,precipitation,weather_code,is_day,wind_speed_10m',
    hourly: 'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,is_day,wind_speed_10m',
    timezone: 'auto', forecast_days: '2'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${qs}`);
  if (!res.ok) throw new Error('weather');
  return res.json();
}

function currentConditions() {
  const c = state.current.forecast.current;
  return OutfitEngine.classify(c.temperature_2m, c.apparent_temperature, c.weather_code, c.precipitation);
}

function currentRainProbability() {
  if (!state.current?.forecast?.hourly) return null;
  const h = hourlyAt(state.current.forecast, new Date());
  return Number.isFinite(h.precipitation_probability) ? h.precipitation_probability : null;
}

function outfitItems(outfit, cond) {
  const topMap = { tee:'短袖上衣', long:'長袖上衣' };
  const bottomMap = { shorts:'短褲', skirt:'輕便下身', pants:'長褲' };
  const outerMap = { light:'薄外套', jacket:'外套', heavy:'厚外套' };
  const items = [topMap[outfit.top] || '上衣', bottomMap[outfit.bottom] || '下身'];
  if (outfit.outer !== 'none') items.push(outerMap[outfit.outer]);
  items.push('休閒鞋');
  if (cond.rain) items.push('雨具');
  return items;
}

function updateHomeFromCurrent() {
  const c = state.current.forecast.current;
  const cond = currentConditions();
  $('homeWeatherIcon').textContent = OutfitEngine.weatherIcon(c.weather_code, c.is_day);
  $('homeTemp').textContent = `${rounded(c.temperature_2m)}°`;
  $('homePlace').textContent = `${state.current.place} · ${weatherText(c.weather_code)}`;
  $('nearbyBtn').disabled = false;
  $('locationStatus').textContent = state.current.place;
  const outfit = OutfitEngine.outfitFor(state.person, cond);
  $('homeTip').textContent = cond.rain ? `${outfit.headline}，今天記得把雨具一起帶著。` : `${outfit.headline}，體感約 ${rounded(cond.feels)}°C。`;
  renderHomeCharacter();
}

function requestLocation() {
  $('locationStatus').textContent = '定位中…';
  if (!navigator.geolocation) {
    $('locationStatus').textContent = '瀏覽器不支援定位';
    return;
  }
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude: lat, longitude: lon } = pos.coords;
      const [forecast, place] = await Promise.all([fetchForecast(lat, lon), reverseGeocode(lat, lon)]);
      state.current = { lat, lon, place, forecast };
      updateHomeFromCurrent();
      mountPlaces();
    } catch {
      $('locationStatus').textContent = '天氣暫時讀不到';
    }
  }, () => $('locationStatus').textContent = '請允許定位', { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 });
}

async function mountPlaces() {
  try {
    $('googlePlaceHost').hidden = false;
    await GooglePlacesSearch.mount($('googlePlaceHost'), {
      currentLocation: state.current,
      onSelect: selectDestination
    });
    $('destinationStatus').textContent = state.current ? '' : '先按「使用目前位置」，再搜尋目的地';
  } catch (error) {
    console.error('[Google Places]', error);
    $('googlePlaceHost').hidden = true;
    $('destinationStatus').textContent = 'Google 地點搜尋未載入';
    $('destinationStatus').title = error?.message || '';
  }
}

function renderNearby() {
  if (!state.current) return;
  const c = state.current.forecast.current;
  const cond = currentConditions();
  const outfit = OutfitEngine.outfitFor(state.person, cond);
  const rainProb = currentRainProbability();

  $('nearbyWeatherIcon').textContent = OutfitEngine.weatherIcon(c.weather_code, c.is_day);
  $('nearbyTemp').textContent = `${rounded(c.temperature_2m)}°`;
  $('nearbyPlace').textContent = state.current.place;
  $('nearbyHeadline').textContent = outfit.headline;
  $('nearbyFeels').textContent = `${rounded(cond.feels)}°`;
  $('nearbyRain').textContent = rainProb == null ? (cond.rain ? '有雨' : '偏低') : `${rounded(rainProb)}%`;
  $('nearbyWind').textContent = Number.isFinite(c.wind_speed_10m) ? `${rounded(c.wind_speed_10m)} km/h` : '--';
  $('nearbySummary').textContent = cond.rain ? '今天有雨，穿搭維持俐落輕便，同時把防雨納入整體造型。' : '依體感溫度安排層次，讓你出門不必再猜今天該穿多少。';
  $('nearbyCharacter').innerHTML = CharacterAssets.img(state.person, cond, 'stand', 'solo-character');
  $('nearbyOutfitList').innerHTML = outfitItems(outfit, cond).map(x => `<span class="outfit-chip">${x}</span>`).join('');
  $('nearbyAccessories').innerHTML = cond.rain ? `<span class="accessory-pill">☂️ 雨傘</span>` : `<span class="accessory-pill">✓ 輕裝出門</span>`;
  showScreen('screen-result-nearby');
}

function haversineKm(a, b) {
  const R = 6371, dLat = (b.lat-a.lat)*Math.PI/180, dLon = (b.lon-a.lon)*Math.PI/180;
  const lat1 = a.lat*Math.PI/180, lat2 = b.lat*Math.PI/180;
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function estimateTravelMinutes(a, b) {
  const km = haversineKm(a,b);
  // 這不是導航時間，只作為抵達天氣的粗略時間點。
  // 改用分段估算，避免台北→台南這類長距離被估成 6 小時以上。
  if (km < 3) return 15;
  if (km < 10) return 25;
  if (km < 40) return 50;
  if (km < 100) return 90;
  if (km < 200) return 150;
  if (km < 350) return 240;
  return 360;
}
function hourlyAt(forecast, targetTime) {
  const target = targetTime.getTime(); let idx = 0, diff = Infinity;
  forecast.hourly.time.forEach((t,i) => { const d = Math.abs(new Date(t).getTime()-target); if (d < diff) { diff=d; idx=i; } });
  return {
    temperature_2m: forecast.hourly.temperature_2m[idx],
    apparent_temperature: forecast.hourly.apparent_temperature[idx],
    precipitation_probability: forecast.hourly.precipitation_probability[idx],
    precipitation: forecast.hourly.precipitation[idx],
    weather_code: forecast.hourly.weather_code[idx],
    is_day: forecast.hourly.is_day[idx],
    wind_speed_10m: forecast.hourly.wind_speed_10m?.[idx],
    time: forecast.hourly.time[idx]
  };
}

async function selectDestination(r) {
  if (!state.current) {
    $('destinationStatus').textContent = '請先按「使用目前位置」，我才能比較出發與抵達天氣';
    return;
  }
  $('destinationStatus').textContent = '正在比較抵達天氣…';
  try {
    const dest = { lat: Number(r.latitude), lon: Number(r.longitude), place: r.name || '目的地', address: r.address || '' };
    dest.travelMin = estimateTravelMinutes(state.current, dest);
    dest.arrival = new Date(Date.now() + dest.travelMin*60000);
    dest.forecast = await fetchForecast(dest.lat, dest.lon);
    state.destination = dest;
    $('destinationStatus').textContent = '';
    renderTrip();
  } catch {
    $('destinationStatus').textContent = '目的地天氣讀不到';
  }
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
  $('tripCurrentFeels').textContent = `${rounded(nowCond.feels)}°`;
  $('tripDestFeels').textContent = `${rounded(destCond.feels)}°`;
  $('tripDestRain').textContent = Number.isFinite(destHour.precipitation_probability) ? `${rounded(destHour.precipitation_probability)}%` : (destCond.rain ? '有雨' : '偏低');

  $('tripCurrentCharacter').innerHTML = CharacterAssets.img(state.person, nowCond, 'walk', 'walking-character');
  $('tripDestCharacter').innerHTML = CharacterAssets.img(state.person, destCond, 'stand', 'arrival-character');

  $('tripHeadline').textContent = OutfitEngine.tripHeadline(nowOutfit, destOutfit, nowCond, destCond);
  const carry = OutfitEngine.carryAdvice(nowOutfit, destOutfit, nowCond, destCond);
  $('tripCarry').innerHTML = (carry.length ? carry : ['✓ 不用額外加東西']).map(x => `<span class="accessory-pill">${x}</span>`).join('');
  $('tripSummary').textContent = `出發體感 ${rounded(nowCond.feels)}°，抵達約 ${rounded(destCond.feels)}°。${destCond.rain ? '目的地有雨，雨具直接納入穿搭。' : '抵達後沒有明顯降雨訊號。'}`;
  $('tripEta').textContent = `約 ${state.destination.travelMin} 分`;
  showScreen('screen-result-trip');
}

renderPersonPreviews();
const remembered = localStorage.getItem('weatherWearPerson');
state.person = remembered === 'a' || remembered === 'b' ? remembered : 'b';
renderHomeCharacter();

$('personSwitchBtn').addEventListener('click', () => openPersonModal(false));
document.querySelectorAll('[data-close-person]').forEach(el => el.addEventListener('click', closePersonModal));
document.querySelectorAll('.person-card').forEach(btn => {
  btn.addEventListener('click', () => {
    state.person = btn.dataset.person;
    localStorage.setItem('weatherWearPerson', state.person);
    renderHomeCharacter();
    if (state.current) updateHomeFromCurrent();
    closePersonModal();
  });
});
$('locateBtn').addEventListener('click', requestLocation);
$('nearbyBtn').addEventListener('click', renderNearby);
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.back)));
document.querySelectorAll('.restart-btn').forEach(btn => btn.addEventListener('click', () => showScreen('screen-home')));
window.addEventListener('weatherwear:places-error', (e) => {
  $('destinationStatus').textContent = '這個地點暫時讀不到';
  $('destinationStatus').title = e.detail?.message || '';
});

const placesHost = $('googlePlaceHost');
if (placesHost) {
  placesHost.addEventListener('focusin', () => document.body.classList.add('places-open'));
  placesHost.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!placesHost.matches(':focus-within')) document.body.classList.remove('places-open');
    }, 180);
  });
}

mountPlaces();
