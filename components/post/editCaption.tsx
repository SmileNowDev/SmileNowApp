import React, { useState } from "react";
import { TextInput, View, Alert } from "react-native";
import { Dim, GlobalStyles } from "../../styles/styles";
import { Colors } from "../../styles/theme";
import postApi from "../../api/post/post";
import { Button, Text } from "../SmileNowUI";
interface EditCaptionProps {
	postId: string;
	caption: string;
	refresh: () => void;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function EditCaption({
	postId,
	caption,
	refresh,
	setVisible,
}: EditCaptionProps) {
	const [editCaption, setEditCaption] = useState(caption);

	async function updateCaption() {
		const result = await postApi.updatePost({ postId, caption: editCaption });
		if (result.ok) {
			refresh();
			setVisible(false);
			// toast
			Alert.alert("Caption Updated");
		}
	}
	return (
		<View
			style={{
				height: "100%",
				paddingTop: 50,
				gap: 10,
			}}>
			<Text>Edit Your Caption</Text>
			<TextInput
				numberOfLines={4}
				style={{
					...GlobalStyles.textInput,
					paddingVertical: 6,
					height: 60,
					verticalAlign: "top",
				}}
				placeholderTextColor={Colors.textSecondary}
				placeholder="Type your caption here"
				value={editCaption}
				onChangeText={setEditCaption}
				returnKeyType="done"
			/>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					gap: 5,
					paddingVertical: 5,
				}}>
				<Button
					onPress={() => {
						setEditCaption("");
						setVisible(false);
					}}
					variant="outlined"
					colorScheme="gray"
					style={{
						width: Dim.width / 2 - 22.5,
					}}>
					Discard Changes
				</Button>
				<Button
					onPress={updateCaption}
					style={{
						width: Dim.width / 2 - 22.5,
					}}>
					Save Changes
				</Button>
			</View>
		</View>
	);
}
