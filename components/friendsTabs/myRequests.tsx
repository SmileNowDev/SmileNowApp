import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import friendApi from "../../api/user/friend";
import UserCard from "../userCard";
import ScreenWrapper from "../core/screenWrapper";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Fonts, Colors } from "../../styles/theme";
export default function RequestsTab() {
	const [page, setPage] = useState(1); // Add this state
	const {
		data,
		isLoading,
		refetch,
		isRefetching,
		status,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery<any>({
		queryKey: ["friend_requests"],
		queryFn: getList,
		getNextPageParam: (lastPage) => {
			return hasNextPage ? page + 1 : undefined;
		},
	});
	async function getList({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await friendApi.getRequestingMe({ page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			return result.data;
		}
	}
	if (isLoading || isRefetching) {
		return (
			<View
				style={{ flex: 0.75, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
	return (
		<ScreenWrapper
			style={GlobalStyles.tabScreenContainer}
			onRefresh={refetch}
			scrollEnabled={true}
			loading={isLoading}
			onBottomScroll={fetchNextPage}
			bottomLoading={isFetchingNextPage}>
			<Text style={GlobalStyles.tabScreenTitle}>Requesting Me</Text>
			{data.pages.flat().length == 0 ? (
				<View style={{ margin: 15 }}>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize + 4,
							color: Colors.textSecondary,
						}}>
						No Friend Requests
					</Text>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}>
						Looks like you're already everyone's friend 🥹
					</Text>
				</View>
			) : (
				<>
					{/* todo: make this a flatlist */}
					{data.pages.flat().map(function (item, index) {
						let user = item as any; //todo: as UserType
						return (
							<UserCard
								profilePicture={user.src}
								name={user.requester.name}
								username={user.requester.username}
								id={user.requester._id}
							/>
						);
					})}
				</>
			)}
		</ScreenWrapper>
	);
}
