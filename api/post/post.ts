import client from "../client";
const endpoint = "/api/post";

const create = ({ eventId, caption }) =>
	client.post(`${endpoint}/${eventId}`, { caption });

const getPosts = ({ eventId, page }) =>
	client.get(`${endpoint}/event/${eventId}/${page}`);

const getPost = ({ postId }) => client.get(`${endpoint}/${postId}`);

const uploadImage = ({ formData, postId }) =>
	client.post(`${endpoint}/upload/${postId}`, formData);

const postApi = {
	create,
	getPosts,
	getPost,
	uploadImage,
};
export default postApi;
