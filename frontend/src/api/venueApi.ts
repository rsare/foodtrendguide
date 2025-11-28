import axios from "axios";

const API_URL = "http://localhost:8081/api/venues";

export const getAllVenues = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};
