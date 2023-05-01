import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import Header from "../components/header";
import { Dim, GlobalStyles } from "../styles/styles";
import { Colors, Fonts } from "../styles/theme";
import UserCard from "../components/userCard";
import * as Contacts from "expo-contacts";
import ContactCard from "../components/contactCard";
import { debounce } from "lodash";
import userApi from "../api/user/user";
import friendApi from "../api/user/friend";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AddFriendsTab from "../components/friendsTabs/addFriends";
import RequestsSentTab from "../components/friendsTabs/requestsSent";
import RequestsTab from "../components/friendsTabs/myRequests";
import MyFriendsTab from "../components/friendsTabs/myFriends";
import Icon from "../components/icons";
const Tab = createMaterialTopTabNavigator();
export function getInitials(firstName: string, lastName: string) {
	if (!firstName && !lastName) return "??";
	if (!lastName) return firstName.substring(0, 1);
	if (!firstName) return lastName.substring(0, 1);
	else return firstName.substring(0, 1) + lastName.substring(0, 1);
}

export default function FriendsPage({ navigation }) {
	return (
		<>
			<TouchableOpacity
				onPress={() => navigation.navigate("Home")}
				style={{
					position: "absolute",
					bottom: 30,
					right: 30,
					zIndex: 50,
					backgroundColor: Colors.foreground,
					padding: 10,
					borderRadius: 50,
					...GlobalStyles.shadow,
					borderWidth: 1,
					borderColor: Colors.border,
					borderStyle: "solid",
				}}
			>
				<Icon name='home' size={50} color={Colors.text} />
			</TouchableOpacity>
			<Tab.Navigator
				style={{ paddingTop: 70 }}
				screenOptions={{
					tabBarScrollEnabled: true,
					tabBarItemStyle: {
						width: Dim.width / 2.5,
					},
					tabBarIndicatorStyle: {
						backgroundColor: Colors.primary,
					},
				}}
				// @ts-expect-error
				tabBarOptions={{
					labelStyle: { textTransform: "none" },
				}}
			>
				<Tab.Screen
					name='Add Friends'
					component={AddFriendsTab}
					options={{
						tabBarIcon: () => (
							<Icon name='add' size={20} color={Colors.textSecondary} />
						),
					}}
				/>
				<Tab.Screen
					name='Friend Requests'
					component={RequestsTab}
					options={{
						tabBarIcon: () => (
							<Icon
								name='move-to-inbox'
								size={20}
								color={Colors.textSecondary}
							/>
						),
					}}
				/>
				<Tab.Screen
					name='My Friends'
					component={MyFriendsTab}
					options={{
						tabBarIcon: () => (
							<Icon
								name='account-heart'
								type={"MaterialCommunity"}
								size={20}
								color={Colors.textSecondary}
							/>
						),
					}}
				/>
				<Tab.Screen
					name='Requests Sent'
					component={RequestsSentTab}
					options={{
						tabBarIcon: () => (
							<Icon
								name='send'
								size={20}
								type='FontAwesome'
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
