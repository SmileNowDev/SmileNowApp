import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import UserCard from "../userCard";
import * as Contacts from "expo-contacts";
import userApi from "../../api/user/user";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ScreenWrapper from "../../components/core/screenWrapper";
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
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = () => {
		console.log("refreshing");
		setRefreshing(true);
		refetch();
		setRefreshing(false);
	};
	async function useContacts() {
		const { status } = await Contacts.requestPermissionsAsync();
		if (status === "granted") {
			const { data } = await Contacts.getContactsAsync({
				fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
			});

			if (data.length > 0) {
				const phoneNumbers = data
					.map((contact) =>
						contact.phoneNumbers ? contact.phoneNumbers[0].digits : undefined
					)
					.filter((phoneNumber) => phoneNumber !== undefined);
				return phoneNumbers;
				// array of only numbers, ignoring undefined
			} else return [];
		}
	}

	const {
		data: contactsData,
		isLoading,
		refetch,
		isRefetching,
		status,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["addFriends"],
		queryFn: getContacts,
	});
	async function getContacts({ pageParam = 1 }) {
		let phoneNumbers = await useContacts();
		const result = await userApi.getContacts({ phoneNumbers });
		if (!result.ok) {
			return result.problem;
		} else {
			return result.data as any[];
		}
	}
	return (
		<ScreenWrapper
			loading={isLoading}
			onBottomScroll={fetchNextPage}
			bottomLoading={isFetchingNextPage}
			onRefresh={refetch}
			scrollEnabled={true}>
			<Text style={GlobalStyles.tabScreenTitle}>Add Friends</Text>
			{isLoading ? (
				<></>
			) : (
				<FlatList
					style={{ padding: 10 }}
					scrollEnabled={false}
					data={contactsData.pages.flat()}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
						<UserCard
							profilePicture={item.src}
							name={item.name}
							username={item.username}
							id={item._id}
						/>
					)}
				/>
			)}
		</ScreenWrapper>
	);
}
