import React, { useState } from "react";
import { View, TextInput } from "react-native";
import EmojiPicker from "emoji-picker-react";
// DOES NOT WORK
function EmojiTextInput(props) {
	const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

	const handleEmojiClick = (event, emojiObject) => {
		const { onEmojiSelected } = props;
		if (onEmojiSelected) {
			onEmojiSelected(emojiObject.emoji);
		}
	};

	const handleFocus = () => {
		setIsEmojiPickerVisible(true);
	};

	const handleBlur = () => {
		setIsEmojiPickerVisible(false);
	};

	return (
		<View>
			<TextInput {...props} onFocus={handleFocus} onBlur={handleBlur} />
			{isEmojiPickerVisible && <EmojiPicker onEmojiClick={handleEmojiClick} />}
		</View>
	);
}

export default EmojiTextInput;
