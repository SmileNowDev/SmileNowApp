import React, { useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Button } from "react-native";
import { ButtonStyles, Dim } from "../styles/styles";
import { Colors, Fonts } from "../styles/theme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AddFriendsTab from "../components/friendsTabs/addFriends";
import RequestsSentTab from "../components/friendsTabs/requestsSent";
import RequestsTab from "../components/friendsTabs/myRequests";
import MyFriendsTab from "../components/friendsTabs/myFriends";
import Icon from "../components/core/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();
export function getInitials(firstName: string, lastName: string) {
	if (!firstName && !lastName) return "??";
	if (!lastName) return firstName.substring(0, 1);
	if (!firstName) return lastName.substring(0, 1);
	else return firstName.substring(0, 1) + lastName.substring(0, 1);
}

export default function FriendsPage({ navigation }) {
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			queryClient.invalidateQueries(["requests"]);
		}
	}, [isFocused]);
	const queryClient = useQueryClient();
	const requestData = queryClient.getQueryData(["requests"]) as number;
	return (
		<>
			<View
				style={{
					position: "absolute",
					top: 50,
					left: 10,
					right: 10,
					zIndex: 50,
					gap: 10,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.textSecondary,
					}}>
					Smile Now is more fun with friends!
				</Text>
				<TouchableOpacity
					style={{
						...ButtonStyles.buttonSmall,
						...ButtonStyles.primary,
						paddingLeft: 25,
					}}
					onPress={() => navigation.navigate("Home")}>
					<Text style={{ ...ButtonStyles.buttonText }}>Back</Text>
					<Icon name="chevron-right" size={20} color={Colors.background} />
				</TouchableOpacity>
			</View>

			<Tab.Navigator
				style={{ paddingTop: 90 }}
				screenOptions={{
					tabBarScrollEnabled: true,
					tabBarItemStyle: {
						width: Dim.width / 2.5,
					},
					tabBarIndicatorStyle: {
						backgroundColor: Colors.primary,
					},
					tabBarLabelStyle: {
						textTransform: "none",
					},
				}}>
				<Tab.Screen
					name="Add Friends"
					component={AddFriendsTab}
					options={{
						tabBarIcon: () => (
							<Icon name="add" size={20} color={Colors.textSecondary} />
						),
					}}
				/>
				<Tab.Screen
					name="Friend Requests"
					component={RequestsTab}
					options={{
						tabBarIcon: () => (
							<View>
								<Icon
									name="move-to-inbox"
									size={20}
									color={Colors.textSecondary}
								/>
								{requestData > 0 && (
									<View
										style={{
											position: "absolute",
											backgroundColor: Colors.danger,
											justifyContent: "center",
											height: 18,
											width: 18,
											borderRadius: 9,
											right: 0,
											marginRight: -7,
											marginTop: -7,
										}}>
										<Text
											style={{
												color: Colors.background,
												fontSize: 12,
												textAlign: "center",
												fontFamily: Fonts.subTitle.fontFamily,
											}}>
											{requestData}
										</Text>
									</View>
								)}
							</View>
						),
					}}
				/>
				<Tab.Screen
					name="My Friends"
					component={MyFriendsTab}
					options={{
						tabBarIcon: () => (
							<Icon
								name="account-heart"
								type={"MaterialCommunity"}
								size={20}
								color={Colors.textSecondary}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="Requests Sent"
					component={RequestsSentTab}
					options={{
						tabBarIcon: () => (
							<Icon
								name="send"
								size={20}
								type="FontAwesome"
								color={Colors.textSecondary}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		</>
	);
}
const styles = StyleSheet.create({
	tabContainer: {
		padding: 10,
	},
	tabTitle: {
		fontFamily: Fonts.subTitle.fontFamily,
		fontSize: Fonts.subTitle.fontSize,
		color: Colors.textSecondary,
	},
});
