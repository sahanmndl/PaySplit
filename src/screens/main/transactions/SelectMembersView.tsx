import React, {useState} from "react";
import {ParamListBase, useNavigation, useRoute} from "@react-navigation/core";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ItemSeparator from "../../../components/list-items/ItemSeparator";
import SelectMemberItem from "../../../components/list-items/SelectMemberItem";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../../utils/Colors";
import TextButton from "../../../components/buttons/TextButton";
import {TextInput} from "react-native-paper";
import {StackNavigationProp} from "@react-navigation/stack";
import NoResultsView from "../../../components/list-items/NoResultsView";

const SelectMembersView = () => {

    const route = useRoute()
    const insets = useSafeAreaInsets()
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

    const [selectedMembers, setSelectedMembers] = useState([])
    const [totalAmount, setTotalAmount] = useState("")

    const {allMembers, groupId} = route?.params || {allMembers: [], groupId: ""}

    return (
        <View style={{display: 'flex', flex: 1, paddingTop: insets.top}}>
            <View style={{display: 'flex', flexDirection: 'row', flex: 0.1, alignItems: 'center'}}>
                <TouchableOpacity style={{flex: 0.2}} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-sharp" size={34} color={Colors.TEAL}/>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                    flex: 0.6,
                }}>
                    Add Members
                </Text>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 0.2,
                }}>
                    <TextButton
                        btnText={"Next"}
                        isDisabled={selectedMembers.length === 0 || totalAmount.trim() === "" || parseFloat(totalAmount.trim()) === 0.0}
                        handleFunction={() => requestAnimationFrame(() => {
                            navigation.navigate('CreateTransactionView', {
                                selectedMembers: selectedMembers,
                                totalAmount: totalAmount,
                                groupId: groupId
                            })
                        })}
                    />
                </View>
            </View>
            <View style={{display: 'flex', flex: 0.1, paddingHorizontal: 8, marginTop: 10, marginBottom: 5}}>
                <TextInput
                    style={styles.textInput}
                    dense={true}
                    mode='outlined'
                    textColor={'white'}
                    keyboardType={'numeric'}
                    placeholder="(₹) Total Amount paid by you"
                    placeholderTextColor={Colors.DARK_GRAY}
                    maxLength={64}
                    outlineColor={Colors.DARK_GRAY}
                    activeOutlineColor={Colors.TEAL}
                    value={totalAmount}
                    onChangeText={amount => setTotalAmount(amount)}
                />
            </View>
            <FlatList
                style={{flex: 0.75}}
                data={allMembers}
                keyExtractor={({_id}) => _id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<NoResultsView type={3}/>}
                ItemSeparatorComponent={ItemSeparator}
                initialNumToRender={75}
                removeClippedSubviews={false}
                renderItem={({item}) => (
                    <SelectMemberItem
                        item={item}
                        selectedMembers={selectedMembers}
                        setSelectedMembers={setSelectedMembers}
                    />
                )}
            />
        </View>
    )
}

export default SelectMembersView

const styles = StyleSheet.create({
    textInput: {
        width: '100%',
        borderRadius: 4,
        backgroundColor: Colors.DARK,
        color: 'white',
    },
})