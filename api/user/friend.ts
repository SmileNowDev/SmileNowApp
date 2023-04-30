import client from "../client";
const endpoint = "/api/friend";

const request = ({ userId }) => client.post(`${endpoint}/${userId}`);

const accept = ({ userId }) => client.put(`${endpoint}/${userId}`);

const deleteFriend = ({ userId }) => client.delete(`${endpoint}/${userId}`);

const getMyFriends = ({ page }) => client.get(`${endpoint}/MyFriends/${page}`);

const getMyRequests = ({ page }) =>
	client.get(`${endpoint}/myRequests/${page}`);

const getRequestingMe = ({ page }) =>
	client.get(`${endpoint}/requestingMe/${page}`);

const friendApi = {
	request,
	accept,
	deleteFriend,
	getMyFriends,
	getMyRequests,
	getRequestingMe,
};
export default friendApi;
