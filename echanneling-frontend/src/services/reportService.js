import api from './api';

export const getAppointmentsReport = (from, to) =>
  api.get('/reports/appointments', { params: { from, to } });

export const getPaymentsReport = (from, to) =>
  api.get('/reports/payments', { params: { from, to } });

export const getDailySummary = (date) => api.get('/reports/summary/daily', { params: { date } });

async function downloadFile(path, from, to, filename) {
  const res = await api.get(path, { params: { from, to }, responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const exportAppointmentsExcel = (from, to) =>
  downloadFile('/reports/appointments/export', from, to, 'appointments-report.xlsx');

export const exportPaymentsExcel = (from, to) =>
  downloadFile('/reports/payments/export', from, to, 'payments-report.xlsx');

export const exportAppointmentsPdf = (from, to) =>
  downloadFile('/reports/appointments/export/pdf', from, to, 'appointments-report.pdf');

export const exportPaymentsPdf = (from, to) =>
  downloadFile('/reports/payments/export/pdf', from, to, 'payments-report.pdf');
