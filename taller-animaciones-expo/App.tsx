import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import type { ComponentType } from 'react';

import DragRotateScreen from './src/screens/DragRotateScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import MultitouchScreen from './src/screens/MultitouchScreen';
import BounceScreen from './src/screens/BounceScreen';
import CarouselScreen from './src/screens/CarouselScreen';
import ShakeScreen from './src/screens/ShakeScreen';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type ScreenItem = {
  name: string;
  title: string;
  component: ComponentType;
  icon: IconName;
};

const Drawer = createDrawerNavigator();

const screens: ScreenItem[] = [
  { name: 'Drag', title: '1. Drag & Drop con rotación', component: DragRotateScreen, icon: 'move' },
  { name: 'Loading', title: '2. Animación de carga', component: LoadingScreen, icon: 'sync' },
  { name: 'Multitouch', title: '3. Gestos multitouch', component: MultitouchScreen, icon: 'image' },
  { name: 'Bounce', title: '4. Animación Bounce', component: BounceScreen, icon: 'radio-button-on' },
  { name: 'Carousel', title: '5. Carrusel animado', component: CarouselScreen, icon: 'albums' },
  { name: 'Shake', title: '6. Acelerómetro (Shake)', component: ShakeScreen, icon: 'phone-portrait' },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Drawer.Navigator
          initialRouteName="Drag"
          screenOptions={{
            // Se desactiva el swipe del drawer para no chocar con los gestos de los ejercicios.
            // El menú se abre con el botón de hamburguesa del header.
            swipeEnabled: false,
            headerStyle: { backgroundColor: '#6C5CE7' },
            headerTintColor: '#fff',
            drawerActiveTintColor: '#6C5CE7',
          }}
        >
          {screens.map((s) => (
            <Drawer.Screen
              key={s.name}
              name={s.name}
              component={s.component}
              options={{
                title: s.title,
                drawerLabel: s.title,
                drawerIcon: ({ color, size }) => <Ionicons name={s.icon} size={size} color={color} />,
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
