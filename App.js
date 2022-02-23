import React, { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GalleryScreen } from './components';
import style from './assets/index.css';

export default function App() {
  useEffect(() => {
     document.title = "Kガチャ";  
  }, []);
  return (
    <div>
      <GalleryScreen />
    </div>
  );
}