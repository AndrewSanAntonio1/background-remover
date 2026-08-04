import Contact from '../sections/Contact'
import Faq from '../sections/Faq'
import Features from '../sections/Features'
import Hero from '../sections/Hero'
import HowItWorks from '../sections/HowItWorks'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Faq />
      <hr className="hairline" />
      <Contact />
    </>
  )
}
