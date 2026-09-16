import { Link } from 'react-router-dom';

const SPECIALTIES = [
  { name: 'Cardiology', icon: '/theme/img/icons/cardiac.svg' },
  { name: 'Eye Care', icon: '/theme/img/icons/eye-care.svg' },
  { name: 'General Medicine', icon: '/theme/img/icons/heart.svg' },
  { name: 'Neurology', icon: '/theme/img/icons/neurology.svg' },
  { name: 'ENT', icon: '/theme/img/icons/ent.svg' },
  { name: 'Orthopedics', icon: '/theme/img/icons/osteoporosis.svg' },
];

export default function HomePage() {
  return (
    <div>
      <section className="page-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1 className="mb-3">Book a doctor's appointment online</h1>
            <p className="text-muted mb-4">
              Search for a doctor, pick an available time slot, and pay securely — all in one
              place.
            </p>
            <Link to="/doctors" className="btn btn-primary rounded-pill px-4">
              Find a Doctor
            </Link>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src="/theme/img/gallery/hero.png"
              alt="Doctor consulting a patient"
              className="img-fluid rounded-4 shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="page-container">
        <h2 className="h4 text-center mb-4">Popular Specialties</h2>
        <div className="row g-3">
          {SPECIALTIES.map((s) => (
            <div className="col-6 col-md-4 col-lg-2" key={s.name}>
              <Link
                to={`/doctors?specialty=${encodeURIComponent(s.name)}`}
                className="card h-100 text-center text-decoration-none py-3"
              >
                <img src={s.icon} alt="" width="48" height="48" className="mx-auto mb-2" />
                <span className="small text-body">{s.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-lg-2">
            <h2 className="h4 mb-3">Trusted doctors, verified availability</h2>
            <p className="text-muted">
              Every time slot you see is live — no calling around, no overbooking. Book, pay, and
              get a confirmation in minutes.
            </p>
          </div>
          <div className="col-lg-6 order-lg-1 text-center">
            <img
              src="/theme/img/gallery/doctors-us.png"
              alt="Our doctors"
              className="img-fluid rounded-4 shadow-sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
