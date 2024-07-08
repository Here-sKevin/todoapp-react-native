/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Suspense, useEffect } from 'react';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import HomeScreen from './pages/home/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Translations from './shared/context/TranslationsProvider';;
import SignUpScreen from './pages/signup/SignUpScreen';
import SignInScreen from './pages/signin/SignInScreen';
import { useTheme } from './styles/useTheme';
import { ActivityIndicator, Image, View } from 'react-native';
import DatabaseProvider from './shared/context/DatabaseProvider';
import useAuthentication from './shared/authentication/hooks/useAuthentication';
import TodoScreen from './pages/todo/TodoScreen';
import PhotoScreen from './pages/photo/PhotoScreen';
import { UserProvider } from './shared/context/UserContext';
import UsersScreen from './pages/users/UsersScreen';
import RNBootSplash  from "react-native-bootsplash";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackNav = () => {
  const { isAuthenticated } = useAuthentication();
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Todo" component={TodoScreen} />
          <Stack.Screen name="Photo" component={PhotoScreen} />
          <Stack.Screen name="Users" component={UsersScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};


const App: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true, duration: 500 });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);
  
  return (
    
    <Suspense fallback={<>
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator />
      </View>
    </>}>
      <ThemeProvider value={theme.navigation}>
        <UserProvider>
          <Translations>
            <DatabaseProvider>
              <NavigationContainer
                /*onReady={() => {
                  BootSplash.hide();
                }}*/
              >
                <Tab.Navigator screenOptions={{ headerShown: false }}>
                  <Tab.Screen
                    name="Tab"
                    component={StackNav}
                    options={{ 
                      tabBarLabel: 'Home', 
                      tabBarIcon: () => <Image source={require('./images/home.png')} /> }}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            </DatabaseProvider>
          </Translations>
        </UserProvider>
      </ThemeProvider>
    </Suspense>
    
  );
};

export default App;
