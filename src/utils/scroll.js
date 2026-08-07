import { ScrollSmoother } from 'gsap/ScrollSmoother'

// Nawigacja kotwicowa zgodna ze ScrollSmootherem (natywny scrollIntoView
// walczyłby z transformem smoothera).

export const scrollToTop = () => {
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(0, true)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const scrollToSection = (e, href) => {
  e.preventDefault()
  if (href === '#start') return scrollToTop()
  const target = document.querySelector(href)
  if (!target) return
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(target, true, 'top top')
  else target.scrollIntoView({ behavior: 'smooth' })
}
