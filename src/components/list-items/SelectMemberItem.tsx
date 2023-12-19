import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import UserAvatar from 'react-native-user-avatar';
import {Checkbox} from "expo-checkbox";
import {useSelectedMembersStore} from "../../store";

let selectedMembers = [];
let temp = []

const SelectMemberItem = ({item}) => {

    //const [checked, setChecked] = useState(false)
    const isChecked = useSelectedMembersStore((state) => state.selectedMembers.includes(item));
    const toggleSelectedMember = useSelectedMembersStore((state) => state.toggleSelectedMember);

    // const handleCheckboxChange = () => {
    //     if (!checked) {
    //         selectedMembers.push(item)
    //     } else {
    //         temp = selectedMembers.filter((member) => member._id !== item._id)
    //         selectedMembers = temp
    //         temp = []
    //     }
    //     setChecked(!checked)
    // }

    return (
        <TouchableOpacity style={{borderRadius: 8, elevation: 4, minHeight: 75}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 0.15, alignItems: 'center', justifyContent: 'center'}}>
                    <UserAvatar size={48} name={item.name} bgColors={['#ffffff', '#606060', '#ef78b4']}/>
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
                    <Checkbox style={{borderRadius: 100, height: 24, width: 24}} value={isChecked}
                              onValueChange={() => toggleSelectedMember(item)}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SelectMemberItem