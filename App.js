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
  ImageBackground,
  Image,
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
import SignInScreen from './components/SignInScreen';
import {facebookService} from './components/FacebookService';

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
        {facebookService.makeLogoutButton(accessToken => {
          this.logout();
        })}
      </View>
    );
  }
  logout() {
    this.props.navigation.navigate('AuthLoading');
  }
}
class DetailsScreen extends React.Component {
  static navigationOptions = {header: null};
  render() {
    const {navigation} = this.props;
    const {item} = this.props.navigation.state.params;
    {
      console.log(item);
    }
    // const {imageUrl} = this.props.navigation.state.params.item.item.image_url;
    return (
      <View>
        <View
          style={{
            width: '100%',
            height: '93%',
            flexDirection: 'row',
            margin: 3,
          }}>
          <Image
            style={{width: '100%', height: '100%', position: 'absolute'}}
            source={{
              uri: this.props.navigation.state.params.item.item.image_url,
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              alignSelf: 'flex-end',
            }}>
            <Text style={{color: 'white', fontSize: 20, margin: 6}}>
              #{item.item.rank}.{item.item.title}
            </Text>
            <Text style={{color: 'white', margin: 6}}>
              Episodes:{item.item.episodes}
            </Text>
            <Text style={{color: 'white', margin: 6}}>
              Score:{item.item.score}
            </Text>
            <Text style={{color: 'white', margin: 6}}>
              StartDate:{item.item.start_date}
            </Text>
          </View>
        </View>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
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
