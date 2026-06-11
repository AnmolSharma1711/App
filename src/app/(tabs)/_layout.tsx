import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0F766E',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: '#0F766E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Services',
          headerTitle: 'JanSahayak - Gokul Healthcare',
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          headerTitle: 'My Bookings',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notify',
          headerTitle: 'Send Notifications',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}
