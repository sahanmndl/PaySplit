import React, {useEffect, useState} from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import GroupItem from "../../../components/list-items/GroupItem";
import {BASE_API_URL} from "../../../utils/Constants";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import {Entypo} from "@expo/vector-icons";
import {ParamListBase, useIsFocused, useNavigation} from "@react-navigation/core";
import {StackNavigationProp} from "@react-navigation/stack";
import {FlashList} from "@shopify/flash-list";
import Colors from "../../../utils/Colors";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const AllGroupsView = () => {

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
    const insets = useSafeAreaInsets()
    const focused = useIsFocused()
    const [refresh, setRefresh] = useState(false)
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
            setRefresh(false)
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        fetchAllGroups()
    }

    useEffect(() => {
        focused && fetchAllGroups()
    }, [focused])

    return (
        <View
            style={{display: 'flex', flex: 1, paddingTop: insets.top, flexDirection: 'column', paddingHorizontal: 14}}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={{fontSize: 28, fontWeight: '700', color: 'white'}}>
                    Groups
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateJoinGroupView')}>
                    <Entypo name="dots-three-horizontal" size={20} color="white"/>
                </TouchableOpacity>
            </View>
            <View style={{height: 14}}/>
            {loading ? (
                <ActivityIndicator size={'small'} color={Colors.NIGHT_GREEN}/>
            ) : (
                <FlashList
                    data={groups}
                    estimatedItemSize={75}
                    keyExtractor={({_id}) => _id}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    //ListEmptyComponent={NoResults}
                    ItemSeparatorComponent={ItemSeparator}
                    removeClippedSubviews={false}
                    renderItem={({item}) => (
                        <GroupItem item={item}/>
                    )}
                />
            )}
        </View>
    )
}

export default AllGroupsView