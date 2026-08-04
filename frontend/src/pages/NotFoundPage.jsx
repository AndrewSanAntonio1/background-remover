import Button from '../components/Button'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">This page doesn’t exist</h1>
        <p className="notfound__body">
          The link may be out of date. Head back to the homepage, or jump
          straight into the background remover.
        </p>
        <div className="notfound__actions">
          <Button to="/" size="lg" responsiveBlock>
            Back to home
          </Button>
          <Button
            to="/remove-background"
            variant="secondary"
            size="lg"
            responsiveBlock
          >
            Remove a background
          </Button>
        </div>
      </div>
    </section>
  )
}
