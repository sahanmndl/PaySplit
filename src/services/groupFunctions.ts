import axios from "axios";
import {BASE_API_URL} from "../utils/Constants";

export const fetchGroupDetails = async (groupId: String) => {
    try {
        await axios.post(`http://${BASE_API_URL}:8008/api/group/groupDetails`, {groupId: groupId})
            .then((response) => {
                return response.data.group
            })
            .catch((e) => {
                console.error(e)
                return null
            })
    } catch (e) {
        console.error(e)
        return null
    }
}