import client from "../client";
const endpoint = "/api/attendee";

const join = ({ code }) => client.post(`${endpoint}`, { code });

const update = ({
	eventId,
	userId,
	isHost,
	muted,
}: {
	eventId: string;
	userId: string;
	isHost?: boolean;
	muted?: boolean;
}) => client.put(`${endpoint}/${eventId}/${userId}`, { isHost, muted });

const deleteAttendee = ({ eventId, userId }) =>
	client.delete(`${endpoint}/${eventId}/${userId}`);

const getAttendees = ({ eventId, page }) =>
	client.get(`${endpoint}/${eventId}/${page}`);

const attendeeApi = {
	join,
	update,
	deleteAttendee,
	getAttendees,
};
export default attendeeApi;
