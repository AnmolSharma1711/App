import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RazorpayWebView } from '@/components/ui/RazorpayWebView';
import { getServices, createOrder, verifyPayment } from '@/lib/api';
import { getCurrentUid } from '@/lib/authHelper';

interface Service {
  id: string;
  name: string;
  basePrice: number;
  type: 'per_hour' | 'per_consult' | 'per_session';
  description: string;
}

interface PaymentSession {
  orderId: string;
  amount: number;
  service: Service;
}

export default function DashboardScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      if (data.success) setServices(data.services);
    } catch {
      Alert.alert('Error', 'Failed to load services. Is the backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const calculatePrice = (service: Service) => {
    if (service.type === 'per_hour') return service.basePrice * selectedDuration;
    return service.basePrice;
  };

  const handleBook = async (service: Service) => {
    const uid = getCurrentUid();
    if (!uid) {
      Alert.alert('Not Logged In', 'Please log in to book a service.');
      return;
    }
    setIsBooking(true);
    const amount = calculatePrice(service);

    try {
      const data = await createOrder(amount, uid, service.name, selectedDuration);
      if (!data.success || !data.order) {
        Alert.alert('Error', data.error || 'Could not create order');
        return;
      }
      setPaymentSession({ orderId: data.order.id, amount: data.order.amount, service });
    } catch {
      Alert.alert('Error', 'Network error. Make sure backend is running.');
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setPaymentSession(null);
    const uid = getCurrentUid();
    if (!uid) return;

    try {
      const result = await verifyPayment(
        paymentData.razorpay_order_id,
        paymentData.razorpay_payment_id,
        paymentData.razorpay_signature,
        uid
      );
      if (result.success) {
        Alert.alert('✅ Booking Confirmed!', 'Your service has been booked. Our team will contact you shortly.');
        setSelectedServiceId(null);
      } else {
        Alert.alert('Verification Failed', 'Contact support with your payment ID: ' + paymentData.razorpay_payment_id);
      }
    } catch {
      Alert.alert('Error', 'Payment done but verification failed. Contact support.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F766E" />
        <Text style={styles.loadingText}>Loading Services...</Text>
      </View>
    );
  }

  const uid = getCurrentUid();

  return (
    <>
      {paymentSession && (
        <RazorpayWebView
          orderId={paymentSession.orderId}
          amount={paymentSession.amount}
          keyId="rzp_test_T0Dif47kIO69P8"
          serviceName={paymentSession.service.name}
          phone={uid ? '+' + uid : ''}
          onSuccess={handlePaymentSuccess}
          onDismiss={() => setPaymentSession(null)}
        />
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchServices(); }}
            tintColor="#0F766E"
          />
        }
      >
        <Text style={styles.header}>Available Services</Text>
        <Text style={styles.subHeader}>Tap a service to select and book</Text>

        {services.map(service => (
          <Card key={service.id} style={[styles.card, selectedServiceId === service.id && styles.cardSelected]}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>

              {service.type === 'per_hour' && selectedServiceId === service.id ? (
                <View style={styles.durationRow}>
                  <Text style={styles.durationLabel}>Duration:</Text>
                  <View style={styles.durationControl}>
                    <Button title="−" onPress={() => setSelectedDuration(Math.max(1, selectedDuration - 1))} size="small" variant="outline" />
                    <Text style={styles.durationText}>{selectedDuration} hr</Text>
                    <Button title="+" onPress={() => setSelectedDuration(selectedDuration + 1)} size="small" variant="outline" />
                  </View>
                </View>
              ) : null}

              <Text style={styles.priceType}>
                {service.type === 'per_hour' ? `₹${service.basePrice}/hr` : service.type === 'per_session' ? `₹${service.basePrice}/session` : `₹${service.basePrice}`}
              </Text>
            </View>

            <View style={styles.actionColumn}>
              <Text style={styles.totalPrice}>
                ₹{selectedServiceId === service.id ? calculatePrice(service) : service.basePrice}
              </Text>
              {selectedServiceId === service.id ? (
                <>
                  <Button title="Pay & Lock 🔒" size="small" onPress={() => handleBook(service)} isLoading={isBooking} />
                  <View style={{ marginTop: 6 }}>
                    <Button title="Cancel" size="small" variant="outline" onPress={() => setSelectedServiceId(null)} />
                  </View>
                </>
              ) : (
                <Button
                  title="Select"
                  size="small"
                  variant="outline"
                  onPress={() => { setSelectedServiceId(service.id); setSelectedDuration(1); }}
                />
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  header: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subHeader: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  card: { marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between' },
  cardSelected: { borderWidth: 2, borderColor: '#0F766E' },
  serviceInfo: { flex: 1, paddingRight: 12 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  serviceDescription: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  priceType: { fontSize: 13, color: '#0F766E', fontWeight: '600' },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  durationLabel: { fontSize: 13, color: '#334155', fontWeight: '500' },
  durationControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  durationText: { fontSize: 15, fontWeight: '700', color: '#0F172A', minWidth: 40, textAlign: 'center' },
  actionColumn: { alignItems: 'flex-end', justifyContent: 'center', gap: 8, minWidth: 90 },
  totalPrice: { fontSize: 20, fontWeight: '800', color: '#0F766E', marginBottom: 4 },
});
