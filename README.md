# Web-based E-Channeling System

SE2030 - Software Engineering

## Technology Stack

- React (Vite), styled with assets from the `live-doc-v1.0.0` Bootstrap theme
- Spring Boot 4 (Java 21)
- MySQL
- Git & GitHub

## Group ID

MLB-B1G2-02

## Project layout

- `db/schema.sql` — full MySQL schema (run this once before starting the backend)
- `echanneling-backend/` — Spring Boot REST API
- `echanneling-frontend/` — React app (Vite)
- `live-doc-v1.0.0/` — source of the Bootstrap theme; only its compiled CSS/JS assets are used,
  already copied into `echanneling-frontend/public/theme/`

## Running it locally

### 1. Database

Import the schema once:

```
mysql -u root -p < db/schema.sql
```

Or open `db/schema.sql` in MySQL Workbench and run it.

By default the backend connects to `jdbc:mysql://localhost:3306/echanneling_db` with user `root`.
Update `echanneling-backend/src/main/resources/application.properties` if your local MySQL
credentials differ.

### 2. Backend

```
cd echanneling-backend
./mvnw spring-boot:run
```

Starts the API on `http://localhost:8080`. With `spring.jpa.hibernate.ddl-auto=update`, Hibernate
will also keep the tables in sync with the entity classes.

### 3. Frontend

```
cd echanneling-frontend
npm install
npm run dev
```

Starts the React app on `http://localhost:5173`.

### 4. Try it out

On every backend startup, `DataSeeder.java` makes sure three demo accounts exist (creating
whichever ones are still missing, without touching any other data), so you don't need to write any
SQL by hand to try the app out:

| Role | Email | Password |
|---|---|---|
| Patient | `patient@example.com` | `Patient@123` |
| Doctor (Cardiology, with a few open sessions already scheduled) | `doctor@example.com` | `Doctor@123` |
| Operations Manager | `admin@example.com` | `Admin@123` |

The login page also has one-click buttons to fill these in. Log in as the patient, search for
"Cardiology", book one of the seeded open slots, pay for it, and check My Appointments / the
notification bell. Log in as the doctor or operations manager to try the Schedule and Reports
pages. You can of course also register your own new patient account instead.

## Modules

Each of the 6 functional areas below was built on its own branch and merged into `main`:

| Branch | Covers |
|---|---|
| `auth` | Patient registration & login |
| `doctor-search` | Doctor search & availability viewing |
| `booking` | Appointment booking, cancellation & rescheduling |
| `payments` | Online payment management (simulated gateway) |
| `notifications` | Notification system (in-app + optional email) |
| `admin-reports` | Doctor schedule management & administrative reporting (Excel/PDF export) |

## Notes on what's simplified for this student project

- **Payments** use a simulated gateway (succeeds 9 times out of 10) rather than a real payment
  provider, per the project brief.
- **Email notifications** are off by default (`app.notifications.email-enabled=false` in
  `application.properties`). Every notification is always recorded in the `notifications` table;
  turn the flag on and fill in `spring.mail.*` (e.g. a Gmail app password) to actually send email.
  SMS is not integrated — notifications are logged/stored instead, as the brief suggests.
- **Reports** export to both Excel (`.xlsx`, via Apache POI) and PDF (via OpenPDF).
