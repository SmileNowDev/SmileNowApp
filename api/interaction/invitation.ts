import client from "../client";
const endpoint = "/api/invitation";

const create = ({ event, invitee }) =>
	client.post(`${endpoint}`, { event, invitee });

const deleteInvitation = ({ invitationId }) =>
	client.delete(`${endpoint}/${invitationId}`);
const accept = ({ invitationId }) =>
	client.post(`${endpoint}/accept/${invitationId}`);

const getInvitations = ({ page }) => client.get(`${endpoint}/${page}`);

const invitationApi = {
	create,
	deleteInvitation,
	accept,
	getInvitations,
};
export default invitationApi;
