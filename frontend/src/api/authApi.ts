import axios from "axios";

const API_BASE_URL = "http://16.16.204.14:8081";

export const registerUser = async (payload: {
    name: string;
    email: string;
    password: string;
}) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, payload, {
        withCredentials: true,
    });
    return res.data;
};
