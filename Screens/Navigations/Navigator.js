import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { Feather, Ionicons } from "@expo/vector-icons";
import UserProfile from "../UserProfile";
import HomeScreen from "../HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../Auth/LoginScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlayerScreen from "../PlayerScreen";
import Favourites from "../Favourites";
import SearchScreen from "../SearchScreen";

const Tab = createBottomTabNavigator();

function BottomTabs() {

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{tabBarStyle: {
      backgroundColor: 'orange'
    } }} >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarLabel: "Home",
        tabBarLabelStyle: {
          color: "black",
        },
        tabBarIcon: ({ focused }) =>
          focused ? (
            <Ionicons name="home" size={24} color="black" />
          ) : (
            <Ionicons name="home-outline" size={24} color="black" />
          ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        headerShown: false,
        tabBarLabel: "Search",
        tabBarLabelStyle: {
          color: "black",
        },
        tabBarIcon: ({ focused }) =>
          focused ? (
            <Feather name="search" size={24} color="black" />
          ) : (
            <Feather name="search" size={24} color="black" />
          ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={UserProfile}
      options={{
        headerShown: false,
        tabBarLabel: "Profile",
        tabBarLabelStyle: {
          color: "black",
        },
        tabBarIcon: ({ focused }) =>
          focused ? (
            <Ionicons name="person" size={24} color="black" />
          ) : (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
      }}
    />
    
  </Tab.Navigator>
  )
}

const Stack = createNativeStackNavigator();

function Navigation () {

  const [expired, setExpired] = useState(false);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     const expiry = await AsyncStorage.getItem("expiry");
  //     const issuedAt = await AsyncStorage.getItem("issue");
  
  //     if(token){
  //        const currentTime = Date.now();
  //        if(currentTime < expiry*1000 + parseInt(issuedAt)){
  //         console.log(currentTime < expiry + parseInt(issuedAt));
  //         setExpired(false);
  //        } else {
  //         await AsyncStorage.removeItem("token");
  //         await AsyncStorage.removeItem("expiry");
  //         await AsyncStorage.removeItem("issue");
  //         setExpired(true);
  //        }
  //     }
  //   }
  //   checkToken();
  //   }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}} />
        <Stack.Screen name="Favourites" component={Favourites} options={{headerShown: true, title: '', headerStyle: {backgroundColor: 'lightblue'}}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;