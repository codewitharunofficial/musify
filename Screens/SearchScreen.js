import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { Player } from "../Conexts/Player";
import Slider from "@react-native-community/slider";
import { BottomModal, ModalContent } from "react-native-modals";
import Tracks from "../Components/Tracks";
import PlayerScreen from "../Components/PlayerScreen";
import PlayerModel from "../Components/PlayerModel";
import { Model } from "../Conexts/PlayerModelContext";
import { PlayerControls } from "../Conexts/PlayerControls";

const SearchScreen = () => {
  const [keywrod, setKeyword] = useState("");
  const [searchTracks, setSearchTracks] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const { modalVisible, setModalVisible } = useContext(Model);
  const { currentSound, setCurrentSound } = useContext(PlayerControls);
  const [position, setPosition] = useState(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState(20);

  const value = useRef(0);

  const search = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/search?q=${keywrod}&type=album,track,show,playlist,audiobook&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data) {
          setSearchTracks(data?.tracks?.items);
          setSearchAlbums(data?.albums?.items);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/search?q=${keywrod}&type=album,track,show,playlist,audiobook&limit=20&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data) {
          setOffset(data?.tracks?.offset);
          setSearchTracks(searchTracks.concat(data?.tracks?.items));
          // setSearchAlbums(data?.albums?.items);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    search();
  }, [keywrod]);



  return (
    <>
      <SafeAreaView>
        <View
          style={{
            width: "100%",
            height: 100,
            alignItems: "center",
            paddingHorizontal: 20,
            flexDirection: "row",
            paddingVertical: 30,
            marginTop: 30,
            gap: 20,
            backgroundColor: "lightgray",
          }}
        >
          <TextInput
            onChangeText={setKeyword}
            placeholder="Search..."
            style={{
              width: "60%",
              height: 40,
              alignSelf: "center",
              flex: 1,
              borderRadius: 10,
              borderWidth: 1,
              padding: 10,
            }}
          />
          <Feather name="search" size={30} color={"black"} />
        </View>
        <ScrollView
          onMomentumScrollEnd={() => loadMore()}
          style={{ marginBottom: isPlaying ? 70 : 30 }}
        >
          {searchTracks ? (
            <>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  paddingVertical: 5,
                  paddingHorizontal: 3,
                }}
              >
                Songs
              </Text>
              {searchTracks.map((e, i) => (
                <Tracks
                  name={e?.name}
                  artists={e?.album?.artists[0]?.name}
                  trackUri={e?.preview_url}
                  uri={e?.album?.images[0]?.url}
                  index={i}
                  track={e}
                  sound={currentSound}
                />
              ))}
              <Pressable
                style={{ alignSelf: "flex-end", paddingHorizontal: 10 }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    paddingVertical: 3,
                  }}
                >
                  More
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <View>
                <Text style={{ textAlign: "center" }}>
                  No Search Results for {keywrod}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      {currentTrack ? (
        <PlayerScreen
          name={currentTrack?.name}
          artists={currentTrack?.album?.artists[0]?.name}
          uri={currentTrack?.album?.images[0]?.url}
          track={currentSound}
          visible={modalVisible}
          trackList = {searchTracks}
        />
      ) : null}
    </>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({});
