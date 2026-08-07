// Shadery sekcji Showreel („NALOT" – terrain-scan reveal).
// Jeden fullscreen triangle; cała geometria efektu liczy się w UV.
// Konwencje (hash/fbm-owy dither, winieta) współdzielone z FooterAurora.

export const SHOWREEL_VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

export const SHOWREEL_FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;

uniform sampler2D uTexFrom;    /* zamrożona klatka / poster poprzedniego klipu */
uniform sampler2D uTexPoster;  /* poster bieżącego klipu */
uniform sampler2D uTexVideo;   /* żywe wideo bieżącego klipu */

/* cover-fit: xy = scale, zw = offset */
uniform vec4 uCoverFrom;
uniform vec4 uCoverPoster;
uniform vec4 uCoverVideo;

uniform float uScanY;     /* pozycja wiązki w uv.y (1.05 -> -0.05); po skanie < -0.05 */
uniform float uVideoMix;  /* crossfade poster -> wideo po canplay */

const vec3 SCAN_RED = vec3(0.863, 0.149, 0.149); /* #dc2626 – czerwień podpisu */

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 coverUv(vec2 uv, vec4 c) {
  return 0.5 + (uv - 0.5) * c.xy + c.zw;
}

/* strona "niezeskanowana": odbarwiona mapa terenu z izoliniami z luminancji */
vec3 mapTreat(vec3 c) {
  float luma = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 des = mix(c, vec3(luma), 0.85) * 0.72;
  float lvl = fract(luma * 12.0);
  float iso = 1.0 - smoothstep(0.015, 0.05, min(lvl, 1.0 - lvl));
  return des + vec3(iso * 0.05);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;

  float dist = uv.y - uScanY;          /* >0 = nad wiązką (odsłonięte) */
  float band = 0.02;                    /* pasmo zaburzenia wokół wiązki */
  float inBand = 1.0 - smoothstep(0.0, band, abs(dist));

  /* displacement UV przy wiązce – "podmuch" skanu, oś Y */
  float wob = hash(vec2(uv.x * 240.0, uScanY * 60.0)) - 0.5;
  vec2 uvD = uv;
  uvD.y += inBand * wob * 0.012;

  /* bieżący klip = poster -> wideo */
  vec3 toCol = mix(
    texture2D(uTexPoster, coverUv(uvD, uCoverPoster)).rgb,
    texture2D(uTexVideo, coverUv(uvD, uCoverVideo)).rgb,
    uVideoMix
  );

  /* delikatny RGB-split tylko w paśmie wiązki */
  float split = inBand * 1.5 / uRes.y;
  toCol.r = mix(
    toCol.r,
    mix(
      texture2D(uTexPoster, coverUv(uvD + vec2(0.0, split), uCoverPoster)).r,
      texture2D(uTexVideo, coverUv(uvD + vec2(0.0, split), uCoverVideo)).r,
      uVideoMix
    ),
    inBand
  );

  vec3 fromCol = mapTreat(texture2D(uTexFrom, coverUv(uvD, uCoverFrom)).rgb);

  /* nad wiązką odsłonięty materiał, pod – mapa */
  float reveal = smoothstep(0.0, 0.004, dist);
  vec3 col = mix(fromCol, toCol, reveal);

  /* rdzeń wiązki: linia ~2px czystej czerwieni + poświata */
  float px = abs(dist) * uRes.y;
  float core = 1.0 - smoothstep(0.0, 2.0, px);
  float glow = (1.0 - smoothstep(0.0, 26.0, px)) * 0.18;
  col = mix(col, SCAN_RED, clamp(core + glow, 0.0, 1.0) * step(-1.0, uScanY) * step(uScanY, 1.049));

  /* winieta + dither przeciw bandingowi (konwencja z FooterAurora) */
  vec2 d = uv - 0.5;
  col *= 1.0 - dot(d, d) * 0.35;
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`
