import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axiosInstance';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Film = {
  title: string;
  description: string;
  imageName: string;
};

type Salle = {
  numero: number;
};

type Seance = {
  dateHeureDebut: string;
  dateHeureFin: string;
  qualite: string;
  film: Film;
  salle: Salle;
  prix: number;
};

type Reservation = {
  id: number;
  placeReserve: number;
  prix: number;
  seance: Seance;
  seats: string[];
  qrCodePath: string;
};

// ...imports et types inchangés

export default function ReservationDetail() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;

    api.get(`/reservations/${id}`)
      .then(res => {
        setReservation(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Chargement...</Text>
      </View>
    );
  }

  if (error || !reservation) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', fontSize: 16, marginBottom: 15 }}>
          Erreur : {error || 'Données non trouvées'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { seance } = reservation;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <Image
            source={{ uri: `http://10.0.2.2:8000/images/Film/${seance.film.imageName}` }}
            style={styles.image}
          />
          <Text style={styles.title}>{seance.film.title}</Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Places réservées :</Text> {reservation.placeReserve}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Prix total :</Text> {reservation.prix} €
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Sièges :</Text> {reservation.seats.join(', ')}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Début séance :</Text> {new Date(seance.dateHeureDebut).toLocaleString()}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Fin séance :</Text> {new Date(seance.dateHeureFin).toLocaleString()}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Qualité :</Text> {seance.qualite}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Salle :</Text> {seance.salle.numero}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Prix par place :</Text> {seance.prix} €
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>QR Code</Text>
          <Image
            source={{ uri: `http://10.0.2.2:8000${reservation.qrCodePath}` }}
            style={styles.qrCode}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => router.push('/mes-reservations')}
          activeOpacity={0.8}
        >
          <Text style={styles.returnButtonText}>← Retour aux réservations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f8fa',
    paddingTop: 50,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
    alignItems: 'center',
    paddingTop: 50,  // centre le card horizontalement
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '700',
    color: '#007bff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 15,
  },
  qrCode: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  returnButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
});
