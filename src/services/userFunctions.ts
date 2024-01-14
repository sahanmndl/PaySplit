import axios from "axios";
import {BASE_API_URL} from "../utils/Constants";

export const fetchUserDetails = async (userId: String) => {
    try {
        const response = await axios.post(`http://${BASE_API_URL}:8008/api/user/userDetails`, {userId: userId})
        return response.data.user
    } catch (error) {
        console.error(error);
        return null;
    }
}