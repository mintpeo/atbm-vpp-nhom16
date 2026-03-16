import { INFO_USER } from "./API_URL.jsx";

export const GetStoredUser = () => {
    const saved = localStorage.getItem(INFO_USER);
    if (!saved) return;

    try {
        return JSON.parse(saved); // array -> object
    } catch (error) {
        return console.log("ERROR GetStoreUser: ", error);
    }
};