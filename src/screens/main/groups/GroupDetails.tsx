import React, {useEffect, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {useRoute} from "@react-navigation/core";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import TextButton from "../../../components/buttons/TextButton";
import Colors from "../../../utils/Colors";
import * as Clipboard from 'expo-clipboard';
import {Toast} from "toastify-react-native";

const GroupDetails = () => {

    const route = useRoute()

    const [loading, setLoading] = useState(false)
    const [group, setGroup] = useState(null)

    const {groupId} = route.params

    const fetchGroupDetails = async (groupId: String) => {
        try {
            setLoading(true)
            await axios.post(`http://${BASE_API_URL}:8008/api/group/groupDetails`, {groupId: groupId})
                .then((response) => setGroup(response.data.group))
                .catch((e) => console.error(e))
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const copyGroupInviteCode = async () => {
        if (group && group.inviteCode) {
            await Clipboard.setStringAsync(group.inviteCode)
                .then(() => Toast.success("Copied to clipboard!"))
                .catch((e) => console.error(e))
        }
    }

    useEffect(() => {
        fetchGroupDetails(groupId)
    }, [])

    return (
        <View style={{display: 'flex', flex: 1, padding: 10}}>
            {loading || !group ? (
                <ActivityIndicator color={Colors.NIGHT_GREEN} size={'small'}/>
            ) : (
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontWeight: '300', color: 'white', fontSize: 15}}>
                        Invite Code:{" "}
                    </Text>
                    <TextButton
                        btnText={group ? group.inviteCode : ""}
                        handleFunction={() => copyGroupInviteCode()}
                        isDisabled={false}
                    />
                </View>
            )}
        </View>
    )
}

export default GroupDetails