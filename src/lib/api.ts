import { API_URL } from '@/constants/api';

// ─── Services ─────────────────────────────────────────────────────
export const getServices = async () => {
  const res = await fetch(`${API_URL}/api/services`);
  return res.json();
};

// ─── Bookings ─────────────────────────────────────────────────────
export const getBookings = async (uid: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${uid}`);
  return res.json();
};

// ─── Auth ─────────────────────────────────────────────────────────
export const sendOtp = async (phone: string) => {
  const res = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return res.json();
};

export const verifyOtp = async (phone: string, otp: string) => {
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  return res.json();
};

export const registerProfile = async (uid: string, name: string, phone: string, email: string) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, name, phone, email }),
  });
  return res.json();
};

// ─── Payments ─────────────────────────────────────────────────────
export const createOrder = async (amount: number, uid: string, serviceName: string, duration: number) => {
  const res = await fetch(`${API_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, uid, serviceName, duration }),
  });
  return res.json();
};

export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  uid: string
) => {
  const res = await fetch(`${API_URL}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature, uid }),
  });
  return res.json();
};

// ─── Notifications ─────────────────────────────────────────────────
export const registerFcmToken = async (uid: string, fcmToken: string) => {
  const res = await fetch(`${API_URL}/api/notifications/register-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, fcmToken }),
  });
  return res.json();
};

export const sendNotificationToAll = async (title: string, body: string) => {
  const res = await fetch(`${API_URL}/api/notifications/send-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  return res.json();
};

export const sendNotificationTargeted = async (uids: string[], title: string, body: string) => {
  const res = await fetch(`${API_URL}/api/notifications/send-targeted`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uids, title, body }),
  });
  return res.json();
};
