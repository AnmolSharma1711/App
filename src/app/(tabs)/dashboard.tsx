import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardScreen() {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(1); // hours
  const [isBooking, setIsBooking] = useState(false);

  const services = [
    { id: 1, name: 'Doctor Consultation', basePrice: 500, type: 'per_consult' },
    { id: 2, name: 'Nursing Care', basePrice: 150, type: 'per_hour' },
    { id: 3, name: 'Physiotherapy', basePrice: 800, type: 'per_session' },
  ];

  const calculatePrice = (service: typeof services[0]) => {
    if (service.type === 'per_hour') {
      return service.basePrice * selectedDuration;
    }
    return service.basePrice;
  };

  const handleBook = async (service: typeof services[0]) => {
    setIsBooking(true);
    const amount = calculatePrice(service);
    try {
      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (data.success) {
        // Here we would launch Razorpay Checkout using react-native-razorpay
        // Since we are building the UI, we'll simulate the payment completion
        Alert.alert('Booking Locked', `Order created for ₹${amount}. Proceeding to payment...`);
      } else {
        Alert.alert('Error', 'Could not create order');
      }
    } catch (e) {
      Alert.alert('Error', 'Payment backend not reachable');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Available Services</Text>
      
      {services.map(service => (
        <Card key={service.id} style={styles.card}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.type === 'per_hour' && selectedServiceId === service.id ? (
              <View style={styles.durationControl}>
                <Button title="-" onPress={() => setSelectedDuration(Math.max(1, selectedDuration - 1))} size="small" variant="outline" />
                <Text style={styles.durationText}>{selectedDuration} hr</Text>
                <Button title="+" onPress={() => setSelectedDuration(selectedDuration + 1)} size="small" variant="outline" />
              </View>
            ) : (
              <Text style={styles.serviceDetails}>
                {service.type === 'per_hour' ? 'Flexible Duration' : 'Fixed Price'}
              </Text>
            )}
          </View>
          <View style={styles.actionContainer}>
            <Text style={styles.price}>
              ₹{selectedServiceId === service.id ? calculatePrice(service) : service.basePrice}
            </Text>
            {selectedServiceId === service.id ? (
              <Button 
                title="Pay & Lock" 
                size="small" 
                onPress={() => handleBook(service)}
                isLoading={isBooking}
              />
            ) : (
              <Button 
                title="Select" 
                size="small" 
                variant="outline"
                onPress={() => {
                  setSelectedServiceId(service.id);
                  setSelectedDuration(1);
                }} 
              />
            )}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  header: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceInfo: { flex: 1, paddingRight: 16 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 8 },
  serviceDetails: { fontSize: 14, color: '#64748B' },
  durationControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  durationText: { fontSize: 16, fontWeight: '600' },
  actionContainer: { alignItems: 'flex-end', gap: 8 },
  price: { color: '#0F766E', fontWeight: '700', fontSize: 18 },
});
