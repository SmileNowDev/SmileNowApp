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
import OtherProfile from "./otherProfile";
import DefaultOptions from "./defaultOptions";
interface AvatarProps {
	pic: string;
	size: number;
	id: string;
}

export function Picture({ size, pic }) {
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
export default function Avatar({ pic, size = 40, id }: AvatarProps) {
	const { userId } = useContext(Context);
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);

	function handleNavigate() {
		if (id === userId) {
			// @ts-expect-error
			navigation.navigate("Profile");
		} else {
			setModalVisible(true);
		}
	}

	return (
		<>
			<TouchableOpacity onPress={() => handleNavigate()}>
				<Picture size={size} pic={pic} />
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
