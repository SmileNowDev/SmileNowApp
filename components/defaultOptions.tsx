import React, { useEffect, useState } from "react";
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
import userApi from "../api/user/user";

interface DefaultOptionsProps {
	type: string;
	id: string;
	size?: number;
	onPress?: () => void;
	horizontal?: boolean;
}

export default function DefaultOptions({
	type,
	id,
	size = 20,
	onPress,
	horizontal = false,
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

	async function unblock() {
		const result = await blockApi.deleteBlocks({ userId: id });
		console.log({ result });
		if (result.ok) {
			Alert.alert("Unblock Successful", "You have unblocked this user");
			setModalVisible(false);
		}
	}
	const [blockedStatus, setBlockedStatus] = useState(false);
	async function getUser() {
		const result = await userApi.get({ userId: id });
		if (result.ok) {
			//@ts-expect-error
			setBlockedStatus(result.data.blockedStatus);
		}
	}
	useEffect(() => {
		getUser();
	}, [id]);

	return (
		<>
			<TouchableOpacity
				style={styles.reaction}
				onPress={() => setModalVisible(true)}
			>
				<Icon
					name={horizontal ? "more-horiz" : "more-vert"}
					size={size}
					color={Colors.textSecondary}
				/>
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
					// todo: alert feedback after block
					<TouchableOpacity
						style={styles.optionButton}
						onPress={() => {
							if (onPress) onPress();
							if (blockedStatus) {
								unblock();
							} else {
								block();
							}
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
							{!blockedStatus ? "Block" : "Unblock"}{" "}
							{type.substring(0, 1).toUpperCase() + type.substring(1)}
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
