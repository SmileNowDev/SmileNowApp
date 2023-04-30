import client from "../client";
const endpoint = "/api/comment";

const create = ({ postId, text }) =>
	client.post(`${endpoint}/${postId}`, { text });

const deleteComment = ({ postId }) => client.delete(`${endpoint}/${postId}`);

const getComments = ({ postId, page }) =>
	client.get(`${endpoint}/${postId}/${page}`);

const commentApi = {
	create,
	deleteComment,
	getComments,
};
export default commentApi;
