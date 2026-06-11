import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>JanSahayak</Text>
          <Text style={styles.subtitle}>by Gokul Healthcare</Text>
        </View>
        <Text style={styles.description}>
          Your trusted partner for healthcare services across India.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button 
          title="Get Started" 
          onPress={() => router.push('/(auth)/login')} 
          size="large"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0F766E', // Teal 700
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B', // Slate 500
    marginTop: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 18,
    color: '#334155', // Slate 700
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 32,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
});
