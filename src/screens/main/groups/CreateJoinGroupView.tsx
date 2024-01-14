import React, {useState} from "react";
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../../../utils/Colors";
import {TextInput} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {BASE_API_URL} from "../../../utils/Constants";
import {ParamListBase, useNavigation} from "@react-navigation/core";
import {StackNavigationProp} from "@react-navigation/stack";

const CreateJoinGroupView = () => {

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
    const [createLoading, setCreateLoading] = useState(false)
    const [joinLoading, setJoinLoading] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [inviteCode, setInviteCode] = useState("")

    const handleCreateGroup = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'))
        if (groupName.trim() === "") {
            Alert.alert("Error!", "Group name cannot be empty")
        } else {
            try {
                setCreateLoading(true)
                const requestBody = {
                    name: groupName.trim(),
                    userId: user._id
                }
                await axios.post(`http://${BASE_API_URL}:8008/api/group/createGroup`, requestBody)
                    .then((response) => {
                        console.log(response.data.group)
                        navigation.goBack()
                    })
                    .catch((e) => {
                        console.error(e)
                        Alert.alert("Error!", e.response.data.message)
                    })
            } catch (e) {
                console.error(e)
                Alert.alert("Error!", e.response.data.message)
            } finally {
                setCreateLoading(false)
            }
        }
    }

    const handleJoinGroup = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'))
        if (inviteCode.trim() === "") {
            Alert.alert("Error!", "Invite code cannot be empty")
        } else {
            try {
                setJoinLoading(true)
                const requestBody = {
                    userId: user._id,
                    inviteCode: inviteCode.trim()
                }
                await axios.post(`http://${BASE_API_URL}:8008/api/group/joinGroup`, requestBody)
                    .then((response) => {
                        console.log(response.data.group)
                        navigation.goBack()
                    })
                    .catch((e) => {
                        console.error(e.response.data)
                        Alert.alert("Error!", e.response.data.message)
                    })
            } catch (e) {
                console.error(e)
                Alert.alert("Error!", e.response.data.message)
            } finally {
                setJoinLoading(false)
            }
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
                padding: 14
            }}
            keyboardShouldPersistTaps={'never'}
            showsVerticalScrollIndicator={false}
        >
            <TextInput
                style={styles.textInput}
                mode='outlined'
                textColor={'white'}
                placeholder="Enter Group Name"
                placeholderTextColor={Colors.DARK_GRAY}
                maxLength={64}
                outlineColor={Colors.DARK_GRAY}
                activeOutlineColor={Colors.TEAL}
                value={groupName}
                onChangeText={name => setGroupName(name)}
            />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={createLoading || joinLoading}
                onPress={() => handleCreateGroup()}
            >
                {createLoading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>Create a new group</Text>
                }
            </TouchableOpacity>
            <View style={{height: 50}}/>
            <TextInput
                style={styles.textInput}
                mode='outlined'
                textColor={'white'}
                placeholder="Enter Invite Code"
                placeholderTextColor={Colors.DARK_GRAY}
                maxLength={64}
                outlineColor={Colors.DARK_GRAY}
                activeOutlineColor={Colors.TEAL}
                value={inviteCode}
                onChangeText={(code) => setInviteCode(code)}
            />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={createLoading || joinLoading}
                onPress={() => handleJoinGroup()}
            >
                {joinLoading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>Join group</Text>
                }
            </TouchableOpacity>
        </ScrollView>
    )
}

export default CreateJoinGroupView

const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        borderRadius: 4,
        color: 'white',
    },
    buttonSubmit: {
        height: 50,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.TEAL,
        borderRadius: 4,
        elevation: 4,
        marginTop: 30
    },
    btnText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700"
    }
})