import client from "../client";
const endpoint = "/api/comment";

const create = ({ postId, text }) =>
	client.post(`${endpoint}/${postId}`, { text });

const deleteComment = ({ postId }) => client.delete(`${endpoint}/${postId}`);

const commentApi = {
	create,
	deleteComment,
};
export default commentApi;
