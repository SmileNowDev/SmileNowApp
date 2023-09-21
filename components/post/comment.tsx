import React from "react";
import { View } from "react-native";
import { Fonts, Colors } from "../../styles/theme";
import Avatar from "../avatar";
import DefaultOptions from "../core/defaultOptions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Text } from "../SmileNowUI";
dayjs.extend(relativeTime);
interface Comment {
	pic: string;
	name: string;
	comment: string;
	date: string;
	commentId: string;
	userId: string;
}
export default function Comment({
	pic,
	name,
	comment,
	date,
	commentId,
	userId,
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "flex-start",
				alignItems: "flex-start",
				paddingVertical: 5,
				paddingHorizontal: 10,
				gap: 10,
				marginBottom: 5,
			}}>
			<View>
				<Avatar pic={pic} size={30} id={userId} />
			</View>
			<View style={{ flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "center",
						flex: 1,
						gap: 3,
					}}>
					<Text variant="small">{name}</Text>
					<Text colorScheme="textSecondary" variant="small">
						| {dayjs(date).fromNow()}
					</Text>
				</View>

				<Text>{comment}</Text>
			</View>
			<DefaultOptions type={"comment"} id={commentId} size={20} horizontal />
		</View>
	);
}
