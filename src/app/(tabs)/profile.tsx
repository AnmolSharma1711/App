import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Information</Text>
      <View style={{ marginTop: 24, width: '100%', paddingHorizontal: 24 }}>
        <Button 
          title="Log Out" 
          variant="outline"
          onPress={() => router.replace('/(auth)/login')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#0F172A', fontSize: 18, fontWeight: '600' }
});
