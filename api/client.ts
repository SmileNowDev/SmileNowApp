import { create } from "apisauce";
import authStorage from "../auth/storage";

const apiClient = create({
	baseURL: "https://smile-now-backend.herokuapp.com/",
	// baseURL: "http://localhost:4000/",
});

apiClient.addAsyncRequestTransform(async (request) => {
	const accessToken = await authStorage.getAccessToken();
	const refreshToken = await authStorage.getRefreshToken();

	if (!accessToken || !refreshToken) return;
	request.headers["authorization"] = "Bearer " + accessToken;
	request.headers["x-refresh"] = refreshToken;
});

export default apiClient;
