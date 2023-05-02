import React, { useEffect, useState, useContext } from "react";
import {
	SafeAreaView,
	Text,
	View,
	ScrollView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { Dim, GlobalStyles } from "../styles/styles";
import QRCode from "react-native-qrcode-svg";
import { Colors, Fonts } from "../styles/theme";
import Header from "../components/header";
import eventApi from "../api/post/event";
import attendeeApi from "../api/post/attendee";
import UserCard from "../components/userCard";
import ScreenWrapper from "../components/core/screenWrapper";
import { ButtonStyles } from "../styles/styles";
import { Context } from "../providers/provider";
export default function InviteToParty({ route, navigation }) {
	const { eventId, isHost } = route.params;
	const { userId } = useContext(Context);
	const [joinCode, setJoinCode] = useState("ABCD");
	const [name, setName] = useState("");
	const [attendees, setAttendees] = useState([]);

	async function getAttendees() {
		const result = await attendeeApi.getAttendees({ eventId, page: 1 });
		if (result.ok) {
			//@ts-expect-error
			setAttendees(result.data);
		}
	}

	const [page, setPage] = useState(1); // Add this state
	const [hasMore, setHasMore] = useState(true); // Add this state
	const [loading, setLoading] = useState(false); // Add this state
	const [bottomLoading, setBottomLoading] = useState(false);

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

	async function getEvent() {
		const result = await eventApi.getEvent({ eventId });
		if (result.ok) {
			//@ts-expect-error
			setName(result.data.event.title);
			//@ts-expect-error
			setJoinCode(result.data.event.inviteCode);
		}
	}
	useEffect(() => {
		getAttendees();
		getEvent();
	}, [eventId]);
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
	return (
		<SafeAreaView style={{ alignItems: "center" }}>
			<Header goBack title={name} />
			<ScreenWrapper
				onRefresh={() => {
					getAttendees();
					getEvent();
				}}
				style={{ width: "100%", backgroundColor: "white" }}
				scrollEnabled={true}
				loading={loading}
				onBottomScroll={loadMore}
				bottomLoading={bottomLoading}>
				<View style={{ width: "100%", backgroundColor: "white" }}>
					{isHost ? (
						<View
							style={{
								alignItems: "center",
								marginVertical: 20,
							}}>
							<View
								style={{
									...GlobalStyles.Container,
									backgroundColor: Colors.background,
								}}>
								<QRCode value={joinCode} size={Dim.width - 60} />
							</View>

							<Text
								style={{
									marginTop: 20,
									fontFamily: Fonts.body.fontFamily,
									fontSize: Fonts.body.fontSize,
								}}>
								Tell friends to join with
							</Text>
							<Text
								style={{
									fontFamily: Fonts.title.fontFamily,
									fontSize: Fonts.title.fontSize + 10,
									color: Colors.primary,
									textAlign: "center",
								}}>
								{joinCode}
							</Text>
						</View>
					) : (
						<></>
					)}
					<Text
						style={{
							fontFamily: Fonts.title.fontFamily,
							fontSize: Fonts.title.fontSize,
							marginVertical: 5,
							marginLeft: 15,
							textAlign: "left",
							width: "100%",
						}}>
						Attendees
					</Text>
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

					<View style={{ height: Dim.height / 2 }}></View>
				</View>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
