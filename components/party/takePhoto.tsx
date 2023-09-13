import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../styles/theme";
import Icon from "../core/icons";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../SmileNowUI/button";

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
				<Button
					// @ts-expect-error
					onPress={() => navigation.navigate("Camera", { eventId })}
					size="xl"
					style={{ flex: 1 }}
					leftIcon={
						<Icon
							name="camera"
							type="MaterialCommunity"
							size={30}
							color={Colors.background}
						/>
					}>
					Take a Photo!
				</Button>
			</View>
		);
	}
}
