import React, { useState } from "react";
import { Text, TextInput, View, Alert, TouchableOpacity } from "react-native";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import { Colors } from "../../styles/theme";
import postApi from "../../api/post/post";
import Icon from "../../components/core/icons";
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
			<TouchableOpacity
				onPress={updateCaption}
				style={{
					...ButtonStyles.button,
					...ButtonStyles.primary,
				}}>
				<Icon name="save" size={20} color="white" />
				<Text
					style={{
						...ButtonStyles.buttonText,
						color: Colors.background,
					}}>
					Save Changes
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => setVisible(false)}
				style={{
					...ButtonStyles.button,
					...ButtonStyles.outlined,
				}}>
				<Icon name="cancel" size={20} color={Colors.textSecondary} />
				<Text
					style={{
						...ButtonStyles.buttonText,
						color: Colors.text,
					}}>
					Cancel
				</Text>
			</TouchableOpacity>
		</View>
	);
}
