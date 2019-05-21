import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import {
    getMetricMetaInfo,
    timeToString,
    getDailyReminderValue
} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciStepper';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';


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

        this.props.dispatch(addEntry({
            [key]: entry,
        }));

        this.setState(() => ({
            run:0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }))

        submitEntry({ key, entry });
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

    reset = () => {
        const key = timeToString();

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        removeEntry(key);
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name='md-happy'
                        size={100}
                     />
                    <Text> You already logged your information today.</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            );
        }

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

const mapStateToProps = (state) => {
    const key = timeToString();

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry);