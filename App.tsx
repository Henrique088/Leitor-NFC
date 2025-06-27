import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native'; 
import { ThemeProvider } from 'styled-components';
import themes from './src/theme'; 
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import LerScreen from './src/screens/LerScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  const DeviceTheme = useColorScheme();
  console.log('Device Theme:', DeviceTheme);
  const theme = themes[DeviceTheme === 'dark' ? 'dark' : 'light'];
  return (
    <ThemeProvider theme={theme}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} />
        <Stack.Screen name="Ler" component={LerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
