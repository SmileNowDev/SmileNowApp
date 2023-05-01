import React, { useState } from "react";

import {
	View,
	Text,
	SafeAreaView,
	Image,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import { Picture } from "./avatar";
import ModalWrapper from "./core/modalWrapper";
import OtherProfile from "./otherProfile";
import { ButtonStyles } from "../styles/styles";
import DefaultOptions from "./defaultOptions";

interface UserCardProps {
	profilePicture: string;
	name: string;
	username: string;
	id: string;
	onPress?: () => void;
	rightElement?: React.ReactNode;
}
export default function UserCard({
	profilePicture,
	name,
	username,
	id,
	onPress,
	rightElement,
}: UserCardProps) {
	const [modalVisible, setModalVisible] = useState(false);
	function handlePress() {
		if (!onPress) setModalVisible(true);
		else onPress();
	}
	return (
		<>
			<TouchableOpacity style={styles.container} onPress={handlePress}>
				<Picture pic={profilePicture} size={40} />
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}
					>
						{name}
					</Text>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize - 2,
							color: Colors.textSecondary,
						}}
					>
						@{username}
					</Text>
				</View>
				{rightElement ? rightElement : <></>}
			</TouchableOpacity>
			<ModalWrapper
				visible={modalVisible}
				setVisible={setModalVisible}
				fullHeight={false}
				scrollable={false}
				noSwipe={false}
			>
				<View
					style={{
						position: "absolute",
						right: 0,
						top: 0,
						zIndex: 100,
					}}
				>
					<DefaultOptions
						type={"user"}
						id={id}
						size={20}
						onPress={() => setModalVisible(false)}
					/>
				</View>

				<OtherProfile id={id} />
				<TouchableOpacity
					onPress={() => setModalVisible(false)}
					style={{
						...ButtonStyles.button,
						...ButtonStyles.outlined,
						marginTop: 50,
					}}
				>
					<Text>Close</Text>
				</TouchableOpacity>
			</ModalWrapper>
		</>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 10,
		paddingVertical: 10,
	},
});
