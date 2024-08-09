import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthComponent from './Authentication';
import HomeComponent from './Home';
import CallComponent from './Call';

const Stack = createStackNavigator();

const AppComponent = () => {
  const [websocket, setWebsocket] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleAuthenticated = (ws, id) => {
    setWebsocket(ws);
    setUserId(id);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!websocket ? (
          <Stack.Screen name="Auth">
            {props => (
              <AuthComponent {...props} onAuthenticated={handleAuthenticated} />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {props => (
                <HomeComponent
                  {...props}
                  websocket={websocket}
                  userId={userId}
                  navigation={props.navigation}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Call">
              {props => (
                <CallComponent
                  {...props}
                  websocket={websocket}
                  userId={userId}
                  targetUserId={props.route.params.targetUserId}
                  isCaller={props.route.params.isCaller}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppComponent;
