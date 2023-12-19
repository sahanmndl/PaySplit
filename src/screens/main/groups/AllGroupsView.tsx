import React, {useEffect, useState} from "react";
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import GroupItem from "../../../components/list-items/GroupItem";
import {BASE_API_URL} from "../../../utils/Constants";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import {Entypo} from "@expo/vector-icons";
import {ParamListBase, useIsFocused, useNavigation} from "@react-navigation/core";
import {StackNavigationProp} from "@react-navigation/stack";

const AllGroupsView = () => {

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
    const focused = useIsFocused()
    const [loading, setLoading] = useState(true)
    const [groups, setGroups] = useState([])

    const fetchGroupDetails = async (groupId: String) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/group/groupDetails`, {groupId: groupId})
            return response.data.group
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const fetchAllGroups = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'))
        try {
            setLoading(true)
            await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: user._id})
                .then(async (response) => {
                    const groupDetailsPromises = response.data.user.groups.map(async (groupId: String) => {
                        return await fetchGroupDetails(groupId)
                    })
                    const groupDetails = await Promise.all(groupDetailsPromises)
                    setGroups(groupDetails.filter((group) => group !== null))
                })
                .catch((e) => console.error(e))
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        focused && fetchAllGroups()
    }, [focused])

    return (
        <SafeAreaView style={{display: 'flex', flex: 1}}>
            <View style={{
                flex: 0.1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 14
            }}>
                <Text style={{fontSize: 36, fontWeight: '700', color: 'white'}}>
                    Groups
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateJoinGroupView')}>
                    <Entypo name="dots-three-horizontal" size={24} color="white"/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 0.9, paddingHorizontal: 14, marginTop: 10}}>
                <FlatList
                    data={groups}
                    keyExtractor={({_id}) => _id}
                    // refreshing={refresh}
                    // onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    //ListEmptyComponent={NoResults}
                    ItemSeparatorComponent={ItemSeparator}
                    initialNumToRender={20}
                    removeClippedSubviews={false}
                    renderItem={({item}) => (
                        <GroupItem item={item}/>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

export default AllGroupsView