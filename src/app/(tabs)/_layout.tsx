import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#0F766E' }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Home',
          headerTitle: 'JanSahayak Services'
        }} 
      />
      <Tabs.Screen 
        name="bookings" 
        options={{ 
          title: 'Bookings',
          headerTitle: 'My Bookings'
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          headerTitle: 'My Profile'
        }} 
      />
    </Tabs>
  );
}
