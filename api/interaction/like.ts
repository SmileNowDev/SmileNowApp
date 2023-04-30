import client from "../client";
const endpoint = "/api/like";

const create = ({ postId }) => client.post(`${endpoint}/${postId}`);

const deleteLike = ({ postId }) => client.delete(`${endpoint}/${postId}`);

const likeApi = {
	create,
	deleteLike,
};
export default likeApi;
