import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import UserAvatar from 'react-native-user-avatar';
import {Checkbox} from "expo-checkbox";

const SelectMemberItem = ({item, selectedMembers, setSelectedMembers}) => {

    const [checked, setChecked] = useState(false)

    const handleCheckboxChange = () => {
        let updatedMembers: any[];

        if (!checked) {
            updatedMembers = [...selectedMembers, item];
        } else {
            updatedMembers = selectedMembers.filter((member) => member._id !== item._id);
        }

        setSelectedMembers(updatedMembers);
        setChecked(!checked);
    }

    return (
        <TouchableOpacity style={{borderRadius: 8, elevation: 4, minHeight: 75}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 0.15, alignItems: 'center', justifyContent: 'center'}}>
                    <UserAvatar size={45} name={item.name} bgColors={['#ffffff', '#606060', '#ef78b4']}/>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 0.75,
                    paddingStart: 8,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>
                        {item.name}
                    </Text>
                </View>
                <View style={{
                    display: 'flex',
                    flex: 0.1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Checkbox
                        style={{borderRadius: 100, height: 22, width: 22}}
                        value={checked}
                        onValueChange={handleCheckboxChange}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SelectMemberItem