import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Stack = createStackNavigator();

export default function Auth() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
