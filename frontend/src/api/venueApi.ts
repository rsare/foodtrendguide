import axios from "axios";

const API_URL = "/api/venues";

export const getAllVenues = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};