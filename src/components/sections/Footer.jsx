import React, { lazy, Suspense, useEffect, useState } from 'react'
import FitText from '../text/FitText'
import Modal from '../ui/Modal'
import FooterAurora from '../ui/FooterAurora'
import { services } from '../../constants'
import { scrollToSection, scrollToTop } from '../../utils/scroll'

const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))

const MARQUEE_ITEMS = [...services.map((s) => s.title), 'Bydgoszcz i okolice']

const NAV_LINKS = [
  { href: '#start', label: 'Start' },
  { href: '#oferta', label: 'Oferta' },
  { href: '#o-mnie', label: 'O mnie' },
  { href: '#realizacje', label: 'Realizacje' },
]

const TIME_FORMAT = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Warsaw',
})

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded'

// Duży link kontaktowy: mała etykieta + wielki tekst z podkreśleniem rysującym się na hover
const ContactLink = ({ href, label, children, external = false }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className={`group block w-fit max-w-full ${FOCUS_RING}`}
  >
    <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/40 transition-colors duration-300 group-hover:text-red-500 md:text-xs">
      {label}
    </span>
    <span className="flex items-baseline gap-3 md:gap-6">
      <span className="relative inline-block text-[clamp(1.25rem,5.5vw,4.5rem)] font-extralight leading-[1.15] tracking-tight text-white/90 transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-500 after:ease-out after:content-[''] group-hover:text-white group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="text-[clamp(1rem,3vw,2.25rem)] font-extralight text-red-600 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
      >
        ↗
      </span>
    </span>
  </a>
)

const Availability = ({ className = '' }) => (
  <div
    className={`flex items-center gap-3 text-xs font-light uppercase tracking-[0.2em] text-white/70 md:text-sm ${className}`}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
    Dostępny do zleceń
  </div>
)

const MetaCell = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/40 md:text-xs">
      {label}
    </div>
    <div className="text-base font-light text-white/85 md:text-xl">{children}</div>
  </div>
)

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [time, setTime] = useState(() => TIME_FORMAT.format(new Date()))

  useEffect(() => {
    const interval = setInterval(() => setTime(TIME_FORMAT.format(new Date())), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer
      id="kontakt"
      className="relative overflow-hidden bg-neutral-950 text-white"
      aria-labelledby="footer-heading"
    >
      {/* Statyczny gradient – widoczny gdy WebGL nie startuje (reduced motion / brak wsparcia) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90rem_40rem_at_12%_85%,rgba(127,29,29,0.16),transparent_60%),radial-gradient(70rem_50rem_at_85%_35%,rgba(51,65,85,0.2),transparent_65%)]"
      />
      <FooterAurora />

      {/* Marquee z usługami */}
      <div
        aria-hidden="true"
        className="relative z-10 select-none overflow-hidden border-y border-white/10 py-4 md:py-5"
      >
        <div className="footer-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-6 pr-6 text-xs font-light uppercase tracking-[0.3em] text-white/50 md:gap-10 md:pr-10 md:text-sm"
                >
                  {item}
                  <span className="text-[0.6rem] text-red-600">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Główny blok kontaktowy */}
      <div className="relative z-10 mx-auto w-full max-w-[120rem] px-6 pt-16 md:px-12 md:pt-24 xl:px-16">
        <div className="title flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full justify-between font-light text-sm md:w-auto md:justify-start md:space-x-4 md:text-xl xl:text-2xl">
              <div>04</div>
              <div className="uppercase">Kontakt</div>
            </div>
            <Availability className="hidden md:flex" />
          </div>

          <h2
            id="footer-heading"
            className="max-w-5xl uppercase text-5xl leading-[0.95] md:text-7xl xl:text-8xl"
          >
            Nagrajmy coś <span className="text-red-600">razem</span>
          </h2>

          <Availability className="mt-2 md:hidden" />
        </div>

        <div className="mt-12 flex flex-col gap-10 md:mt-20 md:gap-12">
          <ContactLink href="mailto:imdave.kontakt@gmail.com" label="Napisz">
            imdave.kontakt@gmail.com
          </ContactLink>
          <ContactLink href="tel:+48797921666" label="Zadzwoń">
            +48 797 921 666
          </ContactLink>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 md:mt-24 md:grid-cols-3">
          <MetaCell label="Social">
            <a
              href="https://instagram.com/air_d.a.v.e"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram: @air_d.a.v.e (otworzy się w nowej karcie)"
              className={`group inline-flex items-center gap-2 transition-colors hover:text-white ${FOCUS_RING}`}
            >
              @air_d.a.v.e
              <span
                aria-hidden="true"
                className="text-sm text-red-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </MetaCell>

          <MetaCell label="Lokalizacja">Bydgoszcz i okolice</MetaCell>

          <MetaCell label="Czas lokalny">
            <span className="tabular-nums">{time}</span>
          </MetaCell>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pb-4 pt-8">
          <nav aria-label="Nawigacja w stopce" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`text-sm font-light uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white ${FOCUS_RING}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            onClick={scrollToTop}
            aria-label="Wróć na górę strony"
            className={`group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white/70 hover:bg-white/5 md:h-14 md:w-14 ${FOCUS_RING}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-1"
            >
              <path
                d="M9 15V3M9 3L3.5 8.5M9 3l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Wielki napis pożegnalny + podpis */}
      <div className="relative z-10 mt-10 overflow-hidden pt-12 md:mt-16 md:pt-20">
        <img
          src="/podpis/podpis-czerwony-560.webp"
          alt=""
          width="560"
          height="393"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute right-4 top-0 z-20 w-40 -rotate-6 md:right-16 md:w-64"
        />
        <FitText
          text="Do zobaczenia"
          min={16}
          max={450}
          horizontalPadding={8}
          textClassName="big-shoulders inline-block translate-y-[10%] font-black uppercase tracking-tight leading-[0.85] text-white"
        />
      </div>

      {/* Pasek prawny */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[120rem] flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row md:px-12 xl:px-16">
          <small className="text-xs font-light text-white/50">
            © {new Date().getFullYear()} Dawid Chęsiak · Wszelkie prawa zastrzeżone
          </small>
          <small className="hidden text-xs font-light uppercase tracking-[0.3em] text-white/30 md:block">
            Operator drona — Bydgoszcz
          </small>
          <small className="flex items-center gap-2 text-xs text-white/60">
            <span className="text-white/50">
              Realizacja:{" "}
              <a
                href="https://soraweb.pl"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white ${FOCUS_RING}`}
              >
                SoraWeb Studio
              </a>
            </span>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className={`underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white ${FOCUS_RING}`}
            >
              Polityka prywatności
            </button>
          </small>
        </div>
      </div>

      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Polityka prywatności"
      >
        <Suspense fallback={null}>
          <PrivacyPolicy />
        </Suspense>
      </Modal>
    </footer>
  )
}

export default Footer
