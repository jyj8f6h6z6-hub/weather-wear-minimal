const OutfitEngine = (() => {
  function weatherIcon(code, isDay = 1) {
    if ([0].includes(code)) return isDay ? '☀️' : '🌙';
    if ([1,2].includes(code)) return isDay ? '🌤️' : '☁️';
    if ([3,45,48].includes(code)) return '☁️';
    if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌧️';
    if ([71,73,75,77,85,86].includes(code)) return '🌨️';
    if ([95,96,99].includes(code)) return '⛈️';
    return '🌤️';
  }

  function isRain(code, precipitation = 0) {
    return precipitation > 0.05 || [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code);
  }

  function classify(temp, apparent, code, precipitation = 0) {
    const feels = Number.isFinite(apparent) ? apparent : temp;
    const rain = isRain(code, precipitation);
    let warmth;
    if (feels >= 29) warmth = 'hot';
    else if (feels >= 24) warmth = 'warm';
    else if (feels >= 19) warmth = 'mild';
    else if (feels >= 14) warmth = 'cool';
    else warmth = 'cold';
    return { warmth, rain, feels };
  }

  function outfitFor(person, conditions) {
    const { warmth, rain } = conditions;
    let outfit = { top: 'tee', bottom: person === 'a' ? 'shorts' : 'skirt', outer: 'none', umbrella: rain };
    let headline = '輕鬆穿';

    if (warmth === 'hot') {
      headline = rain ? '清爽＋雨具' : '清爽就好';
    } else if (warmth === 'warm') {
      outfit.bottom = person === 'a' ? 'shorts' : 'skirt';
      headline = rain ? '短袖＋雨具' : '短袖就好';
    } else if (warmth === 'mild') {
      outfit.bottom = 'pants';
      headline = rain ? '薄外套＋雨具' : '帶件薄外套';
      outfit.outer = 'light';
    } else if (warmth === 'cool') {
      outfit.top = 'long';
      outfit.bottom = 'pants';
      outfit.outer = 'jacket';
      headline = rain ? '外套＋雨具' : '外套穿上';
    } else {
      outfit.top = 'long';
      outfit.bottom = 'pants';
      outfit.outer = 'heavy';
      headline = rain ? '厚外套＋雨具' : '厚外套';
    }
    return { ...outfit, headline };
  }

  function carryAdvice(nowOutfit, destOutfit, nowCond, destCond) {
    const items = [];
    const outerRank = { none: 0, light: 1, jacket: 2, heavy: 3 };
    if (outerRank[destOutfit.outer] > outerRank[nowOutfit.outer]) items.push('🧥 帶外套');
    if (destCond.rain && !nowCond.rain) items.push('☂️ 帶傘');
    if (nowCond.rain && !destCond.rain) items.push('☂️ 傘先帶著');
    return items;
  }

  function tripHeadline(nowOutfit, destOutfit, nowCond, destCond) {
    if (nowCond.rain && !destCond.rain && destCond.feels - nowCond.feels >= 5) return '先保暖避雨，到達再輕裝';
    if (!nowCond.rain && destCond.rain) return '現在輕裝，雨具帶著';
    if (destCond.feels <= nowCond.feels - 5) return '到了會更涼';
    if (destCond.feels >= nowCond.feels + 5) return '到了會更暖';
    if (nowCond.rain && !destCond.rain) return '先撐傘，到了收起來';
    return '一路照這樣穿';
  }

  return { weatherIcon, classify, outfitFor, carryAdvice, tripHeadline };
})();
