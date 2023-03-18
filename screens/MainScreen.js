import React, { Component } from 'react';
import {View, Text, Image, AsyncStorage, Platform} from 'react-native';
import CommonStyles from '../Styles/CommonStyles';
import FlipButton from '../components/FlipButton';
import RoundButton from '../components/RoundButton';
import LottieView from 'lottie-react-native';
import {AdMobBanner} from 'expo-ads-admob';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';

const coin_H = require('../assets/Coin_H.png');
const coin_T = require('../assets/Coin_T.png');
const lottieData = require('../assets/Lottie/data.json');

export default class MainScreen extends Component {

  constructor(props){
    super(props);
    this.state= {
      isReady: false,
      TotalResultCount : 0,
      isHeads: true,
      isTurning: false,
      imgText: '...Call it...',
     }
  }

  componentDidMount(){
    console.log("Start");
    this.getData();
  }

// Set results to 0 e.g reset
  resetGame = () => {
    this.setState({ 
      TailsResultCount : 0,
      HeadsResultCount : 0,
      TotalResultCount : 0,
      WinCount : 0,
      StreakCount: 0,
      TailsWinCount: 0,
      HeadsWinCount: 0,
      imgText: '...Call it...',
    }, () => {
      this.saveResults();
  });

  }  

  clearData = async () => {
    try {
      await AsyncStorage.removeItem('@TotalResultCount')
      await AsyncStorage.removeItem('@WinCount');
      await AsyncStorage.removeItem('@TailsResultCount');
      await AsyncStorage.removeItem('@HeadsResultCount');
      await AsyncStorage.removeItem('@HeadsWinCount');
      await AsyncStorage.removeItem('@TailsWinCount');
      await AsyncStorage.removeItem('@StreakCount');
    } catch (error) {
      console.log(error)
    }
  }

// Save current results state to local storage
  saveResults = async () => {
    try {

      let tails = this.state.TailsResultCount;
      let totalResult = this.state.TotalResultCount;
      let heads = this.state.HeadsResultCount;
      let wins = this.state.WinCount;
      let headsWins = this.state.HeadsWinCount;
      let tailsWins = this.state.TailsWinCount;
      let streak = this.state.StreakCount;

      await AsyncStorage.setItem('@TailsResultCount', tails.toString());
      await AsyncStorage.setItem('@HeadsResultCount', heads.toString());
      await AsyncStorage.setItem('@TotalResultCount', totalResult.toString());
      await AsyncStorage.setItem('@WinCount', wins.toString());
      await AsyncStorage.setItem('@StreakCount', streak.toString());
      await AsyncStorage.setItem('@HeadsWinCount', headsWins.toString());
      await AsyncStorage.setItem('@TailsWinCount', tailsWins.toString());

    } catch (e) {
      console.log(e);
    }
    
  }
// Load saved flip data from local storage
  getData = async () => {
    try {

      let tails = await AsyncStorage.getItem('@TailsResultCount')
      if(tails !== null) {
        // value previously stored
        let tailsInteger = parseInt(tails);
        this.setState({ 
          TailsResultCount : tailsInteger
        });
      }else{
        this.setState({ 
          TailsResultCount : 0
        });
      }
      
      let heads = await AsyncStorage.getItem('@HeadsResultCount')
      if(heads !== null) {
        // value previously stored
        let headsInteger = parseInt(heads);
        this.setState({ 
          HeadsResultCount : headsInteger
        });
      }else{
        this.setState({ 
          HeadsResultCount : 0
        });
      }

      let total = await AsyncStorage.getItem('@TotalResultCount')
      if(total !== null) {
        // value previously stored
        let totalResultInteger = parseInt(total);
        this.setState({ 
          TotalResultCount : totalResultInteger
        });
      }else{
        this.setState({ 
          TotalResultCount : 0
        });
      }

      let wins = await AsyncStorage.getItem('@WinCount')
      if(wins !== null) {
        // value previously stored
        let winsInteger = parseInt(wins);
        this.setState({ 
          WinCount : winsInteger
        });
      }else{
        this.setState({ 
          WinCount : 0
        });
      }

      let headsWins = await AsyncStorage.getItem('@HeadsWinCount')
      if(headsWins !== null) {
        // value previously stored
        let headsWinsInteger = parseInt(headsWins);
        this.setState({ 
          HeadsWinCount : headsWinsInteger
        });
      }else{
        this.setState({ 
          HeadsWinCount : 0
        });
      }

      let tailsWins = await AsyncStorage.getItem('@TailsWinCount')
      if(tailsWins !== null) {
        // value previously stored
        let tailsWinsInteger = parseInt(tailsWins);
        this.setState({ 
          TailsWinCount : tailsWinsInteger
        });
      }else{
        this.setState({ 
          TailsWinCount : 0
        });
      }
      
      let streak = await AsyncStorage.getItem('@StreakCount')
      if(streak !== null) {
        // value previously stored
        let streakInteger = parseInt(streak);
        this.setState({ 
          StreakCount : streakInteger
        });
      }else{
        this.setState({ 
          StreakCount : 0
        });
      }

    } catch(e) {
      // error reading value
      console.log(e);
    }
  }

// Main flip result logic
  TossAHeads = (choiceMade) => {
  
    let RandomNumber = Math.floor(Math.random() * 100) + 1 ;
    let lastWins = this.state.WinCount;
    let newWins = lastWins +1;
    let lastTotal = this.state.TotalResultCount;
    let newTotal = lastTotal + 1;

    // Choice made "Heads" expects RandomNumber even value. 
    // Choice made "Tails" expects RandomNumber odd value. 

    if (choiceMade == 'Heads' && RandomNumber%2 == 0) {
      this.setState({ 
        isHeads : true,
        isTurning: false,
        HeadsResultCount : this.state.HeadsResultCount + 1,
        HeadsWinCount: this.state.HeadsWinCount + 1,
        WinCount: newWins,
        StreakCount: this.state.StreakCount + 1,
        imgText: 'You won!',
        TotalResultCount : newTotal,
      }, () => {
        this.saveResults();
    });
    } else if (choiceMade == 'Heads' && RandomNumber%2 != 0){
      this.setState({ 
        isHeads : false,
        isTurning: false,
        TailsResultCount : this.state.TailsResultCount + 1,
        StreakCount: 0,
        imgText: 'You lost!',
        TotalResultCount : newTotal,
      }, () => {
        this.saveResults();
    });
    } else if (choiceMade == 'Tails' && RandomNumber%2 == 0){
      this.setState({ 
        isHeads : true,
        isTurning: false,
        HeadsResultCount : this.state.HeadsResultCount + 1,
        TotalResultCount : newTotal,
        StreakCount: 0,
        imgText: 'You lost!'
      }, () => {
        this.saveResults();
    });
    } else if (choiceMade == 'Tails' && RandomNumber%2 != 0){
        this.setState({ 
        isHeads : false,
        isTurning: false,
        TailsResultCount : this.state.TailsResultCount + 1,
        WinCount : newWins,
        TailsWinCount: this.state.HeadsWinCount + 1,
        StreakCount: this.state.StreakCount + 1,
        imgText: 'You won!',
        TotalResultCount : newTotal,
      }, () => {
        this.saveResults();
    });
    }
  }

// Set coin animation duration
  Flipping = (choice) => {

    if (choice == 'Heads'){
      this.setState({
        isTurning: true,
      });
    }else if(choice == 'Tails'){
      this.setState({
        isTurning: true,
      });
    }
    setTimeout(() => { this.TossAHeads(choice)      
    }, 1000);
  }

