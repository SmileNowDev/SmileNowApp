import React, { useContext, useState } from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	ActivityIndicator,
} from "react-native";
import { Context } from "../providers/provider";
import { useNavigation } from "@react-navigation/native";
import ModalWrapper from "./core/modalWrapper";
import { ButtonStyles } from "../styles/styles";
import { Fonts, Colors } from "../styles/theme";
import friendApi from "../api/user/friend";
import OtherProfile from "./otherProfile";
import DefaultOptions from "./core/defaultOptions";
import Icon from "./core/icons";
interface AvatarProps {
	pic: string;
	size: number;
	id: string;
}

export function Picture({ size, pic }) {
	const [photoLoading, setPhotoLoading] = useState(false);
	function getLoaderSize(): "small" | "large" | number {
		if (size > 70) {
			return "large";
		} else if (size < 25) {
			return "small";
		} else {
			return 20;
		}
	}

	return (
		<View
			style={{
				position: "relative",
				shadowOpacity: 0.25,
				shadowOffset: { width: 0, height: 0 },
				shadowRadius: 5,
				elevation: 2,
				backgroundColor: Colors.background,
				borderRadius: size / 2,
			}}>
			{!pic ? (
				<View
					style={{
						width: size,
						height: size,
						overflow: "hidden",
						borderRadius: size / 2,
					}}>
					<Icon
						name="person"
						size={size}
						color={Colors.textSecondary}
						style={{
							transform: [
								{
									translateY: size / 6,
								},
							],
						}}
					/>
				</View>
			) : (
				<>
					<View style={{ position: "absolute", height: size, width: size }}>
						{photoLoading ? (
							<ActivityIndicator
								size={getLoaderSize()}
								color={Colors.primary}
								style={{
									zIndex: 100,
									position: "absolute",
									top: 0,
									bottom: 0,
									right: 0,
									left: 0,
								}}
							/>
						) : (
							<></>
						)}
					</View>
					<Image
						source={{ uri: pic }}
						style={{
							width: size,
							height: size,
							borderRadius: size / 2,
							zIndex: 50,
						}}
						onLoadStart={() => setPhotoLoading(true)}
						onLoad={() => setPhotoLoading(false)}
					/>
				</>
			)}
		</View>
	);
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
				noSwipe={false}>
				<View
					style={{
						position: "absolute",
						right: 0,
						top: 0,
						zIndex: 100,
					}}>
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
					}}>
					<Text>Close</Text>
				</TouchableOpacity>
			</ModalWrapper>
		</>
	);
}
