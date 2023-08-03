import client from "../client";
const endpoint = "/api/engagement";

const getAllWelcomeMessages = () =>
	client.get(`${endpoint}/allWelcomeMessages`);

const engagementApi = {
	getAllWelcomeMessages,
};
export default engagementApi;
