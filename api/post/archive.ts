import client from "../client";
const endpoint = "/api/archive";

const create = ({ eventId }) => client.post(`${endpoint}`, { eventId });

const deleteArchive = ({ eventId }) => client.delete(`${endpoint}/${eventId}`);

const getArchives = ({ page }) => client.get(`${endpoint}/${page}`);

const archiveApi = {
	create,
	deleteArchive,
	getArchives,
};
export default archiveApi;
