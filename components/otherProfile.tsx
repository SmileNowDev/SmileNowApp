import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Picture } from "./avatar";
import { Colors, Fonts } from "../styles/theme";
import { ButtonStyles } from "../styles/styles";
import friendApi from "../api/user/friend";
import userApi from "../api/user/user";
import Icon from "./core/icons";
import DefaultOptions from "./core/defaultOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
			console.log("success", data);
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
				console.log("oldData", oldData);
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
				<TouchableOpacity
					onPress={() => sendFriendRequest()}
					style={{ ...ButtonStyles.button, ...ButtonStyles.primary }}>
					<Icon name="person-add" size={20} color="white" />
					<Text style={{ ...ButtonStyles.buttonText }}>
						Send Friend Request
					</Text>
				</TouchableOpacity>
			);
		}
		if (friendStatus === "requestedYou") {
			return (
				<>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							marginBottom: 10,
						}}>
						{name} wants to be friends!
					</Text>
					<TouchableOpacity
						onPress={() => acceptRequest.mutate()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.success }}>
						<Icon name="person-add" size={20} color="white" />
						<Text style={{ ...ButtonStyles.buttonText }}>
							Accept Friend Request
						</Text>
					</TouchableOpacity>
				</>
			);
		}
		if (friendStatus === "requested") {
			return (
				<>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							marginBottom: 10,
							textAlign: "center",
						}}>
						Still waiting for {name} to add you back
					</Text>
					<TouchableOpacity
						onPress={() => removeFriend()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.gray }}>
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Friend Request Pending
						</Text>
					</TouchableOpacity>
				</>
			);
		}
		if (friendStatus === "accepted") {
			return (
				<>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							marginBottom: 10,
						}}>
						You're friends with {name}
					</Text>
					<TouchableOpacity
						onPress={() => removeFriend()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.gray }}>
						<Icon name="person-remove" size={20} color={Colors.text} />
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Remove Friend
						</Text>
					</TouchableOpacity>
				</>
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
				style={{
					marginTop: 20,
					marginBottom: 5,
					fontFamily: Fonts.title.fontFamily,
					fontSize: Fonts.title.fontSize,
				}}>
				{name}
			</Text>
			<Text
				style={{
					fontFamily: Fonts.title.fontFamily,
					fontSize: Fonts.button.fontSize,
					color: Colors.textSecondary,
				}}>
				@{userName}
			</Text>
			<View style={{ paddingVertical: 30 }}>
				<ActionButton />
			</View>
		</View>
	);
}
