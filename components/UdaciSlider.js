import React from 'react';
import { View, Text, Slider, StyleSheet } from 'react-native';

export default UdaciSlider = ({ max, unit, step, value, onChange }) => {
    return(
        <View>
            <Slider
                step={step}
                value={value}
                maximumValue={max}
                minimumValue={0}
                onValueChange={onChange}
             />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    );
}