import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Row = (props) => (
  <View style={ styles.container }>
    <Text style={ styles.text }>
      {`${props.menu_name}`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        height: 30,
        fontSize: 20
    }
})

export default Row;
