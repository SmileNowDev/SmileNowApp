import client from "../client";
const endpoint = "/api/user";

const get = ({ userId }) => client.get(`${endpoint}/${userId}`);

const updateUser = (update: {
	name?: string;
	username?: string;
	bio?: string;
	expoNotificationToken?: string;
}) => client.put(`${endpoint}`, update);

const uploadAvatar = ({ formData }) =>
	client.post(`${endpoint}/avatar`, formData);

const deleteAvatar = () => client.delete(`${endpoint}/avatar`);

const userApi = {
	get,
	updateUser,
	uploadAvatar,
	deleteAvatar,
};
export default userApi;
