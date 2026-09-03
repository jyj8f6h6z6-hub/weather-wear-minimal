const GooglePlacesSearch = (() => {
  let readyPromise = null;
  let element = null;
  let onSelectHandler = null;

  function apiKey() {
    return (window.APP_CONFIG && window.APP_CONFIG.GOOGLE_MAPS_API_KEY || '').trim();
  }

  function hasKey() {
    const key = apiKey();
    return !!key && !key.includes('YOUR_') && key.length > 10;
  }

  function loadGoogle() {
    if (window.google?.maps?.importLibrary) return Promise.resolve();
    if (readyPromise) return readyPromise;

    readyPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey())}&v=weekly&loading=async&language=zh-TW&region=TW`;
      script.async = true;
      script.onerror = () => reject(new Error('Google Maps 載入失敗'));
      script.onload = resolve;
      document.head.appendChild(script);
    });

    return readyPromise;
  }

  async function mount(container, { currentLocation, onSelect }) {
    if (!hasKey()) return false;
    onSelectHandler = onSelect;
    await loadGoogle();
    const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');

    if (!element) {
      element = new PlaceAutocompleteElement();
      element.placeholder = '搜尋地點';
      element.setAttribute('aria-label', '搜尋目的地');
      element.addEventListener('gmp-select', async ({ placePrediction }) => {
        try {
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
          if (!place.location) return;
          onSelectHandler?.({
            latitude: place.location.lat(),
            longitude: place.location.lng(),
            name: place.displayName || place.formattedAddress || '目的地',
            address: place.formattedAddress || ''
          });
        } catch (error) {
          console.error(error);
        }
      });
    }

    if (currentLocation?.lat && currentLocation?.lon) {
      element.locationBias = {
        center: { lat: currentLocation.lat, lng: currentLocation.lon },
        radius: 50000
      };
    }

    container.replaceChildren(element);
    return true;
  }

  return { mount, hasKey };
})();


