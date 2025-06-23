import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎬 Cinéphoria</Text>
        <Text style={styles.subtitle}>Votre application dédiée au 7e art</Text>

        <Text style={styles.paragraph}>
          Cinéphoria est une application pensée pour les amoureux du cinéma. Que vous soyez fan de grands classiques, de blockbusters ou de films indépendants, Cinéphoria vous accompagne dans votre passion.
        </Text>

        <Text style={styles.paragraph}>
          • Retrouvez facilement toutes vos réservations et leurs détails.
        </Text>

        <View style={styles.spacer} />

        <Text style={styles.footer}>
          🎥 Cinéphoria – Vivez le cinéma autrement.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B7D8D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4B7D8D',
    marginTop: 30,
    marginBottom: 20,
  },
});
