import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useUser } from "@/components/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const UserStatusScreen = () => {
  const { isConnected, user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {!isConnected && (
          <>
            <View style={styles.iconContainer}>
              <MaterialIcons name="warning" size={48} color="#FFA726" />
            </View>
            <Text style={styles.title}>Vous n'êtes pas connecté</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour accéder à toutes les fonctionnalités
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </>
        )}

        {user && (
          <>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    "https://ui-avatars.com/api/?name=" +
                    user.name +
                    "&background=random",
                }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.title}>Bonjour {user.name} !</Text>
            <View style={styles.infoContainer}>
              <MaterialIcons name="email" size={20} color="#555" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <MaterialIcons name="fingerprint" size={20} color="#555" />
              <Text style={styles.infoText}>ID: {user.id}</Text>
            </View>
            {/* <TouchableOpacity style={[styles.button, styles.logoutButton]}>
              <Text style={styles.buttonText}>Déconnexion</Text>
            </TouchableOpacity> */}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#FFF3E0",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#4E7AC7",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#4E7AC7",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserStatusScreen;
