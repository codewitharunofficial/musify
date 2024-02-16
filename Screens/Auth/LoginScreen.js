import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import axios from "axios";
import * as Linking from 'expo-linking';
// import Toast from 'react-native-simple-toast';
import Constants from 'expo-constants';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
  const redirectUri = AuthSession.makeRedirectUri({scheme: 'musify', path: 'spotify-auth-callback'});
  const spotifyClientId = "fbf28369e17e4a8b9ba41fab9a2461eb";
  const clientSecret = "65d65c57931147d7af4361756bb57cd5";
    //  Toast.show(redirectUri, 5000);


  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: spotifyClientId,
      clientSecret: clientSecret,
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
        "user-library-read"
      ],
      usePKCE: false,
      redirectUri: redirectUri,
    },
    discovery,
    {
      useProxy: () => {
        Constants.appOwnership === AppOwnership.Expo
      }
    }
      
  );

 useEffect(() => {
  if(response?.type === 'success'){
    setToken(response?.authentication?.accessToken);
    AsyncStorage.setItem('token', response?.authentication?.accessToken);
    AsyncStorage.setItem('expiry', response?.authentication?.expiresIn);
    AsyncStorage.setItem('issue', (response?.authentication?.issuedAt)?.toString());
    navigation.navigate("Main");
    // console.log(response);
  }
 }, [response]);

 useEffect(() => {
  const checkValidity = async () => {
  const currentTime = Math.floor(Date.now() / 1000);
  const token = await AsyncStorage.getItem("token");
  const expiry = await AsyncStorage.getItem("expiry");
  const expiresIn = parseInt(expiry);
  const issue = await AsyncStorage.getItem("issue");
  const issuedAt = parseInt(issue);
  const expirationTime = issuedAt + expiresIn;

  if(token && currentTime > expirationTime){
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("issue");
    AsyncStorage.removeItem("expiry");
  } else {
    navigation.navigate("Main");
  }
  }
  checkValidity();
  }, []);


  return (
    <SafeAreaView>
      <View
        style={{
          width: "80%",
          height: 300,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          flexDirection: "column",
        }}
      >
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/3547568/screenshots/14395014/music_jpeg.jpg",
          }}
          style={{ width: 200, height: 80, borderRadius: 20 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Millions Of Songs For Millions of Hearts
        </Text>
      </View>

      <View
        style={{
          width: "80%",
          height: 400,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2a0632",
          borderRadius: 20,
        }}
      >
        <Pressable
          onPress={() => {
            promptAsync()
          }}
          style={{
            width: "80%",
            alignSelf: "center",
            backgroundColor: "darkgreen",
            paddingHorizontal: 10,
            padding: 15,
            borderRadius: 20,
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Entypo
            name="spotify"
            size={24}
            color="white"
            style={{ alignSelf: "center" }}
          />
          <Text style={{ color: "white", flex: 1, alignSelf: "center" }}>
            Login With Spotify
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
