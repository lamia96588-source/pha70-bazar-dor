export default function CategoryLoading() {
  return (
    <main aria-busy="true" aria-label="বিভাগের পণ্য লোড হচ্ছে" className="shell category-main">
      <p className="sr-only" role="status">বিভাগের পণ্য লোড হচ্ছে।</p>
      <section aria-hidden="true" className="category-intro-card category-loading-card">
        <span className="loading-shape category-intro-icon" />
        <div className="category-loading-copy">
          <span className="loading-shape loading-line loading-line-title" />
          <span className="loading-shape loading-line loading-line-short" />
        </div>
      </section>

      <section aria-hidden="true" className="category-toolbar">
        <span className="loading-shape loading-line loading-sort" />
      </section>

      <div aria-hidden="true" className="loading-grid category-loading-grid">
        {Array.from({ length: 6 }, (_, index) => (
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
    </main>
  );
}
