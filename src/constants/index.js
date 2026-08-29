const services = [
  {
    title: "Ujęcia promocyjne",
    desc: "materiały wideo i zdjęcia dla firm, produktów i marek.",
  },
  {
    title: "Eventy i wydarzenia",
    desc: "dynamiczne relacje z koncertów, imprez, zlotów.",
  },
  {
    title: "Nieruchomości i architektura",
    desc: "zdjęcia i filmy z drona dla agentów i inwestorów.",
  },
  {
    title: "Inspekcje i tereny",
    desc: "przeloty kontrolne nad budynkami, liniami, działkami.",
  },
  {
    title: "Montaż wideo",
    desc: "cięcia, muzyka, koloryzacja i finalny eksport materiału.",
  },
];

// `tall` – kadry z centralną kompozycją znoszą pionowe przycięcie na mobile;
// panoramy zostają szerokie, żeby nie stracić rozpiętości ujęcia.
const galleryPhotos = [
  { id: 1, tall: true, alt: "Nocne rondo z lotu ptaka – samochód w świetle ulicznych latarni" },
  { id: 3, tall: true, alt: "Samochód na drodze wśród pól i szpaleru drzew – ujęcie z drona" },
  { id: 4, alt: "Żaglówka na jeziorze przy przystani – fotografia lotnicza" },
  { id: 5, alt: "Drift na torze wyścigowym z lotu ptaka – relacja z eventu" },
  { id: 6, alt: "Wyścigi terenowe – publiczność i auta na trasie, widok z drona" },
  { id: 7, alt: "Sportowe coupé nad wodą o zachodzie słońca – kadr z drona" },
  { id: 8, alt: "Start do wyścigu równoległego na pasie lotniska – zdjęcie z drona" },
  { id: 9, tall: true, alt: "Zabytkowy pałac otoczony parkiem – fotografia lotnicza" },
];

// Showreel – 4 sloty na klipy; podmień webm/mp4/poster i label, sekcja zaktualizuje się sama.
// Sloty mogą wskazywać ten sam plik: różne `start` (sekundy) pokazują różne
// fragmenty rolki (16,6 s), więc wszystkie 4 klipy są widoczne już dziś.
const reels = [
  {
    id: 1,
    label: "Klip 01",
    webm: "/videos/rolka-2mbps.webm",
    mp4: "/videos/rolka-2mbps.mp4",
    poster: "/photos/rolka-poster.webp",
    start: 2,
  },
  {
    id: 2,
    label: "Klip 02",
    webm: "/videos/rolka-2mbps.webm",
    mp4: "/videos/rolka-2mbps.mp4",
    poster: "/photos/fota7-800.webp",
    start: 6,
  },
  {
    id: 3,
    label: "Klip 03",
    webm: "/videos/rolka-2mbps.webm",
    mp4: "/videos/rolka-2mbps.mp4",
    poster: "/photos/fota1-800.webp",
    start: 10,
  },
  {
    id: 4,
    label: "Klip 04",
    webm: "/videos/rolka-2mbps.webm",
    mp4: "/videos/rolka-2mbps.mp4",
    poster: "/photos/fota3-800.webp",
    start: 14,
  },
];

// Sekcja 02 na mobile – dane w siatce, tak jak specyfikacja drona w sekcji 03
const dawidFacts = [
  { title: "5+ lat", desc: "z dronem w powietrzu" },
  { title: "Bydgoszcz", desc: "i okolice" },
  { title: "Foto i wideo", desc: "z jednego lotu" },
  { title: "Z pasji", desc: "nie z przypadku" },
];

// Kredyt wykonawcy w stopce. rel: "nofollow noopener" – bez "noreferrer",
// które ucina nagłówek Referer i sprawia, że wejścia znikają z analityki
// studia jako ruch bezpośredni. Anchor zawsze nazwą marki, nigdy frazą kluczową.
const studioCredit = {
  label: "Realizacja:",
  name: "SoraWeb Studio",
  href: "https://soraweb.pl/realizacje/dawid-chesiak-dron?utm_source=dawid-drone-operator.netlify.app&utm_medium=referral&utm_campaign=footer-credit",
  rel: "nofollow noopener",
};

const dronVideo = [
  {
    title: "4K (3840×2160)",
    desc: "24/25/30/50/60 fps",
  },
  {
    title: "2.7K (2688×1512)",
    desc: "24/25/30/48/50/60 fps",
  },
  {
    title: "FHD (1920×1080)",
    desc: "24/25/30/48/50/60 fps",
  },
  {
    title: "HDR",
    desc: "przy 24/25/30 fps",
  },

];

export {
  services,
  studioCredit,
  galleryPhotos,
  reels,
  dawidFacts,
  dronVideo
}