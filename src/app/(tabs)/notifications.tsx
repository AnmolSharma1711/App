import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TextInput
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { sendNotificationToAll, sendNotificationTargeted } from '@/lib/api';

export default function NotificationsScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetUids, setTargetUids] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'all' | 'targeted'>('all');

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Missing Fields', 'Please fill in both Title and Message.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'all') {
        result = await sendNotificationToAll(title, body);
      } else {
        const uids = targetUids.split(',').map(s => s.trim()).filter(Boolean);
        if (uids.length === 0) {
          Alert.alert('Error', 'Please enter at least one User ID.');
          setLoading(false);
          return;
        }
        result = await sendNotificationTargeted(uids, title, body);
      }

      if (result.success) {
        Alert.alert('Sent!', `Notification delivered to ${result.sent} device(s).`);
        setTitle('');
        setBody('');
        setTargetUids('');
      } else {
        Alert.alert('Failed', result.error || 'Failed to send notification.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Push Notifications</Text>
      <Text style={styles.subHeader}>Send alerts to customers (Employee Portal)</Text>

      {/* Mode Toggle */}
      <View style={styles.modeRow}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Button
            title="All Customers"
            size="small"
            variant={mode === 'all' ? 'primary' : 'secondary'}
            onPress={() => setMode('all')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Specific Users"
            size="small"
            variant={mode === 'targeted' ? 'primary' : 'secondary'}
            onPress={() => setMode('targeted')}
          />
        </View>
      </View>

      <Card>
        {mode === 'targeted' && (
          <View style={styles.field}>
            <Text style={styles.label}>User IDs (comma-separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 917599739220, 919876543210"
              placeholderTextColor="#94A3B8"
              value={targetUids}
              onChangeText={setTargetUids}
              multiline
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Notification Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. New Service Available!"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Message Body</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="e.g. Book your health check-up today at a special price..."
            placeholderTextColor="#94A3B8"
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{ marginTop: 8 }}>
          <Button
            title={mode === 'all' ? '📢 Send to All Customers' : '🎯 Send to Selected Users'}
            onPress={handleSend}
            isLoading={loading}
            size="large"
          />
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How it works</Text>
        <Text style={styles.infoText}>• Customers must enable notifications in the Profile tab</Text>
        <Text style={styles.infoText}>• "All Customers" sends to every registered device</Text>
        <Text style={styles.infoText}>• "Specific Users" targets users by their phone number (without +)</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subHeader: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  modeRow: { flexDirection: 'row', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15,
    color: '#0F172A', backgroundColor: '#F8FAFC',
  },
  multiline: { height: 100, textAlignVertical: 'top' },
  infoCard: { marginTop: 4, backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#166534', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#166534', marginBottom: 4 },
});
