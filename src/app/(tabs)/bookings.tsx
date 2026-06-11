import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { getBookings } from '@/lib/api';
import { getCurrentUid } from '@/lib/authHelper';

interface Booking {
  id: string;
  serviceName: string;
  amount: number;
  status: 'pending_payment' | 'confirmed' | 'cancelled';
  duration?: number;
  createdAt?: any;
}

const statusColors: Record<string, string> = {
  confirmed: '#0F766E',
  pending_payment: '#D97706',
  cancelled: '#EF4444',
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmed ✓',
  pending_payment: 'Payment Pending',
  cancelled: 'Cancelled',
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    const uid = getCurrentUid();
    if (!uid) { setLoading(false); return; }
    try {
      const data = await getBookings(uid);
      if (data.success) setBookings(data.bookings);
    } catch {
      // silently fail on pull-to-refresh
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F766E" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No Bookings Yet</Text>
        <Text style={styles.emptySubtitle}>Book a service from the Home tab to get started.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={bookings}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchBookings(); }}
          tintColor="#0F766E"
        />
      }
      ListHeaderComponent={<Text style={styles.header}>My Bookings</Text>}
      renderItem={({ item }) => (
        <Card style={styles.bookingCard}>
          <View style={styles.bookingRow}>
            <View style={styles.bookingInfo}>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              {item.duration && item.duration > 1 && (
                <Text style={styles.detail}>Duration: {item.duration} hr{item.duration > 1 ? 's' : ''}</Text>
              )}
              <Text style={styles.detail}>Amount: ₹{item.amount}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
              <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                {statusLabels[item.status] || item.status}
              </Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 32 },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  bookingCard: { marginBottom: 12 },
  bookingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  detail: { fontSize: 13, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
