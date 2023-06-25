import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../../../styles/theme";
import Icon from "../../core/icons";
import NotificationFrequencyButton from "./notificationFrequencyButton";
import { GlobalStyles } from "../../../styles/styles";

export default function NotificationFrequency({
	isHost,
	notificationFrequency,
}) {
	const [newNotificationFrequency, setNewNotificationFrequency] = useState(
		notificationFrequency
	);
	if (isHost) {
		return (
			<View>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.button.fontSize,
						width: "100%",
						marginTop: 5,
					}}>
					Notification Frequency {newNotificationFrequency}
				</Text>
				<View style={styles.frequencyContainer}>
					<NotificationFrequencyButton
						mode="fast"
						notificationFrequency={newNotificationFrequency}
						setNotificationFrequency={setNewNotificationFrequency}
						color={Colors.tertiary}
						title={"Fast"}
						subtext={"Every 5-10 Minutes"}
						icon={
							<Icon
								name="rabbit"
								size={30}
								color={
									notificationFrequency === "fast"
										? Colors.tertiaryDark
										: Colors.textSecondary
								}
								type="MaterialCommunity"
							/>
						}
					/>
					<NotificationFrequencyButton
						mode="normal"
						notificationFrequency={newNotificationFrequency}
						setNotificationFrequency={setNewNotificationFrequency}
						color={Colors.primary}
						title={"Normal"}
						subtext={"Every 15-30 Minutes"}
						icon={
							<Icon
								name="face"
								size={30}
								color={
									notificationFrequency === "normal"
										? Colors.primaryDark
										: Colors.textSecondary
								}
							/>
						}
					/>
					<NotificationFrequencyButton
						mode="slow"
						notificationFrequency={newNotificationFrequency}
						setNotificationFrequency={setNewNotificationFrequency}
						color={Colors.secondary}
						title={"Slow"}
						subtext={"Every 30-60 Minutes"}
						icon={
							<Icon
								name="tortoise"
								size={30}
								color={
									notificationFrequency === "slow"
										? Colors.secondaryDark
										: Colors.textSecondary
								}
								type="MaterialCommunity"
							/>
						}
					/>
				</View>
			</View>
		);
	} else {
		return <></>;
	}
}
const styles = StyleSheet.create({
	frequencyContainer: {
		gap: 5,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
});
