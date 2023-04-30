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

const Tab = createMaterialTopTabNavigator();
export function getInitials(firstName: string, lastName: string) {
	if (!firstName && !lastName) return "??";
	if (!lastName) return firstName.substring(0, 1);
	if (!firstName) return lastName.substring(0, 1);
	else return firstName.substring(0, 1) + lastName.substring(0, 1);
}
type ContactType = {
	contactType: string;
	firstName: string;
	id: string;
	phoneNumbers: any;
	imageAvailable: boolean;
	lastName: string;
	middleName: string;
	name: string;
};
export default function FriendsPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const [contacts, setContacts] = useState<ContactType[]>([]);
	const [friends, setFriends] = useState([]);
	useEffect(() => {
		(async () => {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status === "granted") {
				const { data } = await Contacts.getContactsAsync({
					fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
				});

				if (data.length > 0) {
					//@ts-expect-error
					setContacts(data);
					const phoneNumbers = data
						.map((contact) =>
							contact.phoneNumbers ? contact.phoneNumbers[0].digits : undefined
						)
						.filter((phoneNumber) => phoneNumber !== undefined);
					await getContacts(phoneNumbers);
					// array of only numbers, ignoring undefined
				}
			}
		})();
	}, []);
	useEffect(() => {
		getYourFriends();
	}, []);
	const [contactsToAdd, setContactsToAdd] = useState([]);

	async function getContacts(phoneNumbers) {
		const result = await userApi.getContacts({ phoneNumbers });
		if (result.ok) {
			//@ts-expect-error
			setContactsToAdd(result.data);
		}
	}

	async function getYourFriends() {
		const result = await friendApi.getMyFriends({ page: 1 });
		console.log("res: ", result);

		if (result.ok) {
			// @ts-expect-error
			setFriends(result.data);
		}
	}
	function RequestTab() {
		// friend requests you've received
		return (
			<ScrollView style={styles.tabContainer}>
				<Text style={styles.tabTitle}></Text>
			</ScrollView>
		);
	}
	function AddFriendsTab() {
		// contacts then mutuals
		return (
			<ScrollView style={styles.tabContainer}>
				<Text style={styles.tabTitle}>Invite Contacts</Text>
				<TextInput
					placeholder="Search Contacts"
					style={GlobalStyles.textInput}
					value={searchQuery}
					onChangeText={(query) => {
						setSearchQuery(query);
					}}
				/>
				<FlatList
					data={contactsToAdd}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => {
						return (
							<UserCard
								profilePicture={item.src}
								name={item.name}
								username={item.username}
								id={item._id}
								onPress={() => {}}
							/>
						);
					}}
				/>
				<FlatList
					data={contacts.filter(
						(item) => item?.name?.includes(searchQuery) || !searchQuery
					)}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => {
						if (item.phoneNumbers) {
							return (
								<ContactCard
									name={item.name}
									id={item.id}
									number={item.phoneNumbers[0].digits}
									initials={getInitials(item.firstName, item.lastName)}
								/>
							);
						}
					}}
				/>

				<View style={{ height: Dim.height / 2 }} />
			</ScrollView>
		);
	}
	function MyFriendsTab() {
		// my friends
		return (
			<ScrollView style={styles.tabContainer}>
				<Text style={styles.tabTitle}>My Friends</Text>
				<FlatList
					data={friends}
					renderItem={({ item }) => {
						return (
							<UserCard
								profilePicture={item.user.src}
								name={item.name}
								username={item.username}
								id={item._id}
								onPress={() => {}}
							/>
						);
					}}
				/>
			</ScrollView>
		);
	}
	function RequestsSentTab() {
		// pending requests
		return (
			<ScrollView style={styles.tabContainer}>
				<Text style={styles.tabTitle}></Text>
			</ScrollView>
		);
	}
	return (
		<Tab.Navigator>
			<Tab.Screen name="Requests" component={RequestTab} />
			<Tab.Screen name="AddFriends" component={AddFriendsTab} />
			<Tab.Screen name="MyFriends" component={MyFriendsTab} />
			<Tab.Screen name="RequestsSent" component={RequestsSentTab} />
		</Tab.Navigator>
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
