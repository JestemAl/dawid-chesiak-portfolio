import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="text-neutral-700 space-y-8 text-sm md:text-base font-light leading-relaxed">

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">1. Administrator danych</h3>
        <p>
          Administratorem danych osobowych jest Dawid Chęsiak, operator drona działający
          na terenie Bydgoszczy i okolic. Kontakt:{' '}
          <a href="mailto:imdave.kontakt@gmail.com" className="underline underline-offset-4">
            imdave.kontakt@gmail.com
          </a>
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">2. Jakie dane są przetwarzane</h3>
        <p>
          Przetwarzam wyłącznie dane, które sam/a mi przekazujesz — w szczególności
          imię i nazwisko, adres e-mail oraz numer telefonu podane w wiadomości
          kontaktowej.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">3. Cel i podstawa przetwarzania</h3>
        <p>
          Dane są przetwarzane wyłącznie w celu odpowiedzi na zapytanie ofertowe lub
          kontaktowe (art. 6 ust. 1 lit. b i f RODO — niezbędność do podjęcia
          działań przed zawarciem umowy oraz prawnie uzasadniony interes administratora).
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">4. Czas przechowywania</h3>
        <p>
          Dane przechowuję przez czas niezbędny do obsługi zapytania, a następnie
          przez okres wymagany przepisami prawa (np. przepisy podatkowe) lub do czasu
          wniesienia sprzeciwu.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">5. Twoje prawa</h3>
        <p>Masz prawo do:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>dostępu do swoich danych,</li>
          <li>sprostowania danych,</li>
          <li>usunięcia danych („prawo do bycia zapomnianym"),</li>
          <li>ograniczenia przetwarzania,</li>
          <li>przenoszenia danych,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania,</li>
          <li>wniesienia skargi do Prezesa UODO (uodo.gov.pl).</li>
        </ul>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">6. Udostępnianie danych</h3>
        <p>
          Dane nie są sprzedawane ani udostępniane osobom trzecim w celach marketingowych.
          Mogą być przekazywane wyłącznie podmiotom świadczącym usługi niezbędne do
          obsługi zapytania (np. dostawcy poczty e-mail) na podstawie stosownych umów
          powierzenia przetwarzania.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">7. Pliki cookies</h3>
        <p>
          Strona nie wykorzystuje własnych plików cookies do śledzenia użytkowników.
          Czcionki Google Fonts są ładowane z serwerów Google — Google może zbierać
          dane techniczne zgodnie z własną polityką prywatności dostępną na{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            policies.google.com/privacy
          </a>
          .
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">8. Kontakt</h3>
        <p>
          W sprawach dotyczących ochrony danych osobowych skontaktuj się pod adresem:{' '}
          <a href="mailto:imdave.kontakt@gmail.com" className="underline underline-offset-4">
            imdave.kontakt@gmail.com
          </a>
        </p>
      </div>

    </div>
  )
}

export default PrivacyPolicy
