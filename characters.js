function characterSVG(person, outfit, pose = 'stand', options = {}) {
  const isA = person === 'a';
  const walk = pose === 'walk';
  const skin = isA ? '#efbd9a' : '#f2c09e';
  const skinDark = isA ? '#d99a75' : '#dda07a';
  const hair = isA ? '#303033' : '#4a3435';
  const hairHi = isA ? '#514b4a' : '#684b4b';
  const palette = isA
    ? { tee: '#7698b7', tee2: '#5f82a2', bottom: '#516477', outer: '#b19b82', outer2: '#927d67', accent: '#d5e6f4' }
    : { tee: '#ce929e', tee2: '#b87b88', bottom: '#796b78', outer: '#b6a091', outer2: '#987f75', accent: '#f4d9df' };

  const umbrella = !!outfit.umbrella;
  const hasOuter = outfit.outer && outfit.outer !== 'none';
  const heavy = outfit.outer === 'heavy';
  const jacket = outfit.outer === 'jacket';
  const light = outfit.outer === 'light';
  const longSleeve = outfit.top === 'long';
  const shorts = outfit.bottom === 'shorts';
  const skirt = outfit.bottom === 'skirt';
  const pants = outfit.bottom === 'pants';
  const carryBag = options.carryBag !== false;
  const facing = options.facing || 'right';
  const flip = facing === 'left' ? 'translate(220 0) scale(-1 1)' : '';

  const legLeft = walk ? 'M92 190 Q84 220 72 244' : 'M92 190 L87 244';
  const legRight = walk ? 'M116 190 Q128 220 143 241' : 'M116 190 L121 244';
  const armBack = walk ? 'M84 119 Q68 143 60 157' : 'M84 119 Q70 143 67 161';
  const armFront = umbrella ? 'M126 120 Q142 102 151 87' : (walk ? 'M126 120 Q143 139 153 151' : 'M126 120 Q142 145 145 160');

  const hairShape = isA
    ? `<path d="M70 61Q70 18 108 18q41 0 43 45-9-11-19-18-34-20-22-3-47 18-47 18Z" fill="${hair}"/>
       <path d="M80 42q28-25 57-4-11-8-29-7-16 0-28 11Z" fill="${hairHi}" opacity=".6"/>`
    : `<path d="M63 66Q61 17 108 15q46 2 44 54c0 24-7 42-17 57l-18-10 6-63q-18-16-38 1l4 61-17 10Q62 99 63 66Z" fill="${hair}"/>
       <path d="M76 39q34-28 63 2-14-10-31-9-18 1-32 7Z" fill="${hairHi}" opacity=".55"/>`;

  const lower = pants
    ? `<path d="M82 166h45l7 67-21 2-9-48-8 48-21-2Z" fill="${palette.bottom}"/>`
    : shorts
      ? `<path d="M80 165h48l3 33-22-1-5-18-5 18-23 1Z" fill="${palette.bottom}"/>`
      : `<path d="M80 163h48l14 48H66Z" fill="${palette.bottom}"/><path d="M73 190h62" stroke="rgba(255,255,255,.22)" stroke-width="3"/>`;

  const bodyFill = hasOuter ? palette.outer : palette.tee;
  const sleeveWidth = hasOuter || longSleeve ? 18 : 12;
  const collar = hasOuter
    ? `<path d="M94 101l10 14 10-14" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linejoin="round"/>`
    : `<path d="M94 99q11 11 22 0" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>`;

  return `
  <svg class="character-svg" viewBox="0 0 220 280" role="img" aria-label="穿搭示意人物">
    <g transform="${flip}">
      <ellipse cx="108" cy="260" rx="58" ry="8" fill="rgba(33,29,24,.08)"/>

      ${umbrella ? `
        <g class="umbrella-art">
          <path d="M151 88V45" stroke="#5f5d59" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M116 47q8-34 44-34t44 34Z" fill="#8da8b7"/>
          <path d="M116 47q10-17 22 0 10-18 22 0 10-18 22 0 10-17 22 0" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2"/>
          <path d="M151 88q0 14 13 14 9 0 9-9" fill="none" stroke="#5f5d59" stroke-width="3.5" stroke-linecap="round"/>
        </g>` : ''}

      ${carryBag ? `<path d="M73 131q-14 16-11 51h18q1-30 8-43" fill="${palette.outer2}" opacity=".9"/><path d="M63 148q8-7 17 0" fill="none" stroke="rgba(255,255,255,.36)" stroke-width="2"/>` : ''}

      ${hairShape}
      <circle cx="108" cy="67" r="31" fill="${skin}"/>
      <path d="M81 61q5-17 18-23" fill="none" stroke="${hair}" stroke-width="9" stroke-linecap="round"/>
      ${!isA ? `<path d="M132 46q11 7 13 19" fill="none" stroke="${hair}" stroke-width="9" stroke-linecap="round"/>` : ''}

      <ellipse cx="97" cy="66" rx="3" ry="4" fill="#3b3130"/>
      <ellipse cx="119" cy="66" rx="3" ry="4" fill="#3b3130"/>
      <circle cx="96" cy="65" r="1" fill="#fff"/><circle cx="118" cy="65" r="1" fill="#fff"/>
      <ellipse cx="88" cy="78" rx="7" ry="3.3" fill="#ef9a9f" opacity=".42"/>
      <ellipse cx="128" cy="78" rx="7" ry="3.3" fill="#ef9a9f" opacity=".42"/>
      <path d="M101 79q7 6 14 0" fill="none" stroke="${skinDark}" stroke-width="2.3" stroke-linecap="round"/>

      <path d="${armBack}" stroke="${bodyFill}" stroke-width="${sleeveWidth}" stroke-linecap="round"/>
      <path d="${armFront}" stroke="${bodyFill}" stroke-width="${sleeveWidth}" stroke-linecap="round"/>
      ${!hasOuter && !longSleeve ? `<circle cx="60" cy="157" r="6" fill="${skin}"/><circle cx="${umbrella ? 151 : 153}" cy="${umbrella ? 87 : 151}" r="6" fill="${skin}"/>` : ''}

      <path d="M78 108q8-17 30-17t32 17l-8 59H84Z" fill="${bodyFill}"/>
      ${collar}
      ${hasOuter ? `<path d="M108 101v66" stroke="rgba(255,255,255,.58)" stroke-width="2.2"/>
        <circle cx="114" cy="126" r="2" fill="rgba(255,255,255,.62)"/><circle cx="114" cy="141" r="2" fill="rgba(255,255,255,.62)"/>
        ${heavy ? `<path d="M83 112q25-17 51 0" stroke="rgba(255,255,255,.32)" stroke-width="11" fill="none"/><path d="M85 153h46" stroke="${palette.outer2}" stroke-width="7" opacity=".45"/>` : ''}
        ${jacket ? `<path d="M85 151h46" stroke="rgba(255,255,255,.20)" stroke-width="5"/>` : ''}
        ${light ? `<path d="M88 108l14 17M128 108l-14 17" stroke="rgba(255,255,255,.36)" stroke-width="3"/>` : ''}` : ''}

      ${lower}
      <path d="${legLeft}" stroke="${skin}" stroke-width="18" stroke-linecap="round"/>
      <path d="${legRight}" stroke="${skin}" stroke-width="18" stroke-linecap="round"/>
      ${pants ? `<path d="M92 181L87 232M116 181l5 51" stroke="${palette.bottom}" stroke-width="19" stroke-linecap="round"/>` : ''}

      <path d="${walk ? 'M62 247q17 3 30 0' : 'M74 247h29'}" stroke="#4b4845" stroke-width="10" stroke-linecap="round"/>
      <path d="${walk ? 'M135 244q14 4 27 1' : 'M108 247h29'}" stroke="#4b4845" stroke-width="10" stroke-linecap="round"/>
      <path d="${walk ? 'M65 244h20' : 'M78 244h18'}" stroke="#fff" stroke-width="2" opacity=".5"/>
      <path d="${walk ? 'M139 242h16' : 'M112 244h18'}" stroke="#fff" stroke-width="2" opacity=".5"/>
    </g>
  </svg>`;
}

function previewOutfit(person) {
  return { top: 'tee', bottom: person === 'a' ? 'shorts' : 'skirt', outer: 'none', umbrella: false };
}
