import client from "../client";
const endpoint = "/api/event";

const create = () => client.post(`${endpoint}`);

const start = ({ eventId }) => client.post(`${endpoint}/start/${eventId}`);

const updateEvent = ({ eventId, title, description, settings }) =>
	client.put(`${endpoint}/${eventId}`, { title, description, settings });

const getEvent = ({ eventId }) => client.get(`${endpoint}/${eventId}`);

const getEvents = ({ page }) => client.get(`${endpoint}/events/${page}`);

const eventApi = {
	create,
	start,
	updateEvent,
	getEvent,
	getEvents,
};
export default eventApi;
