import client from "../client";
const endpoint = "/api/friend";

const request = ({ userId }) => client.post(`${endpoint}/${userId}`);

const accept = ({ userId }) => client.put(`${endpoint}/${userId}`);

const deleteFriend = ({ userId }) => client.delete(`${endpoint}/${userId}`);

const getFriends = ({ status }) => client.delete(`${endpoint}/${status}`);

const friendApi = {
	request,
	accept,
	deleteFriend,
	getFriends,
};
export default friendApi;
