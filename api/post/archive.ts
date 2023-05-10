import client from "../client";
const endpoint = "/api/archive";

const create = ({ eventId }) => client.post(`${endpoint}`, { eventId });

const deleteArchive = ({ eventId }) => client.delete(`${endpoint}/${eventId}`);

const getArchives = ({ eventId, page }) =>
	client.get(`${endpoint}/${eventId}/${page}`);

const archiveApi = {
	create,
	deleteArchive,
	getArchives,
};
export default archiveApi;
