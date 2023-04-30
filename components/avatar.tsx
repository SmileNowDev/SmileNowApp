import React, { useContext, useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Context } from "../providers/provider";
import { useNavigation } from "@react-navigation/native";
import ModalWrapper from "./core/modalWrapper";
import { ButtonStyles } from "../styles/styles";
import userApi from "../api/user/user";
import Icon from "./icons";
import { Fonts, Colors } from "../styles/theme";
import friendApi from "../api/user/friend";
interface AvatarProps {
	pic: string;
	size: number;
	id: string;
}
type FriendStatus = "stranger" | "requestedYou" | "requested" | "accepted";

export default function Avatar({ pic, size = 40, id }: AvatarProps) {
	const { userId } = useContext(Context);
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);
	const [name, setName] = useState("");
	const [userName, setUserName] = useState("");
	const [friendStatus, setFriendStatus] = useState<FriendStatus>("stranger");
	function Picture({ size }) {
		if (!pic) {
			return (
				<Image
					source={require("../assets/logo_color.png")}
					style={{
						width: size,
						height: size,
						borderRadius: size / 2,
					}}
				/>
			);
		} else {
			return (
				<Image
					source={{ uri: pic }}
					style={{
						width: size,
						height: size,
						borderRadius: size / 2,
					}}
				/>
			);
		}
	}
	async function getUser() {
		if (!id) {
			console.error("user id is undefined in avatar");
			return;
		}
		const response = await userApi.get({ userId: id });
		console.log(response.data);
		if (response.ok) {
			// @ts-expect-error
			setUserName(response.data.username);
			// @ts-expect-error
			setName(response.data.name);
			// @ts-expect-error
			setFriendStatus(response.data.friendStatus);
		}
	}
	function handleNavigate() {
		console.log(id, userId);
		if (id === userId) {
			// @ts-expect-error
			navigation.navigate("Profile");
		} else {
			getUser();
			setModalVisible(true);
		}
	}
	async function sendFriendRequest() {
		const result = await friendApi.request({ userId: id });
		if (result.ok) {
			setFriendStatus("requested");
		}
	}
	async function acceptFriendRequest() {
		const result = await friendApi.accept({ userId: id });
		if (result.ok) {
			setFriendStatus("accepted");
		}
	}
	async function removeFriend() {
		const result = await friendApi.deleteFriend({ userId: id });
		if (result.ok) {
			setFriendStatus("stranger");
		}
	}
	function ActionButton() {
		if (friendStatus === "stranger") {
			return (
				<TouchableOpacity
					onPress={() => sendFriendRequest()}
					style={{ ...ButtonStyles.button, ...ButtonStyles.primary }}>
					<Icon name="person-add" size={20} color="white" />
					<Text style={{ ...ButtonStyles.buttonText }}>
						Send Friend Request
					</Text>
				</TouchableOpacity>
			);
		}
		if (friendStatus === "requestedYou") {
			return (
				<>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							marginBottom: 10,
						}}>
						{name} wants to be friends!
					</Text>
					<TouchableOpacity
						onPress={() => acceptFriendRequest()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.success }}>
						<Icon name="person-add" size={20} color="white" />
						<Text style={{ ...ButtonStyles.buttonText }}>
							Accept Friend Request
						</Text>
					</TouchableOpacity>
				</>
			);
		}
		if (friendStatus === "requested") {
			return (
				<>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							marginBottom: 10,
							textAlign: "center",
						}}>
						Still waiting for {name} to add you back
					</Text>
					<TouchableOpacity
						onPress={() => removeFriend()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.gray }}>
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Friend Request Pending
						</Text>
					</TouchableOpacity>
				</>
			);
		}
		if (friendStatus === "accepted") {
			return (
				<>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							marginBottom: 10,
						}}>
						You're friends with {name}
					</Text>
					<TouchableOpacity
						onPress={() => removeFriend()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.gray }}>
						<Icon name="person-remove" size={20} color={Colors.text} />
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Remove Friend
						</Text>
					</TouchableOpacity>
				</>
			);
		}
	}
	return (
		<>
			<TouchableOpacity onPress={() => handleNavigate()}>
				<Picture size={size} />
			</TouchableOpacity>
			<ModalWrapper
				visible={modalVisible}
				setVisible={setModalVisible}
				fullHeight={false}
				scrollable={false}
				noSwipe={false}>
				<View
					style={{
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "flex-start",
					}}>
					<Picture size={80} />
					<Text
						style={{
							marginTop: 20,
							marginBottom: 5,
							fontFamily: Fonts.title.fontFamily,
							fontSize: Fonts.title.fontSize,
						}}>
						{name}
					</Text>
					<Text
						style={{
							fontFamily: Fonts.title.fontFamily,
							fontSize: Fonts.button.fontSize,
							color: Colors.textSecondary,
						}}>
						@{userName}
					</Text>
					<View style={{ paddingVertical: 30 }}>
						<ActionButton />
					</View>
					<TouchableOpacity
						onPress={() => setModalVisible(false)}
						style={{
							...ButtonStyles.button,
							...ButtonStyles.outlined,
							marginTop: 50,
						}}>
						<Text>Close</Text>
					</TouchableOpacity>
				</View>
			</ModalWrapper>
		</>
	);
}
