import AsyncStorage from "@react-native-async-storage/async-storage";

const getAccessToken = () => {
	let token = AsyncStorage.getItem("access-token");
	return token;
};

const getRefreshToken = () => {
	let token = AsyncStorage.getItem("refresh-token");
	return token;
};

const authStorage = {
	getAccessToken,
	getRefreshToken,
};
export default authStorage;
