import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const UserProfile = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={{width: '100%', height: '100%', padding: 20}} >
        <Pressable onPress={() => {AsyncStorage.removeItem("token"); AsyncStorage.removeItem("expiry"); AsyncStorage.removeItem("issue"); navigation.navigate("Login") }} style={{backgroundColor: 'gray', padding: 12, borderRadius: 10,}} >
          <Text style={{color: 'white'}} >Log-Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default UserProfile

const styles = StyleSheet.create({})