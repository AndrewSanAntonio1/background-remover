import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import {
  IconBolt,
  IconCrop,
  IconGlobe,
  IconLayers,
  IconShield,
  IconWand,
} from '../components/Icons'
import './Features.css'

const FEATURES = [
  {
    icon: IconWand,
    title: 'Edge-accurate cutouts',
    body: 'Hair, fur, and soft edges stay intact. The matte is computed per pixel, not traced from a rough outline.',
  },
  {
    icon: IconBolt,
    title: 'Results in seconds',
    body: 'Upload and download in a single visit. No queues, no email-me-when-ready, no desktop software.',
  },
  {
    icon: IconLayers,
    title: 'True transparent PNG',
    body: 'Get a real alpha channel you can drop straight onto any background, mockup, or marketplace listing.',
  },
  {
    icon: IconCrop,
    title: 'Full resolution preserved',
    body: 'Your cutout comes back at the same dimensions you uploaded. Nothing is downscaled or watermarked.',
  },
  {
    icon: IconShield,
    title: 'Private by default',
    body: 'Images are processed for your request and then discarded. Nothing is used for training or shared.',
  },
  {
    icon: IconGlobe,
    title: 'Works everywhere',
    body: 'Runs in the browser on desktop, tablet, and phone. Nothing to install and no plugins required.',
  },
]

export default function Features() {
  return (
    <section className="section section--alt" id="features">
      <div className="container">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need for a clean cutout"
          subtitle="Purpose-built for the one job most editors make hardest: separating a subject from its background."
        />

        <ul className="features__grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Reveal
                as="li"
                key={feature.title}
                delay={index * 70}
                className="card card--hover feature-card"
              >
                <span className="feature-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__body">{feature.body}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
