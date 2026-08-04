import { useState } from 'react'
import FaqItem from '../components/FaqItem'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import './Faq.css'

const FAQS = [
  {
    question: 'What image formats can I upload?',
    answer:
      'PNG, JPG, and WEBP files up to 10 MB. The result always comes back as a PNG, since that is the format that carries a transparent alpha channel.',
  },
  {
    question: 'Do I need an account to use it?',
    answer:
      'No. Open the tool, upload an image, and download the result. There is no signup wall and no credit card prompt before you see what you get.',
  },
  {
    question: 'What happens to my images?',
    answer:
      'Images are processed to fulfil your request and then discarded. They are not stored long term, shared with third parties, or used to train models.',
  },
  {
    question: 'Will the resolution be reduced?',
    answer:
      'No. Your cutout is returned at the same dimensions you uploaded, with no watermark applied to the output.',
  },
  {
    question: 'How well does it handle hair and fine detail?',
    answer:
      'Soft edges like hair, fur, and semi-transparent fabric are handled with a per-pixel matte rather than a hard outline, so they keep their detail against a new background.',
  },
  {
    question: 'Can I use the results commercially?',
    answer:
      'Yes. You keep all rights to the images you upload and to the cutouts you download — including for product listings, ads, and client work.',
  },
  {
    question: 'Is there an API?',
    answer:
      'A REST endpoint is on the roadmap for batch and automated workflows. Get in touch through the contact form below and we will let you know when access opens.',
  },
]

export default function Faq() {
  // Single-open accordion. First item starts open so the section isn't a
  // wall of identical closed rows.
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section section--alt" id="faq">
      <div className="container">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Everything people usually ask before their first upload."
        />

        <Reveal className="faq__list">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.question}
              id={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? -1 : index))
              }
            />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
