import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Player } from "../Conexts/Player";
import { Audio } from "expo-av";
import { PlayerControls } from "../Conexts/PlayerControls";

const Tracks = ({ name, artists, uri, trackUri, index, track, sound, isFavourite, liked }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTracks, setSearchTracks] = useState([]);
  const { currentSound, setCurrentSound } = useContext(PlayerControls);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const { position, setPosition } = useContext(PlayerControls);
  const { duration, setDuration } = useContext(PlayerControls);
  const { progress, setProgress } = useContext(PlayerControls);
  const { isLooping, setIsLooping } = useContext(PlayerControls);
  const { isPlaying, setIsPlaying } = useContext(PlayerControls);
  const {trackIndex, setTrackIndex} = useContext(PlayerControls);
  return (
    <Pressable
      key={index}
      onPress={async function play() {
       setTrackIndex(index);
        try {
          if (currentSound) {
            currentSound.unloadAsync();
          }
          setCurrentTrack(track);
          setIsPlaying(true);
          await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            playsInSilentModeIOS: true
          });
          const { sound, status } = await Audio.Sound.createAsync(
            {
              uri: trackUri,
            },
            {
              shouldPlay: true,
              isLooping: isLooping ? true : false,
            }
          );
          setCurrentSound(sound);
          await sound.playAsync();
          await sound.setProgressUpdateIntervalAsync(1000);
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
            } else if (status.isLoaded && status.isPlaying) {
              setPosition(status.positionMillis);
              setProgress(status.positionMillis / status.durationMillis);
              setDuration(status.durationMillis);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }}
      style={{
        width: "100%",
        padding: 10,
        marginBottom: 0,
        borderRadius: 6,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#000",
        marginBottom: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Image source={{ uri: uri }} style={{ width: 55, height: 55 }} />
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ fontSize: 14, fontWeight: "bold", color: "white" }}
          >
            {name.slice(0, 18)}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, fontWeight: "bold", color: "gray" }}
          >
            {artists}
          </Text>
        </View>
      </View>
      <Pressable style={{flexDirection: 'row'}} >
      {
        isFavourite ? (
          <AntDesign name="heart" size={24} color={'lightgreen'} style={{marginHorizontal: 10}} />
        ) : null
      }
      <Entypo name="dots-three-vertical" size={24} color={"#fff"} />
      </Pressable>
    </Pressable>
    
  );
};

export default Tracks;

const styles = StyleSheet.create({});
