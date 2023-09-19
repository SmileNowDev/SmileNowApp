import ScreenWrapper from "../../components/core/screenWrapper";
import UserCard from "../../components/userCard";
import attendeeApi from "../../api/post/attendee";
import { Context } from "../../providers/provider";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import Header from "../../components/layout/header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "../../components/SmileNowUI";

export default function PartyAttendees({ route, navigation }) {
	const { eventId, isHost, name } = route.params;
	const { userId } = useContext(Context);

	const [attendees, setAttendees] = useState([]);
	const [page, setPage] = useState(1);
	const [bottomLoading, setBottomLoading] = useState(false);

	async function getAttendees({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await attendeeApi.getAttendees({ eventId, page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			return {
				// @ts-expect-error
				attendees: result.data.data,
				// @ts-expect-error
				hasNextPage: result.data.next,
			};
		}
	}

	const {
		data,
		isLoading,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
		isRefetching,
		error,
	} = useInfiniteQuery({
		queryKey: ["attendees", eventId],
		queryFn: ({ pageParam = 1 }) => getAttendees({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			// console.log({ lastPage, allPages });
			if (lastPage.hasNextPage) {
				return allPages.length + 1;
			} else {
				return false;
			}
		},
	});
	useEffect(() => {
		if (data) {
			let _attendees = data.pages.flat()[0].attendees as any[];
			setAttendees(_attendees);
		}
	}, [data]);
	async function demoteToMember(id: string) {
		const result = await attendeeApi.update({
			eventId,
			userId: id,
			isHost: false,
		});
		if (result.ok) {
			getAttendees({ pageParam: page });
		}
	}
	async function promoteToHost(id: string) {
		const result = await attendeeApi.update({
			eventId,
			userId: id,
			isHost: true,
		});
		// console.log({ result });
		if (result.ok) {
			getAttendees({ pageParam: page });
		}
	}
	function PromoteAndDemote({ attendeeIsHost, id }) {
		if (!isHost || id === userId) return <></>;
		if (attendeeIsHost) {
			return (
				<Button
					variant={"outlined"}
					onPress={() => demoteToMember(id)}
					size="sm">
					Demote to Member
				</Button>
			);
		} else {
			return (
				<Button
					variant={"outlined"}
					colorScheme="secondary"
					onPress={() => promoteToHost(id)}
					size="sm">
					Promote to Host
				</Button>
			);
		}
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Header title={`${name} Attendees`} goBack />
			<ScreenWrapper
				onRefresh={() => {
					refetch();
				}}
				style={{ width: "100%", backgroundColor: "white" }}
				scrollEnabled={true}
				bottomLoading={bottomLoading}
				loading={isLoading}
				onBottomScroll={() => {
					fetchNextPage();
				}}>
				<View>
					<FlatList
						style={{ width: "100%", paddingHorizontal: 10 }}
						data={attendees}
						renderItem={({ item }) => (
							<UserCard
								profilePicture={item.user.src}
								name={item.user.name}
								username={item.user.username}
								id={item.user._id}
								rightElement={
									<PromoteAndDemote
										attendeeIsHost={item.isHost}
										id={item.user._id}
									/>
								}
							/>
						)}
					/>
				</View>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
