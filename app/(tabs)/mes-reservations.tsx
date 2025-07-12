import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axiosInstance';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export type Film = {
  id: number;
  title: string;
  imageName?: string;
};

export type Seance = {
  id: number;
  film: Film;
  dateHeure: string;
  dateHeureDebut: string;
};

export type Seat = {
  numero: string;
};

export type Reservation = {
  id: number;
  placeReserve: number;
  prix: number;
  seance: Seance | string;
  seats: Seat[] | null;
};

export default function ReservationsScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    api.get('/reservations?pagination=false&expand=seance.film')
      .then(res => {
        const data = res.data;
        setReservations(data.member || data['hydra:member'] || data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement des réservations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reservations.length === 0 ? (
        <Text>Aucune réservation trouvée.</Text>
      ) : (
        reservations.map(res => {
          const seance = typeof res.seance === 'object' ? res.seance : null;
          const film = seance?.film;
          const filmTitre = film?.title ?? 'Film non chargé';
          const imageUri = film?.imageName
             ? `https://bucketeer-b78e6166-923a-41f5-8eac-7295c143deb0.s3.eu-west-1.amazonaws.com/images/Film/${film.imageName}`
            : 'https://via.placeholder.com/300x200?text=Pas+de+visuel';

          return (
            <View key={res.id} style={styles.card}>
              <Image source={{ uri: imageUri }} style={styles.poster} resizeMode="cover" />
              <Text style={styles.title}>{filmTitre}</Text>
              <Text>
                  Début : {seance && typeof seance === 'object' ? new Date(seance.dateHeureDebut || seance.dateHeure).toLocaleString() : 'Date non disponible'}
              </Text>
              <Text>Places réservées : {res.placeReserve}</Text>
              <Text>Prix total : {res.prix} €</Text>
              <Text>Sièges : {res.seats && res.seats.length > 0 ? res.seats.join(', ') : 'Aucun siège'}</Text>
              
              

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/mes-reservations/[id]',
                    params: { id: res.id.toString() },
                  })
                }
                style={styles.button}
              >
                <Text style={styles.buttonText}>Voir plus</Text>
              </Pressable>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20,
     paddingTop: 80,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  title: { fontWeight: 'bold', fontSize: 16, marginVertical: 5 },
  poster: {
  width: '100%',       
  height: 300,         
  resizeMode: 'contain',
  borderRadius: 8,
  marginBottom: 10,
  },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginVertical: 5,
  },
  seatBadge: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  seatText: {
    fontSize: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
