import client from "../client";
const endpoint = "/api/attendee";

const join = ({ code }) => client.post(`${endpoint}`, { code });

const toggleHost = ({ eventId, userId }) =>
	client.put(`${endpoint}`, { eventId, userId });

const deleteAttendee = ({ eventId, userId }) =>
	client.delete(`${endpoint}`, { eventId, userId });

const getAttendees = ({ eventId }) => client.get(`${endpoint}/${eventId}`);

const attendeeApi = {
	join,
	toggleHost,
	deleteAttendee,
	getAttendees,
};
export default attendeeApi;