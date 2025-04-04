import React from "react";
import { View, Text, Button, StyleSheet, Linking } from "react-native";
import { useUser } from "@/components/context/AuthContext";

const UserStatusScreen = () => {
  const { isConnected, logout } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        L'utilisateur est {isConnected ? "connecté" : "non connecté"}
      </Text>
      {isConnected && <Button title="Se déconnecter" onPress={() => {}} />}
      {!isConnected && (
        <Text style={styles.infoText}>
          Vous n'êtes pas connecté. Veuillez vous connecter.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default UserStatusScreen;
