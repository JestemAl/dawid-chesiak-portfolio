import React, { useState } from 'react'
import FitText from '../text/FitText'
import Modal from '../ui/Modal'
import PrivacyPolicy from './PrivacyPolicy'

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <footer className="bg-white relative" aria-labelledby="footer-heading">

          <img
            src="/podpis/podpis-czerwony.webp"
            alt="Podpis"
            className="absolute bottom-24 md:bottom-24 right-0 z-0 w-[260px] md:w-[480px]  pointer-events-none "
          />

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <h2 id="footer-heading" className="sr-only">
          Stopka
        </h2>

        {/* Contact / Links */}
        <div className="grid gap-12  border-t border-neutral-100 pt-24 py-12 sm:grid-cols-2 md:grid-cols-3">
          {/* Kontakt */}
          <address className="not-italic">
            <div className="flex flex-col items-start">
              <h3 className="text-3xl md:text-3xl tracking-wide font-medium ">
                Kontakt
              </h3>
              <div className="mt-3 h-px w-1/2 sm:w-28 bg-neutral-200" />
            </div>

            <dl className="mt-6 space-y-5 text-neutral-700">
              <div>
                <dt className="text-xs font-semibold tracking-widest text-neutral-900 uppercase">
                  Telefon
                </dt>
                <dd className="mt-2">
                  <a
                    href="tel:+48797921666"
                    className="inline-flex text-xl md:text-2xl font-light tracking-tight underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 hover:text-neutral-900 transition
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded"
                    aria-label="Zadzwoń: +48 797 921 666"
                  >
                    +48 797 921 666
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold tracking-widest text-neutral-900 uppercase">
                  E-mail
                </dt>
                <dd className="mt-2">
                  <a
                    href="mailto:imdave.kontakt@gmail.com"
                    className="inline-flex break-all text-xl md:text-2xl font-light tracking-tight underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 hover:text-neutral-900 transition
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded"
                  >
                    imdave.kontakt@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </address>

          {/* Social */}
          <div className=" ">
            <div className="flex flex-col items-start">
              <h3 className="text-3xl md:text-3xl tracking-wide font-medium tracking-tight">
                Sociale
              </h3>
              <div className="mt-3 h-px w-1/2 sm:w-28 bg-neutral-200" />
            </div>

            <ul className="mt-6 space-y-3 text-neutral-700">
              <li>
                <a
                  href="https://instagram.com/air_d.a.v.e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-xl md:text-2xl font-light tracking-tight underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 hover:text-neutral-900 transition
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded"
                  aria-label="Instagram: @air_d.a.v.e (otworzy się w nowej karcie)"
                >
                  @air_d.a.v.e
                </a>
              </li>
            </ul>
          </div>

          {/* Nawigacja */}
          <nav aria-label="Skróty w stopce" className="">
            <div className="flex flex-col items-start">
              <h3 className="text-3xl md:text-3xl tracking-wide font-medium tracking-tight">
                Nawigacja
              </h3>
              <div className="mt-3 h-px w-1/2 sm:w-28 bg-neutral-200" />
            </div>

            <ul className="mt-6 space-y-3 text-neutral-700">
              {[
                { href: '#oferta', label: 'Oferta' },
                { href: '#portfolio', label: 'Portfolio' },
                { href: '#kontakt', label: 'Kontakt' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex text-xl md:text-2xl font-light tracking-tight underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 hover:text-neutral-900 transition
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Big wordmark / goodbye */}


      </div>
            <FitText
              text="Do zobaczenia"
              min={16}
              max={450}
              horizontalPadding={8}
              textClassName="font-black tracking-tight uppercase leading-[0.85] big-shoulders mt-16 md:mt-24"
            />

      {/* Subfooter */}
      <div className="bg-neutral-950">
        <div className="mx-auto w-full px-4  py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <small className="text-xs text-white/90">
            © {new Date().getFullYear()} Dawid Chęsiak. Wszelkie prawa zastrzeżone.
          </small>
          <small className="text-xs text-white/70">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="underline underline-offset-4 decoration-white/30 hover:decoration-white hover:text-white transition
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded"
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
        <PrivacyPolicy />
      </Modal>

    </footer>
  )
}

export default Footer
