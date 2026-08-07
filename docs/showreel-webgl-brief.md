# Showreel WebGL — brief „NALOT" (terrain-scan reveal)

Zwycięska koncepcja z panelu projektowego (4 koncepcje × 3 sędziów: wydajność / brand-fit / ryzyko implementacji), 2026-08. Sekcja zastąpi ukryty `<Reel />` (siatka 2×2) w [src/App.jsx](../src/App.jsx).

## Pomysł

Jeden kinowy, pełnoszerokościowy kadr WebGL. Materiał z drona najpierw wygląda jak **niezeskanowana mapa terenu** — odbarwiony kadr z delikatnymi izoliniami wyliczonymi z luminancji samego footage — a cienka **czerwona wiązka (#dc2626, kolor podpisu)** przelatuje przez kadr jak dron mapujący i odsłania żywe, pełnokolorowe wideo. Każda zmiana klipu to kolejny „nalot": ten sam skan jest tranzycją. Efekt w 100% zbudowany z treści klienta — zero ozdobników, zero gadżetów kursorowych, żadnych reakcji na ruch myszy.

## Flow użytkownika

1. **Wejście**: nagłówek „✦ Showreel / Zobacz to w ruchu" (istniejący pattern `.title`). Kadr 16:9 pokazuje poster aktywnego klipu w trybie „mapa" (desaturacja ~85%, słabe białe izolinie, winieta).
2. **Pierwszy skan**: IntersectionObserver (NIE scrub) → czerwona linia przelatuje z góry na dół w ~1,4 s; nad linią „mapa", pod linią grające (muted, loop) wideo w kolorze. Przy linii 0,5–1,5% displacementu UV + minimalny RGB-split w paśmie ~2% wysokości (technika fake-3D z `szablon-kreatywny-1`, sterowana czasem, nie kursorem).
3. **Wybór klipu**: rząd etykiet pod kadrem (aktywna: czerwony ✦ + pełna biel). Klik → bieżąca klatka zamarza w teksturze (stop uploadu), skan przelatuje ponownie: strona „from" dostaje treatment mapy, „to" = poster nowego klipu; gdy nowy klip złapie `canplay`, upload przejmuje teksturę.
4. **Dźwięk**: klik w kadr = toggle mute, pigułka „Dźwięk wł./wył." przeniesiona 1:1 z `Reel.jsx`.
5. **Spoczynek**: wyjście z viewportu → pauza + mute + stop RAF; powrót → wznowienie bez ponownego skanu. Pod kadrem jedna linia mono/uppercase: `53.1235 N / 18.0084 E — BYDGOSZCZ` + label klipu — jedyny „dronowy" akcent HUD.

## Technika

- **Raw WebGL1, 0 KB zależności** (wzorzec `FooterAurora`): 1 fullscreen triangle, cover-UV w shaderze (`uUvScale/uUvOffset`), vertex passthrough.
- Fragment: `uTexFrom`/`uTexTo`, `uProgress` skanu, pasmo krawędzi ~2% (mix do #dc2626 + displacement + RGB-split), strona „mapa": `luma = dot(rgb, vec3(.299,.587,.114))`, desat `mix(rgb, luma, .85)`, izolinie `smoothstep(fract(luma*12.0))` białe ~5% alpha; strona odsłonięta: kolor + winieta + dither `hash()` z aurory.
- **Tekstury wideo**: 2× RGBA 1080p (LINEAR, CLAMP, bez mip, FLIP_Y); pierwszy `texImage2D`, potem `texSubImage2D`; upload gated przez `requestVideoFrameCallback` (~25–30/s, fallback throttled-RAF); **JEDEN aktywny `<video>` w całej sekcji** (reużywany element, podmiana `src`). Kontekst: `alpha:false, depth:false, stencil:false, antialias:false`; DPR cap 1,5; szerokość canvasa cap 1920 px.

## Struktura plików

```
src/components/sections/Showreel/
  index.jsx          # shell: nagłówek, kadr aspect-video, selektor, IO + bramka capabilities
  ShowreelGL.jsx     # canvas + silnik (dynamic import)
  showreelShaders.js
  ShowreelFallback.jsx  # natywne wideo (mobile / reduced-motion / brak WebGL)
```

Sekcja w normalnym flow `#content`, **bez pinowania** — zero interakcji z pin-spacerami i ScrollSmootherem. Dane z `constants/reels` (opcjonalnie pole `title` per klip).

## Wydajność

- Bundle: +0 KB zależności; chunk ~6–8 KB gzip przez dynamic import odpalany IO (`rootMargin: 300px`) tylko przy: desktop + `pointer:fine` + brak reduced-motion + żywy WebGL.
- Per-frame: 1 upload 1080p (1–3 ms) tylko przy nowej klatce; poza viewportem 0 pracy GPU; wideo `preload="none"`, `src` dopiero w rootMargin; CLS 0 (aspect-video); pamięć GPU ~16 MB.

## Fallback (mobile / reduced-motion / brak WebGL)

Natywny `<video>` 16:9 z logiką tap=play-z-dźwiękiem z `Reel.jsx` + ten sam selektor klipów. Namiastka skanu bez WebGL: poster z `filter: grayscale(1)` → kolor (transition 600 ms przy IO), czerwona linia jako div animowany transformem. Przy reduced-motion: bez animacji, wideo tylko po tapnięciu.

## Dostępność

Canvas `aria-hidden`; kadr = `<button aria-pressed>` (dźwięk), selektor = `<button aria-current>`; focus-ring jak w `Reel.jsx`; etykieta aktywnego klipu i status dźwięku w widocznym tekście.

## MUST-FIX od sędziów (do wdrożenia w kodzie)

1. **Tryb jednego klipu jako pełnoprawny stan**: deduplikować `reels` po `src` — przy 1 unikalnym klipie selektor znika (sekcja ma wyglądać na skończoną DZIŚ); tranzycja między identycznymi plikami nieosiągalna z UI.
2. **Kolizja numeracji**: etykiety klipów NIE mogą wyglądać jak numeracja sekcji 01–04 (użyć „Klip 01"/ticków z labelami, nie samych liczb).
3. **Twarda bramka GL**: `matchMedia('(pointer:fine)') && navigator.maxTouchPoints === 0 && webgl && !reduced-motion` — iPad z trackpadem ma iść w fallback.
4. **Idempotentny init pod React 19 StrictMode**: scena singletonem per canvas; cleanup wg wzorca FooterAurora (bez `loseContext` — biały canvas po remoncie).
5. **Auto-degradacja**: pomiar czasu klatki po starcie; średnia > 8 ms → zjazd do fallbacku.
6. **rVFC fallback** (throttled RAF) dla starszych Safari/Firefox.

## Ryzyka

- `texImage2D` z `<video>` wolniejszy w Safari/iGPU → mitygacje wyżej (DPR cap, rVFC, auto-degradacja).
- Izolinie mogą „szumieć" na kontrastowych posterach → stała liczba poziomów (~12), alpha ~5%, w razie czego zostaje sama desaturacja + skan.
- Dziś tylko 1 plik wideo — do demo potrzebne różne postery (są: `fota*-800.webp`).

**Wycena**: ~4 dni robocze. Wyniki panelu: NALOT 23,5/30 · AFISZ (plakaty fake-3D + lightbox) 23/30 · PRZELOT-slider 20/30 · PRZELOT-splajn 12/30.
