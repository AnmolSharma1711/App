import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CustomerLoginScreen() {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        setStep('verify');
      } else {
        alert(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      alert('Network error. Check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (data.success) {
        router.replace('/(tabs)/dashboard');
      } else {
        alert(data.error || 'Invalid OTP');
      }
    } catch (error) {
      alert('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = () => {
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
          <Text style={styles.title}>Customer Login</Text>
          <Text style={styles.subtitle}>Log in to book and manage your healthcare services</Text>
          
          <View style={styles.toggleContainer}>
            <View style={{ flex: 1 }}>
              <Button
                title="OTP"
                onPress={() => { setLoginMethod('otp'); setStep('phone'); }}
                variant={loginMethod === 'otp' ? 'primary' : 'secondary'}
                size="small"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Password"
                onPress={() => setLoginMethod('password')}
                variant={loginMethod === 'password' ? 'primary' : 'secondary'}
                size="small"
              />
            </View>
          </View>

          {loginMethod === 'otp' ? (
            step === 'phone' ? (
              <View style={styles.formContainer}>
                <Input
                  label="Phone Number"
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <Button 
                  title="Send OTP" 
                  onPress={handleSendOtp} 
                  isLoading={isLoading} 
                />
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.infoText}>OTP sent to {phone}</Text>
                <Input
                  label="Enter OTP"
                  placeholder="4-digit code"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                />
                <Button 
                  title="Verify & Login" 
                  onPress={handleVerifyOtp} 
                  isLoading={isLoading} 
                />
                <View style={{ marginTop: 12 }}>
                  <Button 
                    title="Change Number" 
                    variant="outline"
                    onPress={() => setStep('phone')} 
                  />
                </View>
              </View>
            )
          ) : (
            <View style={styles.formContainer}>
              <Input
                label="Email or Phone"
                placeholder="Enter your ID"
                value={phone}
                onChangeText={setPhone}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Button 
                title="Login" 
                onPress={handlePasswordLogin} 
                isLoading={isLoading} 
              />
            </View>
          )}

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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  formContainer: {
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#0F766E',
    marginBottom: 16,
    fontWeight: '500',
  },
});
