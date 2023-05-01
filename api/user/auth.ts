import client from "../client";
const endpoint = "/api/auth";

const cache = ({ phone }) => client.post(`${endpoint}/cache`, { phone });

const verify = ({ phone, code, password }) =>
	client.post(`${endpoint}/verify`, { phone, code, password });

const login = ({ phone, password }) =>
	client.post(`${endpoint}/session`, { phone, password });

const logout = ({ phone, password }) =>
	client.delete(`${endpoint}/session`, { phone, password });

const forgotPassword = ({ phone }) =>
	client.post(`${endpoint}/forgot-password`, { phone });

const newPassword = ({ phone, code, password }) =>
	client.post(`${endpoint}/new-password`, { phone, code });

const deleteAccount = () => client.delete(`${endpoint}`);

const authApi = {
	login,
	cache,
	verify,
	logout,
	forgotPassword,
	newPassword,
	deleteAccount,
};
export default authApi;
