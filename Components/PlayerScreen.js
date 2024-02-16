import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Player } from "../Conexts/Player";
import { AntDesign, Entypo } from '@expo/vector-icons';
import PlayerModel from './PlayerModel';
import { Model } from '../Conexts/PlayerModelContext';
import { PlayerControls } from '../Conexts/PlayerControls';

const PlayerScreen = ({name, uri, track, artists, visible, trackList}) => {
  const {isPlaying, setIsPlaying} = useContext(PlayerControls);
  const {modalVisible, setModalVisible} = useContext(Model);

  return (
    <>
          <Pressable
        onPress={() => setModalVisible(!visible)}
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
            source={{ uri: uri }}
            style={{ width: 55, height: 55 }}
          />
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 3 }}
          >
            <Text
              numberOfLines={1}
              style={{ fontSize: 12, fontWeight: "bold", color: "gray" }}
            >
              {name}
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 14, fontWeight: "bold", color: "gray" }}
            >
              {artists}
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
                  track?.pauseAsync();
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
                  track.playAsync();
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
      <PlayerModel name={name} artists={artists} uri={uri} track={track} visible={modalVisible} queue={trackList} />
      </>
  )
}

export default PlayerScreen

const styles = StyleSheet.create({});