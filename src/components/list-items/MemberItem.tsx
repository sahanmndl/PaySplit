import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import UserAvatar from 'react-native-user-avatar';

const MemberItem = ({item}) => {

    return (
        <TouchableOpacity style={{borderRadius: 8, elevation: 4, minHeight: 75}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 0.15, alignItems: 'center', justifyContent: 'center'}}>
                    <UserAvatar size={45} name={item ? item.name : ""} bgColors={['#ffffff', '#606060', '#ef78b4']}/>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 0.85,
                    paddingStart: 8,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>
                        {item ? item.name : "Loading..."}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default MemberItem