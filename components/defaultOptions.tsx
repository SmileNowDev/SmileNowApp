import React, { useState } from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import Icon from "./icons";

import ModalWrapper from "./core/modalWrapper";
import { ButtonStyles } from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { Colors, Fonts } from "../styles/theme";
import blockApi from "../api/user/block";

interface DefaultOptionsProps {
	type: string;
	id: string;
	size?: number;
	onPress?: () => void;
}

export default function DefaultOptions({
	type,
	id,
	size = 20,
	onPress,
}: DefaultOptionsProps) {
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);
	async function block() {
		const result = await blockApi.create({ userId: id });
		if (result.ok) {
			Alert.alert("Block Successful", "You have blocked this user");
			setModalVisible(false);
		}
	}
	return (
		<>
			<TouchableOpacity
				style={styles.reaction}
				onPress={() => setModalVisible(true)}
			>
				<Icon name='more-vert' size={25} color={Colors.textSecondary} />
			</TouchableOpacity>
			<ModalWrapper
				visible={modalVisible}
				setVisible={setModalVisible}
				fullHeight={false}
				scrollable={false}
				noSwipe={false}
			>
				{/* subtitle text */}
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
						textAlign: "left",
						marginBottom: 20,
					}}
				>
					Options
				</Text>
				<TouchableOpacity
					style={styles.optionButton}
					onPress={() => {
						if (onPress) onPress();
						setModalVisible(false);
						// @ts-expect-error
						navigation.navigate("Report", { type: "post", id });
					}}
				>
					<Icon name='flag' size={25} color={Colors.urgent} />
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: 20,
							textAlign: "left",
						}}
					>
						Report {type.substring(0, 1).toUpperCase() + type.substring(1)}
					</Text>
				</TouchableOpacity>
				{type === "user" ? (
					<TouchableOpacity
						style={styles.optionButton}
						onPress={() => {
							if (onPress) onPress();
							block();
						}}
					>
						<Icon name='block' size={25} color={Colors.urgent} />
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: 20,
								textAlign: "left",
							}}
						>
							Block {type.substring(0, 1).toUpperCase() + type.substring(1)}
						</Text>
					</TouchableOpacity>
				) : (
					<></>
				)}
				{/* <TouchableOpacity style={styles.optionButton}>
					<Icon name='bookmark' size={25} color={Colors.textSecondary} />
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: 20,
							textAlign: "left",
						}}
					>
						Save
					</Text>
				</TouchableOpacity> */}

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
	reaction: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	optionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		padding: 16,
		gap: 10,
		backgroundColor: Colors.foreground,
		marginBottom: 10,
		borderRadius: 10,
	},
});
