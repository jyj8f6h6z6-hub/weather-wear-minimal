
const CharacterAssets = (() => {
  const base = 'assets/characters-v9';

  function weatherKey(conditions) {
    return conditions?.rain ? 'rain' : 'dry';
  }

  function src(person, conditions, pose = 'stand') {
    const safePerson = person === 'b' ? 'b' : 'a';
    const safePose = pose === 'walk' ? 'walk' : 'stand';
    return `${base}/${safePerson}/${weatherKey(conditions)}-${safePose}.png`;
  }

  function img(person, conditions, pose = 'stand', className = '') {
    return `<img class="character-img ${className}" src="${src(person, conditions, pose)}" alt="" draggable="false">`;
  }

  function preview(person) {
    return `<img class="character-img preview-img" src="${base}/${person}/preview.png" alt="" draggable="false">`;
  }

  return { src, img, preview };
})();
