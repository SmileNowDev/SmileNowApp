import client from "../client";
const endpoint = "/api/post";

const create = ({ eventId, caption }) =>
	client.post(`${endpoint}/${eventId}`, { caption });

const getPosts = ({ eventId, page }) =>
	client.get(`${endpoint}/event/${eventId}/${page}`);

const getPost = ({ postId }) => client.get(`${endpoint}/${postId}`);

const updatePost = ({ postId, caption }) =>
	client.put(`${endpoint}/${postId}`, { caption });

const getPostCache = ({ eventId }) =>
	client.get(`${endpoint}/cache/${eventId}`);

const uploadImage = ({ formData, postId }) =>
	client.post(`${endpoint}/upload/${postId}`, formData);

const postApi = {
	create,
	getPosts,
	getPost,
	uploadImage,
	getPostCache,
	updatePost,
};
export default postApi;
