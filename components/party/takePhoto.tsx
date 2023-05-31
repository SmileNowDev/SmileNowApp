import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonStyles } from "../../styles/styles";
import { Colors } from "../../styles/theme";
import Icon from "../core/icons";
import { useNavigation } from "@react-navigation/native";

export default function TakePhoto({ canPost, eventId }) {
	const navigation = useNavigation();
	if (canPost) {
		return (
			<View
				style={{
					position: "absolute",
					bottom: 100,
					left: 40,
					right: 40,
					zIndex: 95,
				}}>
				<TouchableOpacity
					// @ts-expect-error
					onPress={() => navigation.navigate("Camera", { eventId })}
					style={{ ...ButtonStyles.buttonLarge, ...ButtonStyles.primary }}>
					<Icon
						name="camera"
						size={30}
						type="Feather"
						color={Colors.background}
					/>
					<Text
						style={{
							...ButtonStyles.buttonText,
							color: Colors.background,
						}}>
						Take a Photo!
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
