import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Fonts, Colors } from "../../styles/theme";
import Avatar from "../avatar";
import Icon from "../core/icons";
import DefaultOptions from "../core/defaultOptions";
import dayjs from "dayjs";
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
					<Text
						style={{
							fontFamily: Fonts.small.fontFamily,
							fontSize: Fonts.small.fontSize,
							color: Colors.text,
						}}>
						{name}
					</Text>
					<Text
						style={{
							fontFamily: Fonts.small.fontFamily,
							fontSize: Fonts.small.fontSize,
							color: Colors.textSecondary,
						}}>
						| {dayjs(date).format("hh:mm YYYY-MM-DD")}
					</Text>
				</View>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}>
					{comment}
				</Text>
			</View>
			<DefaultOptions type={"comment"} id={commentId} size={20} horizontal />
		</View>
	);
}
