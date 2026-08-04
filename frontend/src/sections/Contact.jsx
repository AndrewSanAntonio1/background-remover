import { useState } from 'react'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { IconChat, IconGlobe, IconMail } from '../components/Icons'
import { CONTACT_EMAIL, sendContactMessage } from '../services/api'
import './Contact.css'

const CHANNELS = [
  {
    icon: IconMail,
    label: 'Email us',
    value: CONTACT_EMAIL,
    detail: 'We reply within one business day.',
  },
  {
    icon: IconChat,
    label: 'Support',
    value: CONTACT_EMAIL,
    detail: 'Bug reports and account questions.',
  },
  {
    icon: IconGlobe,
    label: 'Partnerships',
    value: CONTACT_EMAIL,
    detail: 'API access, volume, and integrations.',
  },
]

const EMPTY_FORM = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [submitError, setSubmitError] = useState('')

  const updateField = (field) => (event) => {
    const { value } = event.target
    setForm((current) => ({ ...current, [field]: value }))
    // Clear that field's error as soon as the user starts fixing it.
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validate = () => {
    const next = {}

    if (!form.name.trim()) next.name = 'Please enter your name.'

    if (!form.email.trim()) {
      next.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = 'That email address does not look right.'
    }

    if (!form.message.trim()) {
      next.message = 'Please tell us what you need.'
    } else if (form.message.trim().length < 10) {
      next.message = 'A little more detail would help — 10 characters minimum.'
    }

    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('sending')

    try {
      await sendContactMessage(form)
      setStatus('sent')
      setForm(EMPTY_FORM)
    } catch (error) {
      setStatus('error')
      setSubmitError(
        error?.message || 'We could not send your message. Please try again.'
      )
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHeader
          eyebrow="Contact"
          title="Talk to us"
          subtitle="Questions about the tool, bulk processing, or API access — we read everything that comes in."
        />

        <div className="contact__grid">
          <Reveal className="contact__channels">
            {CHANNELS.map((channel) => {
              const Icon = channel.icon

              return (
                <div key={channel.label} className="contact-channel">
                  <span className="contact-channel__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="contact-channel__label">{channel.label}</h3>
                    <a
                      className="contact-channel__value"
                      href={`mailto:${channel.value}`}
                    >
                      {channel.value}
                    </a>
                    <p className="contact-channel__detail">{channel.detail}</p>
                  </div>
                </div>
              )
            })}
          </Reveal>

          <Reveal className="card contact__form-card" delay={120}>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="field__label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  className={`field__input ${errors.name ? 'field__input--error' : ''}`}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  value={form.name}
                  onChange={updateField('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name && (
                  <span className="field__error" id="contact-name-error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  className={`field__input ${errors.email ? 'field__input--error' : ''}`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={updateField('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'contact-email-error' : undefined
                  }
                />
                {errors.email && (
                  <span className="field__error" id="contact-email-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className={`field__input field__textarea ${
                    errors.message ? 'field__input--error' : ''
                  }`}
                  name="message"
                  rows={5}
                  placeholder="Tell us what you're working on…"
                  value={form.message}
                  onChange={updateField('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? 'contact-message-error' : undefined
                  }
                />
                {errors.message && (
                  <span className="field__error" id="contact-message-error">
                    {errors.message}
                  </span>
                )}
              </div>

              {status === 'sent' && (
                <Alert variant="success" title="Draft opened">
                  Your email app should have opened with this message ready to
                  go — hit send there and it reaches us. If nothing opened,
                  email {CONTACT_EMAIL} directly.
                </Alert>
              )}

              {status === 'error' && submitError && (
                <Alert variant="error" title="Send us an email directly">
                  Please email us at sgandrew290@gmail.com for inquiries.
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                block
                loading={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </Button>

              <p className="contact-form__note">
                Have questions? Email us directly at <a href="mailto:sgandrew290@gmail.com" style={{color: 'var(--text-accent)', textDecoration: 'underline'}}>sgandrew290@gmail.com</a>
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
