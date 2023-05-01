import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Fonts, Colors } from "../styles/theme";
import Avatar from "./avatar";
import Icon from "./icons";
import DefaultOptions from "./defaultOptions";
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
			}}
		>
			<View>
				<Avatar pic={pic} size={30} id={userId} />
			</View>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
					}}
				>
					{name}
				</Text>
				<Text
					style={{
						fontFamily: Fonts.handWriting.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}
				>
					{comment}
				</Text>
			</View>
			<DefaultOptions type={"comment"} id={commentId} size={20} />
		</View>
	);
}
