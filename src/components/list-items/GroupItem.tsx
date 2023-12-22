import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import {useNavigation} from "@react-navigation/core";

const GroupItem = ({item}) => {
    const navigation = useNavigation()
    console.log("Press: ", item._id)
    return (
        <TouchableOpacity
            style={{borderRadius: 8, elevation: 4, minHeight: 75}}
            onPress={() => requestAnimationFrame(() => {
                navigation.navigate('GroupDetailsRoute', {
                    groupId: item._id,
                })
            })}
        >
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesome name="group" size={32} color={Colors.DARK_GRAY}/>
                </View>
                <View style={{flex: 0.9, paddingStart: 15, justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>
                        {item.name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default GroupItem