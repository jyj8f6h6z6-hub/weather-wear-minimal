const GooglePlacesSearch = (() => {
  let loaderPromise = null;
  let element = null;
  let selectHandler = null;

  function apiKey() {
    return String(window.APP_CONFIG?.GOOGLE_MAPS_API_KEY || '').trim();
  }

  function hasKey() {
    const key = apiKey();
    return key.length > 20 && !/YOUR_|貼上|AIza\.\.\./i.test(key);
  }

  function loadGoogle() {
    if (window.google?.maps?.importLibrary) return Promise.resolve();
    if (loaderPromise) return loaderPromise;

    loaderPromise = new Promise((resolve, reject) => {
      const callbackName = `__weatherWearGoogleReady_${Date.now()}`;
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error('Google Maps 載入逾時'));
      }, 12000);

      const cleanup = () => {
        window.clearTimeout(timeout);
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
      };

      window[callbackName] = () => {
        cleanup();
        resolve();
      };

      const script = document.createElement('script');
      const params = new URLSearchParams({
        key: apiKey(),
        v: 'weekly',
        libraries: 'places',
        loading: 'async',
        language: 'zh-TW',
        region: 'TW',
        callback: callbackName
      });
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        cleanup();
        reject(new Error('Google Maps JavaScript API 載入失敗'));
      };
      document.head.appendChild(script);
    });

    return loaderPromise;
  }

  function setBias(currentLocation) {
    if (!element || !currentLocation) return;
    const lat = Number(currentLocation.lat);
    const lng = Number(currentLocation.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    // 以目前位置為中心，約 50 公里內優先；仍可搜尋更遠地點。
    element.locationBias = { center: { lat, lng }, radius: 50000 };
  }

  async function mount(container, { currentLocation, onSelect }) {
    if (!hasKey()) throw new Error('尚未設定 Google Maps API Key');
    selectHandler = onSelect;

    await loadGoogle();
    const places = await google.maps.importLibrary('places');
    const PlaceAutocompleteElement = places.PlaceAutocompleteElement || google.maps.places?.PlaceAutocompleteElement;
    if (!PlaceAutocompleteElement) throw new Error('Place Autocomplete 元件不可用，請確認 Places API (New) 已啟用');

    // 確保 Web Component 已完成註冊，避免 GitHub Pages 首次載入時競態。
    if (window.customElements?.whenDefined) {
      await Promise.race([
        customElements.whenDefined('gmp-place-autocomplete'),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);
    }

    if (!element) {
      element = new PlaceAutocompleteElement({
        includedRegionCodes: ['tw']
      });
      element.placeholder = '搜尋地點';
      element.setAttribute('aria-label', '搜尋目的地');
      // 強制使用淺色模式，避免瀏覽器/系統深色偏好讓 Google 搜尋框變黑。
      element.style.colorScheme = 'light';
      element.style.width = '100%';

      element.addEventListener('gmp-select', async (event) => {
        try {
          const prediction = event.placePrediction;
          if (!prediction) throw new Error('沒有取得地點資料');
          const place = prediction.toPlace();
          await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
          if (!place.location) throw new Error('沒有取得座標');

          selectHandler?.({
            latitude: place.location.lat(),
            longitude: place.location.lng(),
            name: place.displayName || place.formattedAddress || '目的地',
            address: place.formattedAddress || ''
          });
        } catch (error) {
          console.error('[Places select]', error);
          window.dispatchEvent(new CustomEvent('weatherwear:places-error', { detail: error }));
        }
      });
    }

    setBias(currentLocation);
    // 每次進入頁面只保留一個 Google 搜尋元件。
    container.replaceChildren(element);
    return true;
  }

  return { mount, hasKey };
})();
