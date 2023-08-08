import React from "react";
import { Image, Text, View } from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { GlobalStyles } from "../../styles/styles";

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
									fontFamily: Fonts.body.fontFamily,
									fontSize: Fonts.body.fontSize,
									...content.style,
								}}>
								{typeof content.content === "string" ? content.content : ""}
							</Text>
						);
					} else if (content.type === "image") {
						return (
							<Image
								source={{ uri: content.content }}
								style={{ width: 200, height: 200 }}
							/>
						);
					}
				})}
			</>
		</View>
	);
}
