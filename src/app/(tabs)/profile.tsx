import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBookings } from '@/lib/api';
import { getCurrentUid } from '@/lib/authHelper';

export default function ProfileScreen() {
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = getCurrentUid();
    if (uid) {
      getBookings(uid)
        .then(data => { if (data.success) setBookingCount(data.bookings.length); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  const uid = getCurrentUid();
  const displayPhone = uid ? '+' + uid : 'Guest';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayPhone.charAt(1)?.toUpperCase() ?? 'U'}</Text>
          </View>
          <Text style={styles.phoneText}>{displayPhone}</Text>
          <Text style={styles.roleText}>Customer · Gokul Healthcare</Text>
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bookingCount}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>IN</Text>
              <Text style={styles.statLabel}>All India Coverage</Text>
            </View>
          </View>
        </Card>

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔔 Push Notifications</Text>
          <Text style={styles.infoText}>
            You will automatically receive booking confirmations and service updates from Gokul Healthcare via SMS and in-app alerts.
          </Text>
        </Card>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button title="Sign Out" variant="outline" onPress={handleLogout} size="large" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginVertical: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#0F766E',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  phoneText: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  roleText: { fontSize: 13, color: '#64748B', marginTop: 4 },
  statsCard: { marginBottom: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#0F766E' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' },
  statDivider: { width: 1, height: 48, backgroundColor: '#E2E8F0' },
  infoCard: { marginBottom: 16, backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#166534', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#166534', lineHeight: 20 },
  logoutContainer: { marginTop: 8 },
});
