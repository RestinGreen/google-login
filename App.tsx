import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button, StyleSheet, View, Text, TouchableOpacity, Image, ViewComponent, ViewBase } from 'react-native';
import {default  as axios  } from 'axios'

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined)
  const [user, setUser] = React.useState<any>(null)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '244137863654-3e1nm7k68kjbt24c87p7sou920ab1jce.apps.googleusercontent.com',
    androidClientId: '244137863654-5fcghbjpu842g9lq2op94jrfiem3mv8h.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    console.log('-------------------------------------------------------')
    console.log('auth response', response)
    if (response?.type === 'success') {
      setAccessToken(response.authentication?.accessToken)
      accessToken && fetchUserInfo()
    }
  }, [response, accessToken]);

  async function fetchUserInfo() {
    console.log('fetching')

    var response: any = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    // const userInfo = JSON.parse(response.json)
    console.log(response.data)
    setUser(response.data)
  }


  const ShowUserInfo = (): any | null => {
    if (user) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20 }}> Welcome</Text>
          <Image source={{ uri: user.picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}> {user.name} </Text>
        </View>
      )
    } else {
      return null
    }
  }

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null &&
        <>
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}>Welcome</Text>
          <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20, color: 'gray' }}>Please log in</Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              borderBottomStartRadius: 5,
              borderBottomEndRadius: 5,
              borderTopEndRadius: 5,
              borderTopStartRadius: 5,
              borderWidth: 5,
              borderColor: 'green'
            }}
            disabled={!request}
            onPress={() => {
              promptAsync()
            }}
          >
            <Text>Login with Google</Text>
          </TouchableOpacity>
        </>
      }
    </View>
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