import React from "react";
import { Image, View } from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { GlobalStyles } from "../../styles/styles";
import { Text } from "../SmileNowUI";

export default function WelcomeMessage({
	key,
	message,
}: {
	key: string;
	message: any;
}) {
	return (
		<View
			key={message._id}
			style={{
				padding: 20,
			}}>
			<>
				{message.content.map((content) => {
					if (content.type === "text") {
						return (
							<Text
								style={{
									...content.style,
								}}>
								{typeof content.content === "string" ? content.content : ""}
							</Text>
						);
					} else if (content.type === "image") {
						return (
							<View
								style={{
									justifyContent: "center",
									flexDirection: "row",
								}}>
								<Image
									source={{ uri: content.content }}
									style={{
										...content.style,
										width: content.style.width || 200,
										height: content.style.height || 200,
									}}
								/>
							</View>
						);
					}
				})}
			</>
		</View>
	);
}
