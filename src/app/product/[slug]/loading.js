export default function ProductLoading() {
  return (
    <main aria-busy="true" aria-label="পণ্যের বিস্তারিত লোড হচ্ছে" className="shell product-detail-main">
      <p className="sr-only" role="status">পণ্যের বিস্তারিত লোড হচ্ছে।</p>

      <div aria-hidden="true" className="loading-breadcrumbs">
        <span className="loading-shape loading-line loading-crumb" />
        <span className="loading-shape loading-line loading-crumb-short" />
        <span className="loading-shape loading-line loading-crumb" />
      </div>

      <section aria-hidden="true" className="product-summary-card">
        <span className="loading-shape product-summary-icon" />
        <div className="loading-summary-copy">
          <span className="loading-shape loading-line loading-summary-title" />
          <span className="loading-shape loading-line loading-line-short" />
          <span className="loading-shape loading-line loading-summary-movement" />
        </div>
        <div className="loading-shape loading-price-box" />
      </section>

      <section aria-hidden="true" className="price-overview-card">
        <span className="loading-shape loading-line loading-section-title" />
        <div className="price-stat-grid">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="loading-shape loading-stat-box" key={index} />
          ))}
        </div>
        <span className="loading-shape loading-line loading-section-title loading-history-title" />
        <div className="history-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="loading-shape loading-history-box" key={index} />
          ))}
        </div>
        <div className="loading-shape loading-table-box" />
      </section>
    </main>
  );
}
