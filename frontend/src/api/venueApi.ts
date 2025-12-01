import axios from "axios";

const API_URL = "http://16.16.204.14:8081/api/venues";

export const getAllVenues = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};
