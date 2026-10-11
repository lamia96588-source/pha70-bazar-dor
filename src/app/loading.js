function LoadingProductGrid({ count }) {
  return (
    <div aria-hidden="true" className="loading-grid">
      {Array.from({ length: count }, (_, index) => (
        <div className="loading-card" key={index}>
          <div className="loading-card-heading">
            <span className="loading-shape loading-icon" />
            <span className="loading-copy-lines">
              <span className="loading-shape loading-line loading-line-title" />
              <span className="loading-shape loading-line loading-line-short" />
            </span>
          </div>
          <span className="loading-shape loading-line loading-line-price" />
        </div>
      ))}
    </div>
  );
}

function LoadingSection({ count }) {
  return (
    <section aria-hidden="true" className="loading-section">
      <span className="loading-shape loading-line loading-section-title" />
      <LoadingProductGrid count={count} />
    </section>
  );
}

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="বাজারদর লোড হচ্ছে" className="shell loading-main">
      <p className="sr-only" role="status">পণ্য ও বাজারদর লোড হচ্ছে।</p>

      <section aria-hidden="true" className="loading-hero">
        <div className="loading-hero-copy">
          <span className="loading-shape loading-line loading-date" />
          <span className="loading-shape loading-line loading-hero-title" />
          <span className="loading-shape loading-line loading-hero-description" />
          <span className="loading-shape loading-line loading-hero-description loading-hero-description-short" />
          <span className="loading-shape loading-button" />
        </div>
        <span className="loading-shape loading-basket" />
      </section>

      <LoadingSection count={6} />
      <LoadingSection count={6} />
      <LoadingSection count={9} />
    </main>
  );
}
