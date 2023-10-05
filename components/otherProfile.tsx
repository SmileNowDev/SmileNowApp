import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Picture } from "./avatar";
import { Colors, Fonts } from "../styles/theme";
import friendApi from "../api/user/friend";
import userApi from "../api/user/user";
import Icon from "./core/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Text } from "./SmileNowUI";
type FriendStatus = "stranger" | "requestedYou" | "requested" | "accepted";
export default function OtherProfile({ id }) {
	const queryClient = useQueryClient();
	const [friendStatus, setFriendStatus] = useState<FriendStatus>("stranger");
	const [name, setName] = useState("");
	const [userName, setUserName] = useState("");
	const [picture, setPicture] = useState("");
	async function getUser() {
		if (!id) {
			return;
		}
		const response = await userApi.get({ userId: id });
		if (response.ok) {
			// @ts-expect-error
			setUserName(response.data.username);
			// @ts-expect-error
			setName(response.data.name);
			// @ts-expect-error
			setFriendStatus(response.data.friendStatus);
			// @ts-expect-error
			setPicture(response.data.pic);
		}
	}
	async function sendFriendRequest() {
		const result = await friendApi.request({ userId: id });
		if (result.ok) {
			setFriendStatus("requested");
		}
	}
	const acceptRequest = useMutation(() => friendApi.accept({ userId: id }), {
		onSuccess: (data) => {
			setFriendStatus("accepted");
			queryClient.setQueryData(["friend_requests"], (oldData) => {
				//@ts-expect-error
				const updatedPages = oldData.pages.map((page) => {
					return page.filter((item) => item._id != id);
				});
				//@ts-expect-error
				return { ...oldData, pages: updatedPages };
			});
			queryClient.setQueryData(["requests"], (oldData) => {
				//@ts-expect-error
				if (oldData > 0) {
					//@ts-expect-error
					return oldData - 1;
				} else return 0;
			});
		},
	});
	async function acceptFriendRequest() {
		const result = await friendApi.accept({ userId: id });
		if (result.ok) {
			setFriendStatus("accepted");
		}
	}
	async function removeFriend() {
		const result = await friendApi.deleteFriend({ userId: id });
		if (result.ok) {
			setFriendStatus("stranger");
		}
	}
	function ActionButton() {
		if (friendStatus === "stranger") {
			return (
				<Button
					leftIcon={
						<Icon name="person-add" size={20} color={Colors.background} />
					}
					onPress={() => sendFriendRequest()}>
					Send Friend Request
				</Button>
			);
		}
		if (friendStatus === "requestedYou") {
			return (
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							marginBottom: 10,
						}}>
						{name} wants to be friends!
					</Text>
					<Button
						colorScheme="success"
						leftIcon={
							<Icon name="person-add" size={20} color={Colors.background} />
						}
						onPress={() => acceptRequest.mutate()}>
						Accept Friend Request
					</Button>
				</View>
			);
		}
		if (friendStatus === "requested") {
			return (
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							marginBottom: 10,
							textAlign: "center",
						}}>
						Still waiting for {name} to add you back
					</Text>
					<Button colorScheme="gray" onPress={() => removeFriend()}>
						Friend Request Pending
					</Button>
				</View>
			);
		}
		if (friendStatus === "accepted" || true) {
			return (
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							marginBottom: 10,
						}}>
						You're friends with {name}
					</Text>
					<Button
						variant="outlined"
						colorScheme="danger"
						leftIcon={
							<Icon name="person-remove" size={20} color={Colors.danger} />
						}
						onPress={() => removeFriend()}>
						Remove Friend
					</Button>
				</View>
			);
		}
	}
	useEffect(() => {
		getUser();
	}, [id]);

	return (
		<View
			style={{
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
			}}>
			<Picture size={80} pic={picture} />
			<Text
				variant="title"
				style={{
					marginTop: 20,
					marginBottom: 5,
				}}>
				{name || "Loading..."}
			</Text>
			<Text
				variant="button"
				colorScheme="textSecondary"
				style={{
					color: Colors.textSecondary,
				}}>
				@{userName || "username"}
			</Text>
			<View style={{ paddingVertical: 30 }}>
				<ActionButton />
			</View>
		</View>
	);
}
