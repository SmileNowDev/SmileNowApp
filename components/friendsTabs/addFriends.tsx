import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import UserCard from "../userCard";
import * as Contacts from "expo-contacts";
import userApi from "../../api/user/user";

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
export default function AddFriendsTab(params) {
	const [list, setList] = useState([]);

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

	async function getContacts(phoneNumbers) {
		const result = await userApi.getContacts({ phoneNumbers });
		if (result.ok) {
			//@ts-expect-error
			setList(result.data);
		}
	}

	return (
		<ScrollView>
			<Text style={GlobalStyles.tabScreenTitle}>Add Friends</Text>
			<FlatList
				style={{ padding: 10 }}
				data={list}
				renderItem={({ item }) => (
					<UserCard
						profilePicture={item.src}
						name={item.name}
						username={item.username}
						id={item._id}
					/>
				)}
			/>
		</ScrollView>
	);
}
