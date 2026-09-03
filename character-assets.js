
const CharacterAssets = (() => {
  const base = 'assets/characters-v8';

  function weatherKey(conditions) {
    return conditions?.rain ? 'rain' : 'dry';
  }

  function src(person, conditions, pose = 'stand') {
    const safePerson = person === 'b' ? 'b' : 'a';
    const safePose = pose === 'walk' ? 'walk' : 'stand';
    return `${base}/${safePerson}/${weatherKey(conditions)}-${safePose}.webp`;
  }

  function img(person, conditions, pose = 'stand', className = '') {
    const label = pose === 'walk' ? '出發穿搭' : '抵達穿搭';
    return `<img class="character-img editorial-photo ${className}" src="${src(person, conditions, pose)}" alt="${label}" draggable="false">`;
  }

  function preview(person) {
    return `<img class="character-img editorial-photo preview-img" src="${base}/${person}/preview.webp" alt="人物風格" draggable="false">`;
  }

  return { src, img, preview };
})();
