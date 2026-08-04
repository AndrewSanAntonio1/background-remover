import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { IconDownload, IconSparkles, IconUpload } from '../components/Icons'
import './HowItWorks.css'

const STEPS = [
  {
    icon: IconUpload,
    title: 'Upload your image',
    body: 'Drag a file onto the upload area or pick one from your device. PNG, JPG, and WEBP up to 10 MB.',
  },
  {
    icon: IconSparkles,
    title: 'Let it do the work',
    body: 'The subject is detected and separated from the background automatically — no selecting or masking by hand.',
  },
  {
    icon: IconDownload,
    title: 'Download your PNG',
    body: 'Preview the transparent result and download it at full resolution, ready to drop into any design.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps, about ten seconds"
          subtitle="No account, no tutorial, and no design experience required."
        />

        <ol className="steps">
          {STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 110}
                className="step"
              >
                <div className="step__marker">
                  <span className="step__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="step__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                </div>

                <div className="step__content">
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__body">{step.body}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>

        <Reveal className="how__cta" delay={120}>
          <p className="how__cta-text">Ready to try it on your own image?</p>
          <Button to="/remove-background" size="lg" responsiveBlock>
            Upload an image
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
