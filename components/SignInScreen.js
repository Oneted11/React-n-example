import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
  Text,
} from 'react-native';
import {facebookService} from './FacebookService';
class SignInScreen extends React.Component {
  static navigationOptions = {header: null};
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Button title="Sign in!" onPress={this._signInAsync} /> */}
        <View style={styles.container}>
          {facebookService.makeLoginButton(accessToken => {
            this.login();
          })}
        </View>
      </View>
    );
  }
  login() {
    this.props.navigation.navigate('App');
  }
  //   _signInAsync = async () => {
  //     await AsyncStorage.setItem('userToken', 'abc');
  //     this.props.navigation.navigate('App');
  //   };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
export default SignInScreen;
