import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EmployeeLoginScreen() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/dashboard');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Employee Portal</Text>
          <Text style={styles.subtitle}>Log in using your corporate credentials</Text>

          <View style={styles.formContainer}>
            <Input
              label="Employee ID"
              placeholder="e.g. EMP1234"
              value={employeeId}
              onChangeText={setEmployeeId}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button 
              title="Secure Login" 
              onPress={handleLogin} 
              isLoading={isLoading} 
            />
          </View>

          <View style={{ marginTop: 32 }}>
            <Button 
              title="Back to Options" 
              variant="outline"
              onPress={() => router.back()} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
});
