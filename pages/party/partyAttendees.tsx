import ScreenWrapper from "../../components/core/screenWrapper";
import UserCard from "../../components/userCard";
import attendeeApi from "../../api/post/attendee";
import { Context } from "../../providers/provider";
import React, { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import { ButtonStyles } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import Header from "../../components/layout/header";

export default function PartyAttendees({ route, navigation }) {
	const { eventId, isHost, name } = route.params;
	const { userId } = useContext(Context);

	const [attendees, setAttendees] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [bottomLoading, setBottomLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	async function getAttendees() {
		const result = await attendeeApi.getAttendees({ eventId, page: 1 });
		if (result.ok) {
			//@ts-expect-error
			setAttendees(result.data);
		}
	}

	async function demoteToMember(id: string) {
		const result = await attendeeApi.toggleHost({ eventId, userId: id });
		if (result.ok) {
			getAttendees();
		}
	}
	async function promoteToHost(id: string) {
		const result = await attendeeApi.toggleHost({ eventId, userId: id });
		console.log({ result });
		if (result.ok) {
			getAttendees();
		}
	}
	function PromoteAndDemote({ attendeeIsHost, id }) {
		if (!isHost || id === userId) return <></>;
		if (attendeeIsHost) {
			return (
				<TouchableOpacity
					onPress={() => demoteToMember(id)}
					style={{
						...ButtonStyles.buttonSmall,
						...ButtonStyles.primaryOutlined,
					}}>
					<Text
						style={{ ...ButtonStyles.buttonTextSmall, color: Colors.primary }}>
						Demote to Member
					</Text>
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity
					onPress={() => promoteToHost(id)}
					style={{
						...ButtonStyles.buttonSmall,
						...ButtonStyles.secondaryOutlined,
					}}>
					<Text
						style={{
							...ButtonStyles.buttonTextSmall,
							color: Colors.secondary,
						}}>
						Promote to Host
					</Text>
				</TouchableOpacity>
			);
		}
	}
	async function loadMore() {
		if (!hasMore) {
			return;
		}

		setBottomLoading(true);
		const nextPage = page + 1;
		const result = await attendeeApi.getAttendees({ eventId, page: nextPage });

		if (result.ok) {
			// @ts-expect-error
			if (result.data.length > 0) {
				//@ts-expect-error
				setAttendees((prevEvents) => [...prevEvents, ...result.data]);
				setPage(nextPage);
			} else {
				setHasMore(false);
			}
		}

		setBottomLoading(false);
	}
	useEffect(() => {
		getAttendees();
	}, [eventId]);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Header title={`${name} Attendees`} goBack />
			<ScreenWrapper
				onRefresh={() => {
					getAttendees();
				}}
				style={{ width: "100%", backgroundColor: "white" }}
				scrollEnabled={true}
				bottomLoading={bottomLoading}
				loading={loading}
				onBottomScroll={() => {
					loadMore();
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
