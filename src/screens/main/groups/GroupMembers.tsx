import React, {useEffect, useState} from "react";
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/core";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import MemberItem from "../../../components/list-items/MemberItem";
import Colors from "../../../utils/Colors";
import {Feather} from "@expo/vector-icons";
import {useCurrentUserStore} from "../../../store";

const GroupMembers = () => {

    let {currentUser} = useCurrentUserStore()
    currentUser = JSON.parse(currentUser)

    console.log("current: ", currentUser._id, typeof (currentUser))

    const route = useRoute()
    const focused = useIsFocused()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [members, setMembers] = useState([])

    const {groupId} = route.params

    const fetchUserDetails = async (userId: String) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: userId})
            return response.data.user
        } catch (e) {
            console.error(e)
        }
    }

    const fetchGroupMembers = async () => {
        try {
            setLoading(true)
            await axios.post(`http://${BASE_API_URL}:8008/api/group/groupDetails`, {groupId: groupId})
                .then(async (response) => {
                    const groupMembersPromises = response.data.group.members.map(async (userId: String) => {
                        return await fetchUserDetails(userId)
                    })
                    const memberDetails = await Promise.all(groupMembersPromises)
                    setMembers(memberDetails)
                })
                .catch((e) => console.error(e))
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        focused && fetchGroupMembers()
    }, [focused])

    const filteredMembers = members.filter((member) => member._id !== currentUser._id)

    return (
        <SafeAreaView style={{display: 'flex', flex: 1}}>
            <FlatList
                data={members}
                keyExtractor={({_id}) => _id}
                // refreshing={refresh}
                // onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                //ListEmptyComponent={NoResults}
                ItemSeparatorComponent={ItemSeparator}
                initialNumToRender={20}
                removeClippedSubviews={false}
                renderItem={({item}) => (
                    <MemberItem item={item}/>
                )}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => requestAnimationFrame(() => {
                    navigation.navigate('TransactionRoute', {
                        allMembers: filteredMembers,
                        groupId: groupId
                    })
                })}
            >
                <Feather name='plus' size={26} color='#FFF'/>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default GroupMembers

const styles = StyleSheet.create({
    fab: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 63,
        height: 63,
        position: 'absolute',
        bottom: 40,
        right: 28,
        backgroundColor: Colors.BLUE,
        borderRadius: 100,
        elevation: 2,
    },
})