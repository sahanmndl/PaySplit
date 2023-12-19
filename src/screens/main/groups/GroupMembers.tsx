import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useIsFocused, useRoute} from "@react-navigation/core";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import MemberItem from "../../../components/list-items/MemberItem";
import Colors from "../../../utils/Colors";
import {Feather} from "@expo/vector-icons";
import BottomSheet, {BottomSheetFlatList, BottomSheetView} from "@gorhom/bottom-sheet";
import TextButton from "../../../components/buttons/TextButton";
import SelectMemberItem from "../../../components/list-items/SelectMemberItem";
import {useSelectedMembersStore} from "../../../store";

const GroupMembers = () => {

    const route = useRoute()
    const focused = useIsFocused()
    const [loading, setLoading] = useState(false)
    const [members, setMembers] = useState([])

    const {groupId} = route.params
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], [])

    const selectedMembers = useSelectedMembersStore((state) => state.selectedMembers);
    const toggleSelectedMember = useSelectedMembersStore((state) => state.toggleSelectedMember);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const fetchUserDetails = async (userId: String) => {
        try {
            const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: userId})
            return response.data.user
        } catch (e) {
            console.error(e)
            return null
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

    const renderItem = useCallback(
        ({item}) => (
            <SelectMemberItem item={item}/>
        ),
        []
    );

    console.log(selectedMembers)

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
                onPress={() => bottomSheetRef.current.snapToIndex(1)}
            >
                <Feather name='plus' size={26} color='#FFF'/>
            </TouchableOpacity>
            <BottomSheet
                backgroundStyle={{backgroundColor: Colors.DARK}}
                handleIndicatorStyle={{backgroundColor: 'white'}}
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
            >
                <BottomSheetView style={{display: 'flex', flex: 1, padding: 10}}>
                    <View style={{
                        display: 'flex',
                        flex: 0.1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{fontSize: 24, fontWeight: '700', color: 'white'}}>
                            Select Members
                        </Text>
                        <TextButton btnText={"NEXT →"} handleFunction={() => console.log("nexxt: ", selectedMembers)} isDisabled={false}/>
                    </View>
                    <BottomSheetFlatList
                        style={{display: 'flex', flex: 0.9}}
                        data={members}
                        keyExtractor={(i) => i}
                        renderItem={renderItem}
                    />
                </BottomSheetView>
            </BottomSheet>
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