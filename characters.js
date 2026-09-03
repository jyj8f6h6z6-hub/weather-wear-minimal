
function characterSVG(person, outfit, pose = 'stand', options = {}) {
  const feminine = person === 'b';
  const walk = pose === 'walk';
  const umbrella = !!outfit.umbrella;
  const outer = outfit.outer || 'none';
  const long = outfit.top === 'long';
  const pants = outfit.bottom === 'pants';
  const shorts = outfit.bottom === 'shorts';
  const skirt = outfit.bottom === 'skirt';
  const facing = options.facing || 'right';
  const flip = facing === 'left' ? 'translate(240 0) scale(-1 1)' : '';

  // IG / editorial palette：低飽和、黑白灰、卡其、丹寧。
  const skin = feminine ? '#E9B89B' : '#DDAF91';
  const hair = feminine ? '#292524' : '#252525';
  const ink = '#252525';
  const cream = '#F4F0E8';
  const denim = '#667889';
  const charcoal = '#35383A';
  const taupe = '#A59482';
  const olive = '#72786B';
  const topColor = feminine ? '#D8D0C7' : '#E5E0D7';
  const accent = feminine ? '#7D6D68' : '#59636B';

  const outerColor = outer === 'heavy' ? charcoal : outer === 'jacket' ? olive : taupe;
  const legA = walk ? 'M105 226 C94 250 84 270 69 292' : 'M104 226 L99 292';
  const legB = walk ? 'M129 226 C145 250 156 269 172 288' : 'M129 226 L135 292';
  const armA = walk ? 'M92 137 C76 157 69 180 61 196' : 'M92 137 C78 161 73 181 70 197';
  const armB = umbrella ? 'M145 137 C158 117 168 100 178 83' : (walk ? 'M145 137 C163 153 174 172 184 188' : 'M145 137 C159 160 165 181 168 198');

  const bottom = pants
    ? `<path d="M96 202h44l7 73-19 3-10-55-7 55-20-3Z" fill="${charcoal}"/>`
    : shorts
      ? `<path d="M94 202h47l3 34-21-1-6-20-5 20-22 1Z" fill="${denim}"/>`
      : `<path d="M92 201h51l16 54H78Z" fill="${accent}"/>`;

  const footwear = feminine
    ? `<path d="${walk ? 'M56 294q22 5 37-2' : 'M84 294h29'}" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>
       <path d="${walk ? 'M160 291q17 4 31-1' : 'M121 294h31'}" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`
    : `<path d="${walk ? 'M55 294q24 7 40 0' : 'M83 294h31'}" stroke="${cream}" stroke-width="12" stroke-linecap="round"/>
       <path d="${walk ? 'M160 291q18 6 34 0' : 'M121 294h33'}" stroke="${cream}" stroke-width="12" stroke-linecap="round"/>
       <path d="${walk ? 'M56 297q24 6 40 0' : 'M83 297h31'}" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>
       <path d="${walk ? 'M160 294q18 5 34 0' : 'M121 297h33'}" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>`;

  const hairShape = feminine
    ? `<path d="M80 78c-2-42 19-61 48-61 33 0 52 23 48 65-2 25-10 50-20 67l-17-10 5-78c-18-17-42-14-55 4l5 74-18 10C83 128 80 102 80 78Z" fill="${hair}"/>
       <path d="M91 42c20-19 48-17 67 3-18-11-47-12-67-3Z" fill="#4A403C" opacity=".45"/>`
    : `<path d="M84 65c2-31 20-48 47-48 27 0 43 15 47 42-11-10-20-13-32-14-18-2-37 4-62 20Z" fill="${hair}"/>
       <path d="M94 34c19-13 44-11 61 4-19-7-40-8-61-4Z" fill="#4C4C4C" opacity=".42"/>`;

  const torso = outer !== 'none'
    ? `<path d="M91 128c8-17 20-25 38-25 20 0 34 9 42 27l-11 78H94Z" fill="${outerColor}"/>
       <path d="M129 108v99" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
       <path d="M102 118l18 22 9-31 10 31 19-22" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="3"/>`
    : `<path d="M94 128c7-17 19-25 36-25 19 0 31 9 39 27l-10 78H96Z" fill="${topColor}"/>
       <path d="M111 108c9 8 25 8 34 0" fill="none" stroke="${accent}" stroke-width="3.5" stroke-linecap="round"/>`;

  return `
  <svg class="character-svg editorial-character" viewBox="0 0 240 320" role="img" aria-label="穿搭示意">
    <g transform="${flip}">
      <ellipse cx="124" cy="304" rx="63" ry="7" fill="rgba(28,28,28,.08)"/>

      ${umbrella ? `
      <g class="fashion-umbrella">
        <path d="M178 84V42" stroke="${ink}" stroke-width="2.5"/>
        <path d="M132 44C142 12 177 4 207 21c12 7 20 17 25 29-28-8-67-9-100-6Z" fill="${ink}"/>
        <path d="M133 44c19-5 39-5 57-2 16 2 29 5 41 8" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
        <path d="M178 83c0 15 6 21 16 21 8 0 12-5 12-11" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>
      </g>` : ''}

      ${hairShape}
      <ellipse cx="130" cy="78" rx="35" ry="39" fill="${skin}"/>
      <path d="M107 76c7-4 13-4 19 0M139 76c6-4 12-4 18 0" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="118" cy="79" r="2.1" fill="${ink}"/><circle cx="149" cy="79" r="2.1" fill="${ink}"/>
      <path d="M128 94c6 3 11 3 17-1" fill="none" stroke="#9B6D61" stroke-width="2" stroke-linecap="round"/>
      ${feminine ? `<path d="M113 97c10 8 23 8 33-1" fill="none" stroke="#9B6D61" stroke-width="1.2" opacity=".45"/>` : ''}

      <path d="${armA}" stroke="${outer !== 'none' ? outerColor : topColor}" stroke-width="${outer !== 'none' || long ? 17 : 12}" stroke-linecap="round"/>
      <path d="${armB}" stroke="${outer !== 'none' ? outerColor : topColor}" stroke-width="${outer !== 'none' || long ? 17 : 12}" stroke-linecap="round"/>
      ${outer === 'none' && !long ? `<circle cx="61" cy="196" r="6" fill="${skin}"/><circle cx="${umbrella ? 178 : 184}" cy="${umbrella ? 83 : 188}" r="6" fill="${skin}"/>` : ''}

      ${torso}
      ${bottom}

      <path d="${legA}" stroke="${skin}" stroke-width="17" stroke-linecap="round"/>
      <path d="${legB}" stroke="${skin}" stroke-width="17" stroke-linecap="round"/>
      ${pants ? `<path d="M107 217L99 286M130 217l5 69" stroke="${charcoal}" stroke-width="18" stroke-linecap="round"/>` : ''}

      ${footwear}

      ${options.carryBag !== false ? `
      <g class="fashion-bag">
        <path d="M78 151c-11 17-13 39-9 61" fill="none" stroke="${ink}" stroke-width="3"/>
        <rect x="58" y="188" width="31" height="39" rx="3" fill="${ink}"/>
        <path d="M63 191h21" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
      </g>` : ''}
    </g>
  </svg>`;
}

function previewOutfit(person) {
  return {
    top: 'tee',
    bottom: person === 'b' ? 'skirt' : 'pants',
    outer: 'none',
    umbrella: false
  };
}
