/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator, HeaderTitle} from 'react-navigation-stack';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';

const mockObj = {name: 'ted', index: 1, pet: {type: 'dog', age: 4}};

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  componentDidMount() {
    console.log('this props=>', this.props);
    fetch('https://api.jikan.moe/v3/top/anime/1/airing?subtype=airing')
      .then(response => response.json())
      // .then(data=>console.log('response data',data.top))
      .then(data => this.setState({data: data.top, isLoading: false}));
  }
  state = {isLoading: true, data: null, isVisible: false};
  render() {
    const {isLoading, data} = this.state;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={data}
              renderItem={item => (
                <Text style={styles.item}>
                  <Text
                    style={styles.title}
                    onPress={() => {
                      this.props.navigation.navigate('Details', {item: item});
                      console.log('ive been pressed');
                    }}>
                    # {item.index + 1}. {item.item.title}
                  </Text>
                </Text>
              )}
              keyExtractor={item => item.mal_id.toString()}
            />
          )}
        </View>
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}
class DetailsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    headerRight: () => <Text>{navigation.state.params.title}</Text>;
  };

  render() {
    const {navigation} = this.props;
    const {item} = this.props.navigation.state.params;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Details Screen</Text>
        <Text>{item.id}</Text>
        <Text>{item.item.title}</Text>
        <Text>{item.id}</Text>
        <Text>{item.id}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}
class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}
const AuthStack = createStackNavigator({SignIn: SignInScreen});

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  },
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  item: {
    display: 'flex',
    // justifyContent:"space-evenly",
    backgroundColor: '#f9c2ff',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    alignSelf: 'flex-start',
  },
  // arrow: {
  //   alignSelf:"flex-end"
  // }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