  bannerError = (e) => {
    console.log(e);
  }

  async _cacheResourcesAsync() {
    const images = [coin_H, coin_T];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    return Promise.all(cacheImages);
  }
  
  render() {

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); }

    let rate = 0;
    
    if ((this.state.TailsResultCount+this.state.HeadsResultCount)>=1) {
      rate = this.state.WinCount / (this.state.TailsResultCount + this.state.HeadsResultCount) * 100;
      rate = roundToTwo(rate);
    }

// Animation + image render
    let img;
    let imgText = this.state.imgText;

    if (this.state.isTurning) {
      imgText = '... Flipping ...';
    }

    if (this.state.isHeads && !this.state.isTurning) {
      img = <Image
      style={CommonStyles.coinImage}
      source={coin_H}
      resizeMode="contain"
    />;
    }else if(!this.state.isHeads && !this.state.isTurning){
      img = <Image
      style={CommonStyles.coinImage}
      source={coin_T}
      resizeMode="contain"
    />;
    }else if(this.state.isTurning){
      img = <LottieView
      style={CommonStyles.coinImage}
      source={lottieData}
      autoPlay = {true}
    />;
    }



    return (
      <View style={CommonStyles.mainContainer}>
            <View style = {CommonStyles.flipPic}>
              {img}
              <View style= {CommonStyles.flipPicTextBox}>
                <Text style = {{color: "white"}}>{imgText}</Text>
              </View>
            </View>
          
            <View style={CommonStyles.midContainer}>
              
              <View style = {CommonStyles.miniStats}>
                <View style={{
                  flexDirection:"row",
                  justifyContent:"space-evenly", 
                  alignItems:"space-between", 
                  }}>
                  <View style = {{flex: 0.1}}></View>
                  <View style={{flex: 0.55, alignItems: "flex-start"}}>
                    <Text style={CommonStyles.miniStatsText}>Total flips:</Text>
                    <Text style={CommonStyles.miniStatsText}>Total wins:</Text>
                    <Text style={CommonStyles.miniStatsText}>Win rate:</Text>
                    <Text style={CommonStyles.miniStatsText}>Current streak:</Text>
                  </View>
                  <View style={{flex: 0.35, alignItems: "flex-start", paddingRight: "5%"}}>
                    <Text style={CommonStyles.miniStatsText}>{this.state.TotalResultCount}</Text>
                    <Text style={CommonStyles.miniStatsText}>{this.state.WinCount}</Text>
                    <Text style={CommonStyles.miniStatsText}>{rate} %</Text>
                    <Text style={CommonStyles.miniStatsText}>{this.state.StreakCount}</Text>
                  </View>
                </View>
              </View>
              <View style = {CommonStyles.midButton}>
                <RoundButton 
                text = "Reset" 
                effect = {() => this.resetGame()} 
                size = {0.25}
                />
              </View>
            </View>
            
            <Text style = {{ marginBottom: 10, fontSize: 14}}>Choose & flip</Text>
            <View style={{flexDirection: "row", justifyContent: "center"}}>
              <FlipButton imageSource = {require('../assets/FlipButton_left.png')} effect = {() => this.Flipping('Heads')} disabled = {this.state.isTurning} activeOpacity={this.state.isTurning ? 1 : 0.5}/>
              <FlipButton imageSource = {require('../assets/FlipButton_right.png')} effect = {() => this.Flipping('Tails')} disabled = {this.state.isTurning} activeOpacity={this.state.isTurning ? 1 : 0.5}/>
            </View>

            <View style= {{marginTop: 24}}>
              <AdMobBanner
              bannerSize="banner"
              adUnitID={Platform.OS === "ios" ? "ca-app-pub-2747359744303492/3689230045" : "ca-app-pub-2747359744303492/5681802711"}
              servePersonalizedAds // true or false
              onDidFailToReceiveAdWithError={ (e) => this.bannerError(e)} 
              />
            </View>
          </View>  
    );
  }
}
 
// Round to two decimal points
function roundToTwo(num){    
  return + (Math.round(num + "e+2")  + "e-2");
}