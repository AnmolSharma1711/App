import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function LoginOptionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please select how you would like to log in</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Customer Login" 
            onPress={() => router.push('/(auth)/customer-login')} 
            size="large"
          />
          <View style={styles.spacer} />
          <Button 
            title="Employee Login" 
            onPress={() => router.push('/(auth)/employee-login')} 
            variant="outline"
            size="large"
          />
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <Text 
            style={styles.registerLink}
            onPress={() => router.push('/(auth)/register')}
          >
            Register Now
          </Text>
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
  },
  spacer: {
    height: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  registerText: {
    color: '#64748B',
    fontSize: 14,
  },
  registerLink: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '600',
  },
});
