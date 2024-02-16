import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { BottomModal, ModalContent } from 'react-native-modals';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Player } from '../Conexts/Player';
import { Model } from '../Conexts/PlayerModelContext';
import { PlayerControls } from '../Conexts/PlayerControls';
import { Audio } from 'expo-av';

const PlayerModel = ({name, artists, uri, track, queue }) => {
  const {position, setPosition} = useContext(PlayerControls);
  const {duration, setDuration} = useContext(PlayerControls);
  const {progress, setProgress} = useContext(PlayerControls);
  const {isLooping, setIsLooping} = useContext(PlayerControls);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const {isPlaying, setIsPlaying} = useContext(PlayerControls);
  const {modalVisible, setModalVisible} = useContext(Model);
  const {currentSound, setCurrentSound} = useContext(PlayerControls);
  const {trackIndex, setTrackIndex} = useContext(PlayerControls);
  const value = useRef(0);

  const trackProgress = (position) => {
    const minutes = Math.floor(position/60000);
    const seconds = Math.floor((position % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0": ""}${seconds}`
  }
  
  // console.log(trackIndex);
  return (
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
            source={{ uri: uri }}
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
              {name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
                alignSelf: "flex-start",
              }}
            >
              {artists}
            </Text>
            <View
              style={{
                width: "100%",
                height: 130,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Slider onValueChange={() => currentSound.setPositionAsync()} minimumValue={0} maximumValue={duration} value={position}
                style={{ width: "100%", height: 40, alignSelf: "center" }}
                />
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: -10, paddingHorizontal: 10}} >
              <Text>{trackProgress(position)}</Text>
              <Text>{trackProgress(duration)}</Text>
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
                  alignItems: 'center'
                }}
              >
                <FontAwesome name="random" size={24} color={"white"} />
                <AntDesign name="stepbackward" size={30} color={"white"} />
                {isPlaying ? (
                  <AntDesign
                  onPress={async function pause () {
                    try {
                      currentSound?.pauseAsync();
                      setIsPlaying(false);
                      currentSound.setOnPlaybackStatusUpdate(status => {
                        setPosition(status?.positionMillis);
                      })
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
                  onPress={async function play(){
                    try {
                      currentSound.setOnPlaybackStatusUpdate(status => {
                        if(status.didJustFinish){
                          currentSound.replayAsync();
                          setIsPlaying(true);
                        } else {
                          currentSound.playAsync();
                          setIsPlaying(true);
                          currentSound.setOnPlaybackStatusUpdate(status => {
                            setProgress(status.positionMillis/status.durationMillis);
                            setPosition(status.positionMillis);
                          })
                        }
                      })
                      
                    } catch (error) {
                      
                    }
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
                <AntDesign onPress={async() => {
                  setTrackIndex(trackIndex + 1);
                  try {
                    if (currentSound) {
                      currentSound.stopAsync();
                      setCurrentSound(null);
                    }
                     
                    if (trackIndex < queue.length) {
                      const nextTrack = queue[trackIndex];
                      setCurrentTrack(nextTrack);
                      setIsPlaying(true);
                      
                      await Audio.setAudioModeAsync({
                        staysActiveInBackground: true,
                      });
                      const { sound, status } = await Audio.Sound.createAsync(
                        {
                          uri: currentTrack?.preview_url,
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
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }} name="stepforward" size={30} color={"white"} />
                <Feather onPress={() => {
                  currentSound?.setIsLoopingAsync();
                  setIsLooping(!isLooping);
                  setIsPlaying(true);
                  if(isPlaying){
                    currentSound.playAsync();
                  } else{
                    setIsPlaying(false);
                  }
                }} name="repeat" size={24} color={isLooping ? "green" : "white"} />
              </View>
            </View>
          </View>
        </ModalContent>
      </SafeAreaView>
    </BottomModal>
  )
}

export default PlayerModel

const styles = StyleSheet.create({})