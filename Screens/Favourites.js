import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { AntDesign, Entypo, Feather, FontAwesome } from '@expo/vector-icons'
import { Player } from '../Conexts/Player'
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider'
import { BottomModal, ModalContent } from 'react-native-modals'
import { PlayerControls } from '../Conexts/PlayerControls'
import Tracks from '../Components/Tracks'

const Favourites = () => {

    const isFocused = useIsFocused();

    const [favourites, setFavourites] = useState([]);
    const  [offset, setOffset] = useState(20);
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const {currentTrack, setCurrentTrack} = useContext(Player);
    const { currentSound, setCurrentSound } = useContext(PlayerControls);
    const { position, setPosition } = useContext(PlayerControls);
    const { duration, setDuration } = useContext(PlayerControls);
    const { progress, setProgress } = useContext(PlayerControls);
    const { isLooping, setIsLooping } = useContext(PlayerControls);
    const { isPlaying, setIsPlaying } = useContext(PlayerControls);

    const getLikedSongs = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if(token){

                const {data} = await axios.get('https://api.spotify.com/v1/me/tracks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotal(data?.total);
                setFavourites(data?.items);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLikedSongs();
    }, [isFocused]);

    const loadmore = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if(token){

                const {data} = await axios.get(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOffset(offset + data?.offset);
                setFavourites(favourites.concat(data?.items));
                
            }
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <>
    <ScrollView onMomentumScrollEnd={loadmore} >
        <View style={{width: '100%', height: '100%', backgroundColor: 'lightblue', paddingHorizontal: 20, gap: 10}} >
        <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 100}} >Favourite Songs</Text>
        <Text>{total} Songs</Text>
        <View style={{height: 20}} />
        {
            favourites ? (
                <>
            {
                favourites.map((e, i) => (
                    <Tracks name={e?.track?.name} artists={e?.track?.album?.artists[0]?.name} index={i} uri={e?.track?.album?.images[0]?.url} isFavourite={true} trackUri={e?.track?.preview_url} track={e?.track} />
                ))
            }
                </>
            ) : (
                <>
                <View>
                    <Text>No Favourite Songs</Text>
                </View>
                </>
            )
        }
        </View>
    </ScrollView>

    {
        currentTrack ? (
            <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            width: "98%",
            padding: 10,
            marginBottom: -5,
            position: "absolute",
            borderRadius: 6,
            alignSelf: 'center',
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
                onPress={async function pause () {
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
                onPress={async function play(){
                  try {
                    currentSound.playAsync();
                    setIsPlaying(true);
                  } catch (error) {
                    
                  }
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
        ) : (null)
    }
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
                <Slider value={progress} upperLimit={progress}
                  style={{ width: "100%", height: 40, alignSelf: "center" }}
                  />
                  <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: -10, paddingHorizontal: 10}} >
                <Text>0:{Math.round(position/1000)}</Text>
                <Text>0:{Math.round(duration/1000)}</Text>
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
                  <AntDesign name="stepforward" size={30} color={"white"} />
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
</>
  )
}

export default Favourites

const styles = StyleSheet.create({})