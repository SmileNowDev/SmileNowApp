import client from "../client";
const endpoint = "/api/report";

const create = ({
	post,
	comment,
	user,
	reporter,
	message,
}: {
	post?: string;
	comment?: string;
	user?: string;
	reporter: string;
	message: string;
}) => client.post(`${endpoint}`, { post, comment, user, reporter, message });

const reportApi = {
	create,
};
export default reportApi;
