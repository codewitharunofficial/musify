import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BottomModal } from "react-native-modals";
import { ModalContent } from "react-native-modals";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Player } from "../Conexts/Player";
import { PlayerControls } from "../Conexts/PlayerControls";
const HomeScreen = () => {
  const [user, setUser] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [AllRecentlyPlayed, setAllRecentlyPlayed] = useState([]);
  const [topArtist, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const { currentSound, setCurrentSound } = useContext(PlayerControls);
  const { position, setPosition } = useContext(PlayerControls);
  const { duration, setDuration } = useContext(PlayerControls);
  const { progress, setProgress } = useContext(PlayerControls);
  const { isLooping, setIsLooping } = useContext(PlayerControls);
  const { isPlaying, setIsPlaying } = useContext(PlayerControls);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getUser = async () => {
    try {
      const auth = await AsyncStorage.getItem("token");
      if (auth) {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentlyPlayed = async () => {
    try {
      const auth = await AsyncStorage.getItem("token");
      if (auth && user) {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/me/player/recently-played?limit=4",
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        setRecentlyPlayed(data?.items);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllRecentlyPlayed = async () => {
    try {
      const auth = await AsyncStorage.getItem("token");
      if (auth && user) {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/me/player/recently-played?limit=20",
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        setAllRecentlyPlayed(data?.items);
        console.log(AllRecentlyPlayed[8]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTopArtists = async () => {
    try {
      const auth = await AsyncStorage.getItem("token");
      if (auth && user) {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/me/top/artists?limit=20",
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        setTopArtists(data?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //getting featured playlists

  const getFeaturedPlaylists = async () => {
    try {
      const auth = await AsyncStorage.getItem("token");
      if (auth && user) {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/browse/featured-playlists",
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );
        setPlaylists(data?.playlists?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [isFocused]);

  useEffect(() => {
    getRecentlyPlayed();
    getAllRecentlyPlayed();
    getTopArtists();
    getFeaturedPlaylists();
  }, [user]);

  return (
    <>
      <SafeAreaView>
        <ScrollView
          scrollEnabled={true}
          style={{ width: "100%", marginBottom: currentTrack ? 70 : 0 }}
        >
          <View
            style={{
              width: "100%",
              height: 60,
              backgroundColor: "lightblue",
              marginTop: 20,
              justifyContent: "center",
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Image
              source={{ uri: user?.images[0].url }}
              width={50}
              height={50}
              style={{ borderRadius: 30 }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", flex: 1 }}>
              Welcome {user?.display_name}!!
            </Text>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={24}
              color="orange"
            />
          </View>

          <View
            style={{
              width: "90%",
              alignSelf: "center",
              height: 70,
              backgroundColor: "lightblue",
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Pressable
              onPress={() => navigation.navigate("Favourites")}
              style={{
                backgroundColor: "gray",
                paddingHorizontal: 10,
                flexDirection: "row",
                paddingVertical: 10,
                gap: 10,
                alignItems: "center",
                height: 50,
                width: "45%",
                borderRadius: 5,
              }}
            >
              <AntDesign name="heart" size={24} color={"white"} />
              <Text style={{ fontSize: 14, color: "white", flex: 1 }}>
                Favourites
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "gray",
                paddingHorizontal: 10,
                flexDirection: "row",
                paddingVertical: 10,
                gap: 10,
                alignItems: "center",
                height: 50,
                width: "45%",
                borderRadius: 5,
              }}
            >
              <Image
                source={{ uri: user?.images[0].url }}
                width={30}
                height={30}
                style={{ borderRadius: 20 }}
              />
              <Text style={{ fontSize: 14, color: "white", flex: 1 }}>
                Playlists
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              width: "90%",
              alignSelf: "center",
              height: 140,
              backgroundColor: "lightblue",
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {recentlyPlayed
              ? recentlyPlayed.map((e, i) => (
                  <Pressable
                    onPress={async function play() {
                      try {
                        if(currentSound){
                          currentSound.unloadAsync();
                        }
                        setCurrentTrack(e?.track);
                        setIsPlaying(true);
                        await Audio.setAudioModeAsync({
                          staysActiveInBackground: true,
                        });
                        const { sound, status } = await Audio.Sound.createAsync(
                          {
                            uri: e?.track?.preview_url,
                          },
                          {
                            shouldPlay: true,
                            isLooping: isLooping ? true : false,
                          }
                        );
                        setCurrentSound(sound);
                        await sound.playAsync();
                        sound.setOnPlaybackStatusUpdate((status) => {
                          if (status.didJustFinish) {
                            setIsPlaying(false);
                          } else if (status.isLoaded && status.isPlaying) {
                            setPosition(status.positionMillis);
                            setProgress(
                              status.positionMillis / status.durationMillis
                            );
                            setDuration(status.durationMillis);
                          }
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    key={i}
                    style={{
                      backgroundColor: "gray",
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      paddingVertical: 10,
                      gap: 10,
                      alignItems: "center",
                      height: 50,
                      width: "45%",
                      borderRadius: 5,
                    }}
                  >
                    <Image
                      source={{ uri: e?.track?.album?.images[0]?.url }}
                      width={30}
                      height={30}
                      style={{ borderRadius: 20 }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 14, color: "white", flex: 1 }}
                    >
                      {e?.track?.name}
                    </Text>
                  </Pressable>
                ))
              : null}
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            Recently Played
          </Text>
          {AllRecentlyPlayed ? (
            <ScrollView
              scrollEnabled={true}
              horizontal={true}
              contentContainerStyle={{
                paddingHorizontal: 10,
                marginTop: 10,
                height: 210,
                backgroundColor: "lightblue",
                alignSelf: "center",
                borderRadius: 5,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                padding: 10,
              }}
            >
              {AllRecentlyPlayed.map((e, i) => (
                <Pressable
                  onPress={async function play() {
                    try {
                      if(currentSound){
                        currentSound.unloadAsync();
                      }
                      setCurrentTrack(e?.track);
                      setIsPlaying(true);
                      await Audio.setAudioModeAsync({
                        staysActiveInBackground: true,
                      });
                      const { sound, status } = await Audio.Sound.createAsync(
                        {
                          uri: e?.track?.preview_url,
                        },
                        {
                          shouldPlay: true,
                          isLooping: isLooping ? true : false,
                        }
                      );
                      setCurrentSound(sound);
                      await sound.playAsync();
                      sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.didJustFinish) {
                          setIsPlaying(false);
                        } else if (status.isLoaded && status.isPlaying) {
                          setPosition(status.positionMillis);
                          setProgress(
                            status.positionMillis / status.durationMillis
                          );
                          setDuration(status.durationMillis);
                        }
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  key={i}
                  style={{
                    width: 140,
                    height: "auto",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: e?.track?.album?.images[0]?.url }}
                    width={140}
                    height={140}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      marginTop: 3,
                    }}
                  >
                    {e?.track?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      marginTop: 3,
                    }}
                  >
                    Album: {e?.track?.album?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      marginTop: 3,
                    }}
                  >
                    Artist: {e?.track?.album?.artists[0]?.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            Top-Artists
          </Text>
          {topArtist ? (
            <ScrollView
              scrollEnabled={true}
              horizontal={true}
              contentContainerStyle={{
                paddingHorizontal: 10,
                marginTop: 10,
                height: 210,
                backgroundColor: "lightblue",
                alignSelf: "center",
                borderRadius: 5,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                padding: 10,
                marginBottom: 20,
              }}
            >
              {topArtist?.map((e, i) => (
                <Pressable
                  key={i}
                  style={{
                    width: 140,
                    height: "auto",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: e?.images[0]?.url }}
                    width={140}
                    height={140}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      marginTop: 3,
                    }}
                  >
                    {e?.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            Featured Playlists
          </Text>
          {playlists ? (
            <ScrollView
              scrollEnabled={true}
              horizontal={true}
              contentContainerStyle={{
                paddingHorizontal: 10,
                marginTop: 10,
                height: 210,
                backgroundColor: "lightblue",
                alignSelf: "center",
                borderRadius: 5,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                padding: 10,
                marginBottom: 20,
              }}
            >
              {playlists.map((e, i) => (
                <Pressable
                  key={i}
                  style={{
                    width: 140,
                    height: "auto",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: e?.images[0]?.url }}
                    width={140}
                    height={140}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      marginTop: 3,
                    }}
                  >
                    {e?.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
        </ScrollView>
      </SafeAreaView>
      {currentTrack ? (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            marginBottom: 0,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "lightgreen",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "60%",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Image
              source={{ uri: currentTrack?.album?.images[0]?.url }}
              style={{ width: 55, height: 55 }}
            />
            <View
              style={{ flexDirection: "column", alignItems: "center", gap: 3 }}
            >
              <Text
                numberOfLines={1}
                style={{ fontSize: 12, fontWeight: "bold", color: "gray" }}
              >
                {currentTrack?.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{ fontSize: 14, fontWeight: "bold", color: "gray" }}
              >
                {currentTrack?.album?.artists[0]?.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <AntDesign name="heart" size={24} color={"white"} />
            {isPlaying ? (
              <AntDesign
                onPress={async function pause() {
                  try {
                    currentSound?.pauseAsync();
                    setIsPlaying(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                name="pause"
                size={20}
                color={"black"}
                style={{
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              />
            ) : (
              <Entypo
                onPress={async function play() {
                  try {
                    currentSound.playAsync();
                    setIsPlaying(true);
                  } catch (error) {}
                }}
                name="controller-play"
                size={20}
                color={"black"}
                style={{
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              />
            )}
          </View>
        </Pressable>
      ) : null}

      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        onSwiping={() => setModalVisible(!modalVisible)}
        swipeDirection={["down", "up"]}
        swipeThreshold={100}
      >
        <SafeAreaView>
          <ModalContent
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "lightblue",
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                height: 30,
                alignSelf: "flex-end",
                flexDirection: "row",
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 0,
                  flex: 1,
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Now Playing
              </Text>
              <AntDesign
                onPress={() => setModalVisible(false)}
                name="down"
                size={24}
                color={"black"}
                style={{ alignSelf: "flex-end" }}
              />
            </View>
            <Image
              source={{ uri: currentTrack?.album?.images[0]?.url }}
              style={{
                width: "90%",
                height: "60%",
                alignSelf: "center",
                resizeMode: "contain",
              }}
            />
            <View
              style={{ width: "90%", alignSelf: "center", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                  alignSelf: "flex-start",
                }}
              >
                {currentTrack?.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "white",
                  alignSelf: "flex-start",
                }}
              >
                {currentTrack?.album?.artists[0]?.name}
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 130,
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Slider
                  value={progress}
                  upperLimit={progress}
                  style={{ width: "100%", height: 40, alignSelf: "center" }}
                />
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: -10,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text>0:{Math.round(position / 1000)}</Text>
                  <Text>0:{Math.round(duration / 1000)}</Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                    paddingVertical: 0,
                    alignSelf: "center",
                    paddingHorizontal: 20,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="random" size={24} color={"white"} />
                  <AntDesign name="stepbackward" size={30} color={"white"} />
                  {isPlaying ? (
                    <AntDesign
                      onPress={async function pause() {
                        try {
                          currentSound?.pauseAsync();
                          setIsPlaying(false);
                          currentSound.setOnPlaybackStatusUpdate((status) => {
                            setPosition(status?.positionMillis);
                          });
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      name="pause"
                      size={32}
                      color={"black"}
                      style={{
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 30,
                        alignSelf: "center",
                        marginTop: -7,
                      }}
                    />
                  ) : (
                    <Entypo
                      onPress={async function play() {
                        try {
                          currentSound.setOnPlaybackStatusUpdate((status) => {
                            if (status.didJustFinish) {
                              currentSound.replayAsync();
                              setIsPlaying(true);
                            } else {
                              currentSound.playAsync();
                              setIsPlaying(true);
                              currentSound.setOnPlaybackStatusUpdate(
                                (status) => {
                                  setProgress(
                                    status.positionMillis /
                                      status.durationMillis
                                  );
                                  setPosition(status.positionMillis);
                                }
                              );
                            }
                          });
                        } catch (error) {}
                      }}
                      name="controller-play"
                      size={30}
                      color={"black"}
                      style={{
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 30,
                        alignSelf: "center",
                        marginTop: -7,
                      }}
                    />
                  )}
                  <AntDesign name="stepforward" size={30} color={"white"} />
                  <Feather
                    onPress={() => {
                      currentSound?.setIsLoopingAsync();
                      setIsLooping(!isLooping);
                      setIsPlaying(true);
                      if (isPlaying) {
                        currentSound.playAsync();
                      } else {
                        setIsPlaying(false);
                      }
                    }}
                    name="repeat"
                    size={24}
                    color={isLooping ? "green" : "white"}
                  />
                </View>
              </View>
            </View>
          </ModalContent>
        </SafeAreaView>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
