-- Web-based E-Channeling System
-- Full database schema: run this once in MySQL Workbench (or `mysql -u root -p < schema.sql`)

CREATE DATABASE IF NOT EXISTS echanneling_db;
USE echanneling_db;

-- =========================================================
-- users / doctors
-- =========================================================
CREATE TABLE users (
  user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  nic VARCHAR(20) UNIQUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('PATIENT','DOCTOR','FRONT_DESK','OPERATIONS_MANAGER','FINANCE_OFFICER') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  doctor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  hospital_branch VARCHAR(100) NOT NULL,
  consultation_fee DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================================================
-- doctor availability & appointments
-- =========================================================
CREATE TABLE doctor_sessions (
  session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  doctor_id BIGINT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('OPEN','BLOCKED','FULL') DEFAULT 'OPEN',
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE appointments (
  appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reference_no VARCHAR(20) UNIQUE NOT NULL,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT NOT NULL,
  session_id BIGINT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TIME NOT NULL,
  status ENUM('BOOKED','CANCELLED','RESCHEDULED','COMPLETED') DEFAULT 'BOOKED',
  cancellation_reason VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(user_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  FOREIGN KEY (session_id) REFERENCES doctor_sessions(session_id)
);

-- =========================================================
-- payments & notifications
-- =========================================================
CREATE TABLE payments (
  payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  appointment_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('CARD','ONLINE_BANKING') NOT NULL,
  status ENUM('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  paid_at DATETIME,
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

CREATE TABLE notifications (
  notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  appointment_id BIGINT,
  type ENUM('BOOKING','PAYMENT','REMINDER','CANCELLATION','RESCHEDULE','SCHEDULE_CHANGE') NOT NULL,
  channel ENUM('EMAIL','SMS') NOT NULL,
  message VARCHAR(255) NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);
