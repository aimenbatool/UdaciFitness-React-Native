import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default TextButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text> {children} </Text>
        </TouchableOpacity>
    );
}