import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciStepper';
import DateHeader from './DateHeader';

SubmitButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text> SUBMIT </Text>
        </TouchableOpacity>
    );
}

class AddEntry extends Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }

    submit = () => {
        const key = timeToString();
        const entry = this.state;

        this.setState(() => ({
            run:0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }))

        // TODO: Update Redux
        // Navigate to Home
        // Save to DB
        // Clear local notification
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric);

        this.setState((state) => {
            const count = state[metric] + step;
            return {
                ...state,
                [metric]: Math.min(max, count)
            }
        })
    }

    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step;
            return {
                ...state,
                [metric]: Math.max(0, count)
            }
        })
    }

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value,
        }))
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        return(
            <View>
                <DateHeader date={(new Date()).toLocaleString()} />
                {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest } = metaInfo[key];
                   const value = this.state[key];

                   return(
                       <View key={key}>
                        {getIcon()}
                        {type === 'slider'
                            ? <UdaciSlider 
                                value={value}
                                onChange={(value) => this.slide(key, value)}
                                {...rest}
                            />
                            : <UdaciSteppers
                                value={value}
                                onIncrement = {() => this.increment(key)}
                                onDecrement = {() => this.decrement(key)}
                                {...rest}
                            />
                        }
                       </View>
                   )
                })}
                <SubmitButton onPress={this.submit} />
            </View>
        );
    }   
}

export default AddEntry;