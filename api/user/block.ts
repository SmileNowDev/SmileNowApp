import client from "../client";
const endpoint = "/api/block";

const create = ({ userId }) => client.post(`${endpoint}/${userId}`);

const deleteBlocks = ({ userId }) => client.delete(`${endpoint}/${userId}`);

const getBlocks = ({ page }) => client.get(`${endpoint}/${page}`);

const blockApi = {
	create,
	deleteBlocks,
	getBlocks,
};
export default blockApi;
