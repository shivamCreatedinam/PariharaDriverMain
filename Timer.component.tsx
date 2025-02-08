import React from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import type { Element as ReactElement } from 'react';
import BackgroundTimer from "react-native-background-timer";

type TimerProps = {};
type TimerState = {};

class TimerComponent extends React.PureComponent<TimerProps, TimerState> {

    static defaultProps: any
    constructor(props: TimerProps) {
        super(props);
        this.state = {
            second: 0,
        }
    }

    _interval: any;
    onStart = () => {
        if (Platform.OS == "ios") {
            BackgroundTimer.start();
        }

        this._interval = BackgroundTimer.setInterval(() => {
            this.setState({
                second: this.state.second + 1,
            })
        }, 1000);
    }

    onPause = () => {
        BackgroundTimer.clearInterval(this._interval);
    }

    onReset = () => {
        this.setState({
            second: 0,
        });
        BackgroundTimer.clearInterval(this._interval);
    }
} 

TimerComponent.propTypes = {};
TimerComponent.defaultProps = {};

export default TimerComponent;