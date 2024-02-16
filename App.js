import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import Navigation from './Screens/Navigations/Navigator';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalPortal } from 'react-native-modals';
import { PlayerConext } from './Conexts/Player';
import { PlayerModelConext } from './Conexts/PlayerModelContext';
import { ControlsContext } from './Conexts/PlayerControls';

export default function App() {

  return (
    <>
    <ControlsContext>
    <PlayerModelConext>
    <PlayerConext>
    <Navigation />
    <ModalPortal />
    </PlayerConext>
    </PlayerModelConext>
    </ControlsContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
