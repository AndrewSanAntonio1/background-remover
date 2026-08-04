import Button from '../components/Button'
import Reveal from '../components/Reveal'
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconSparkles,
} from '../components/Icons'
import './Hero.css'

const TRUST_POINTS = [
  'No signup required',
  'Transparent PNG output',
  'Free to try',
]

export default function Hero() {
  return (
    <section className="hero">
      <span className="glow hero__glow-1" aria-hidden="true" />
      <span className="glow hero__glow-2" aria-hidden="true" />

      <div className="container hero__inner">
        <Reveal className="hero__copy">
          <span className="eyebrow">
            <IconSparkles size={14} />
            AI background removal
          </span>

          <h1 className="hero__title">
            Remove image backgrounds in{' '}
            <span className="text-gradient">seconds</span>
          </h1>

          <p className="hero__subtitle">
            Upload a photo and get a clean, transparent PNG — no masking, no
            lasso tool, no design software. Built for product shots, portraits,
            and everything in between.
          </p>

          <div className="hero__actions">
            <Button
              to="/remove-background"
              size="lg"
              responsiveBlock
              icon={<IconArrowRight size={18} />}
              iconPosition="right"
            >
              Remove a background
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg" responsiveBlock>
              See how it works
            </Button>
          </div>

          <ul className="hero__trust">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="hero__trust-item">
                <IconCheck size={15} />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="hero__visual" delay={140}>
          <div className="hero__compare">
            <div className="hero__pane hero__pane--before">
              <span className="hero__pane-tag">Before</span>
              <div className="hero__subject" aria-hidden="true">
                <div className="hero__subject-shape" />
                <div className="hero__subject-head" />
              </div>
            </div>

            <div className="hero__pane hero__pane--after checkerboard">
              <span className="hero__pane-tag">After</span>
              <div className="hero__subject" aria-hidden="true">
                <div className="hero__subject-shape" />
                <div className="hero__subject-head" />
              </div>
            </div>
          </div>

          <div className="hero__badge hero__badge--top animate-float">
            <IconBolt size={16} />
            Done in ~3 seconds
          </div>

          <div className="hero__badge hero__badge--bottom">
            <IconCheck size={16} />
            Edge-accurate cutouts
          </div>
        </Reveal>
      </div>
    </section>
  )
}
