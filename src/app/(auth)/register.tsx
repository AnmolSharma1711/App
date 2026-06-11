import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    // Simulate registration
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join JanSahayak to access healthcare services</Text>

          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="Phone Number"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <Input
              label="Email (Optional)"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button 
              title="Register & Continue" 
              onPress={handleRegister} 
              isLoading={isLoading} 
            />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Text 
              style={styles.loginLink}
              onPress={() => router.back()}
            >
              Log in
            </Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginText: {
    color: '#64748B',
    fontSize: 14,
  },
  loginLink: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '600',
  },
});
