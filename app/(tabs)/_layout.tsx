import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Alert, Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, isLoading, logout } = useAuth();

  if (isLoading) return null;

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
        tabBarIcon: () => null, // Disable icons globally
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: () => null,
        }}
      />
      {token && (
        <Tabs.Screen
          name="mes-reservations"
          options={{
            title: 'Réservations',
            tabBarIcon: () => null,
          }}
        />
      )}
      {token && (
        <Tabs.Screen
          name="logout"
          options={{
            title: 'Déconnexion',
            tabBarIcon: () => null,
          }}
        />
      )}
    </Tabs>
  );
}