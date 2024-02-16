import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const LikedSongs = () => {


  return (
    <SafeAreaView style={{width: '100%', height: '100%', marginTop: 10}} >
      <FlatList  />
    </SafeAreaView>
  )
}

export default LikedSongs

const styles = StyleSheet.create({})