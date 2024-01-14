import React from "react";
import {Text, View} from "react-native";
import LottieView from 'lottie-react-native';
import Colors from "../../utils/Colors";

const NoResultsView = ({type}) => {

    return (
        <View style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <LottieView
                autoPlay
                style={{
                    width: 200,
                    height: 200,
                }}
                source={require('../../../assets/animations/no-results.json')}
            />
            <Text style={{fontSize: 20, fontWeight: '600', color: Colors.WHITISH2, textAlign: 'center', marginTop: 20}}>
                No {type === 1 ? "Payments" : type === 2 ? "Groups" : "Results"} found!
            </Text>
        </View>
    )
}

export default NoResultsView