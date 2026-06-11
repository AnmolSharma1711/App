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
import { getBookings, registerFcmToken } from '@/lib/api';
import { getCurrentUid } from '@/lib/authHelper';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifRegistered, setNotifRegistered] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

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

  const registerForPushNotifications = async () => {
    const uid = getCurrentUid();
    if (!uid) {
      Alert.alert('Not Logged In', 'Please log in first.');
      return;
    }
    if (!Device.isDevice) {
      Alert.alert('Physical Device Required', 'Push Notifications work only on physical Android devices.');
      return;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Push notification permission was not granted.');
      return;
    }
    try {
      // Get native FCM device token (works without Expo account)
      const tokenData = await Notifications.getDevicePushTokenAsync();
      const fcmToken = tokenData.data as string;
      const result = await registerFcmToken(uid, fcmToken);
      if (result.success) {
        setNotifRegistered(true);
        Alert.alert('Notifications Enabled!', 'You will now receive booking updates and alerts.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to get push token. Try again.');
    }
  };

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
            <Text style={styles.avatarText}>{displayPhone.charAt(1).toUpperCase() ?? 'U'}</Text>
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

        {/* Notifications */}
        <Card>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <Text style={styles.sectionSubtitle}>
            Enable to get booking confirmations & service updates.
          </Text>
          <View style={{ marginTop: 12 }}>
            <Button
              title={notifRegistered ? '✓ Notifications Enabled' : 'Enable Notifications'}
              onPress={registerForPushNotifications}
              variant={notifRegistered ? 'secondary' : 'primary'}
              disabled={notifRegistered}
            />
          </View>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#64748B' },
  logoutContainer: { marginTop: 24 },
});
