import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { useUser } from "@/components/context/AuthContext";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const UserStatusScreen = () => {
  const { isConnected, user, favoriteStore } = useUser();
  const router = useRouter();

  const redirectToWebViewPage = (url: string) => {
    router.replace({
      pathname: "/(tabs)",
      params: { url, timestamp: Date.now() },
    });
  };

  const parseFavoriteStore = () => {
    if (!favoriteStore) return null;
    const parts = favoriteStore.split("|");
    return {
      name: parts[0]
        .replace("INTERSPORT+-+", "")
        .replace(/\(NOBRIDGE\) LOG/g, "")
        .trim(),
      hours: parts[1] ? JSON.parse(parts[1]) : null,
      address: parts[2]?.split("/").filter(Boolean).join(" > ") || "",
    };
  };

  const storeInfo = parseFavoriteStore();
  const today = new Date()
    .toLocaleString("fr-FR", { weekday: "long" })
    .toLowerCase();
  const todayHours = storeInfo?.hours?.find(
    (h: { d: string }) => h.d.toLowerCase() === today
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                      "&background=random&color=fff",
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

              <View style={styles.storeCard}>
                <View style={styles.storeHeader}>
                  <FontAwesome5 name="store" size={20} color="#4E7AC7" />
                  <Text style={styles.storeTitle}>Votre magasin favori</Text>
                </View>
                {storeInfo && (
                  <>
                    <Text style={styles.storeName}>{storeInfo.name}</Text>

                    {todayHours && (
                      <View style={styles.hoursContainer}>
                        <MaterialIcons
                          name="access-time"
                          size={16}
                          color="#4E7AC7"
                        />
                        <Text style={styles.hoursText}>
                          Aujourd'hui: {todayHours.ot1} - {todayHours.ct1}
                        </Text>
                      </View>
                    )}

                    {storeInfo.address && (
                      <View style={styles.addressContainer}>
                        <MaterialIcons name="place" size={16} color="#4E7AC7" />
                        <Text style={styles.addressText}>
                          {storeInfo.address}
                        </Text>
                      </View>
                    )}
                  </>
                )}
                <View style={styles.storeAction}>
                  <Button
                    title={storeInfo ? "Modifier" : "Ajouter un magasin favori"}
                    color="#4E7AC7"
                    onPress={() =>
                      redirectToWebViewPage(
                        "https://www.intersport.fr/my-account/mystore/"
                      )
                    }
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {isConnected ? (
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={() =>
              redirectToWebViewPage("https://www.intersport.fr/logout")
            }
          >
            <Text style={styles.buttonText}>Déconnexion</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              redirectToWebViewPage("https://www.intersport.fr/login")
            }
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
    shadowOffset: { width: 0, height: 2 },
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
  storeCard: {
    width: "100%",
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E0E8FF",
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4E7AC7",
    marginLeft: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: "#4E7AC7",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#4E7AC7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    marginTop: 30,
    shadowColor: "#E74C3C",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  storeAction: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default UserStatusScreen;
