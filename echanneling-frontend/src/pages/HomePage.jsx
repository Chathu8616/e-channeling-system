import { Link } from 'react-router-dom';

const SPECIALTIES = [
  { name: 'Cardiology', icon: '/theme/img/icons/cardiac.svg' },
  { name: 'Eye Care', icon: '/theme/img/icons/eye-care.svg' },
  { name: 'General Medicine', icon: '/theme/img/icons/heart.svg' },
  { name: 'Neurology', icon: '/theme/img/icons/neurology.svg' },
  { name: 'ENT', icon: '/theme/img/icons/ent.svg' },
  { name: 'Orthopedics', icon: '/theme/img/icons/osteoporosis.svg' },
];

const HIGHLIGHTS = [
  { icon: '🔎', label: 'Real-time availability' },
  { icon: '🔒', label: 'Secure online payments' },
  { icon: '⚡', label: 'Instant confirmation' },
  { icon: '🕒', label: 'Book anytime, online' },
];

const STEPS = [
  {
    title: 'Search',
    body: 'Filter by specialty, hospital branch, or doctor name to find the right fit.',
  },
  {
    title: 'Book',
    body: 'Pick a live, open time slot — no calling around, no double-booking.',
  },
  {
    title: 'Pay & go',
    body: 'Pay securely online and get an instant reference number for your visit.',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="hero-band">
        <div className="page-container pb-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow">Trusted online channeling</span>
              <h1 className="mb-3" style={{ fontSize: '2.75rem' }}>
                Book a doctor's appointment online, in minutes
              </h1>
              <p className="text-muted mb-4 fs-5">
                Search available doctors, pick an open time slot, and pay securely — all in one
                place, without a single phone call.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/doctors" className="btn btn-primary rounded-pill px-4">
                  Find a Doctor
                </Link>
                <Link to="/register" className="btn btn-outline-primary rounded-pill px-4">
                  Create free account
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="/theme/img/gallery/hero.png"
                alt="Doctor consulting a patient"
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>

          <div className="row mt-5 pt-4 gy-4">
            {HIGHLIGHTS.map((h) => (
              <div className="col-6 col-md-3 stat-tile" key={h.label}>
                <div className="stat-number" style={{ fontSize: '1.6rem' }}>{h.icon}</div>
                <div className="stat-label">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt py-5">
        <div className="page-container py-0">
          <h2 className="h4 text-center mb-4">Popular Specialties</h2>
          <div className="row g-3">
            {SPECIALTIES.map((s) => (
              <div className="col-6 col-md-4 col-lg-2" key={s.name}>
                <Link
                  to={`/doctors?specialty=${encodeURIComponent(s.name)}`}
                  className="card card-hover h-100 text-center text-decoration-none py-4 px-2"
                >
                  <img src={s.icon} alt="" width="40" height="40" className="mx-auto mb-2" />
                  <span className="small fw-semibold text-body">{s.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-lg-2">
            <span className="eyebrow">How it works</span>
            <h2 className="h3 mb-4">Three steps to your next appointment</h2>
            <div className="d-flex flex-column gap-4">
              {STEPS.map((step, i) => (
                <div className="d-flex gap-3" key={step.title}>
                  <div className="icon-circle flex-shrink-0" style={{ margin: 0 }}>
                    <span className="fw-bold" style={{ color: 'var(--brand)' }}>
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="h6 mb-1">{step.title}</h3>
                    <p className="text-muted mb-0">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6 order-lg-1 text-center">
            <img
              src="/theme/img/gallery/doctors-us.png"
              alt="Our doctors"
              className="img-fluid rounded-4 shadow-md"
            />
          </div>
        </div>
      </section>

      <section className="page-container pt-0">
        <div className="cta-band text-center">
          <h2 className="h3 mb-3">Ready to see a doctor?</h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Create a free account and book your first appointment in minutes.
          </p>
          <Link to="/register" className="btn btn-light rounded-pill px-4 fw-semibold">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
