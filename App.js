/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, View, Text, FlatList, Button, styles, style, StyleSheet } from 'react-native';
import { BleManager, Device, NativeDevice } from 'react-native-ble-plx';

export default class SensorsComponent extends Component {

  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {info: "", values: {}, devices: null, count: null, tasks: []}
    this.prefixUUID = "f000aa"
    this.suffixUUID = "-0451-4000-b000-000000000000"
    
    this.devices = [];
    this.count = 0;
  }
  


  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "hi ERROR: " + message})
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }
  }
  scanAndConnect() {
    this.manager.startDeviceScan(null,
                                 null, (error, device) => {
      this.info("Scanning...")
      
      
      if (error) {
        this.error(error.message)
        return
      }
      this.state.count++
      if(this.state.count>20)
      {
        this.manager.stopDeviceScan()
        this.info("Scanning Complete")
        console.log("stopping")
        this.setState({
          devices: this.devices
        })
        this.postDevices()
      }
      var devices = this.devices
      var duplicate = false
      for (let index = 0; index < devices.length; index++) {
        if (device.id == devices[index].id) {
          duplicate = true;
        }
        
      }
      if(!duplicate && device.name != null &&  device.id != " " &&  device.id != undefined &&  device.id != ""){
        console.log(device.name)
        console.log(device.id)
        devices.push({
          name: device.id, // mac address of the peripheral
          id: device.name // descriptive name given to the peripheral
        });
        this.devices = devices; // update the array of peripherals
      }
      
    });
  }

  postDevices(){
    
    var obj = '{"devices": ' + JSON.stringify(this.devices) + '}';

    fetch('https://bledevices.herokuapp.com/device', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: obj,
    }).then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  render() {
    return (
      <View>
    
        <Text>{this.state.info}</Text>
        
        <Text>List of Devices:</Text>
        <FlatList
          
          data={this.state.devices}
          renderItem={({ item }) =>
            <View>
              
                <Text>
                  {item.name}
                  {"\n"}
                  {item.id}
                </Text>
                
              
              
            </View>}
        />
      </View>
    )
  }
  styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5FCFF",
      padding: 10,
      paddingTop: 20
    },
    list: {
      width: "100%"
    },
    listItem: {
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 18
    },
    hr: {
      height: 1,
      backgroundColor: "gray"
    },
    listItemCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    textInput: {
      height: 40,
      paddingRight: 10,
      paddingLeft: 10,
      borderColor: "gray",
      width: "100%"
    }
  });
}
