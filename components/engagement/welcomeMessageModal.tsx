import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TouchableOpacity, Text, View } from "react-native";
import engagementApi from "../../api/user/engagement";
import WelcomeMessage from "./welcomeMessage";
import ModalWrapper from "../core/modalWrapper";
import { ButtonStyles, Dim } from "../../styles/styles";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";

export default function WelcomeMessageModal() {
	const [modalVisible, setModalVisible] = useState(false);
	const [welcomeMessages, setWelcomeMessages] = useState<any[]>([]);
	const handleGetMessages = async () => {
		const result = await engagementApi.getAllWelcomeMessages();
		if (result.ok) {
			return result.data as any[];
		} else {
			console.log(result.problem);
		}
	};
	const getNewMessages = async () => {
		let messages = await handleGetMessages();
		let _messages = [];
		for (let i = 0; i < messages.length; i++) {
			let seen = await AsyncStorage.getItem(messages[i]._id);
			if (seen) {
			} else {
				_messages.push(messages[i]);
			}
		}
		setWelcomeMessages(_messages);
		if (_messages.length > 0) setModalVisible(true);
		else if (_messages.length === 0) setModalVisible(false);
	};
	async function readMessage(id: string) {
		await AsyncStorage.setItem(id, "seen");
		// filter out that recently read message from the list
		let newMessages = welcomeMessages.filter((message) => message._id !== id);
		if (newMessages.length === 0) setModalVisible(false);
		setWelcomeMessages(newMessages);
	}
	async function handleSkipAll() {
		for (let i = 0; i < welcomeMessages.length; i++) {
			await AsyncStorage.setItem(welcomeMessages[i]._id, "seen");
		}
		setWelcomeMessages([]);
		setModalVisible(false);
	}
	async function handleClearLocalStorage() {
		let messages = await handleGetMessages();
		for (let i = 0; i < messages.length; i++) {
			await AsyncStorage.removeItem(messages[i]._id);
		}
		console.log(`cleared ${messages.length} messages from local storage`);
	}
	useEffect(() => {
		getNewMessages();
	}, []);
	if (welcomeMessages.length === 0)
		return (
			<>
				<TouchableOpacity
					onPress={() => {
						handleClearLocalStorage();
					}}>
					<Text>Clear Local Storage</Text>
				</TouchableOpacity>
			</>
		);
	return (
		<>
			{welcomeMessages.map((message) => {
				return (
					<ModalWrapper
						visible={modalVisible}
						setVisible={setModalVisible}
						scrollable={true}
						noSwipe={false}
						onClose={() => {
							readMessage(message._id);
							setModalVisible(false);
						}}
						type={"center"}>
						<View
							style={{
								position: "relative",
								height: "100%",
								borderRadius: 10,
								maxHeight: Dim.height - 160,
							}}>
							<TouchableOpacity
								onPress={() => {
									readMessage(message._id);
									setModalVisible(false);
								}}
								style={{
									position: "absolute",
									zIndex: 100,
									top: 0,
									right: 0,
									padding: 10,
								}}>
								<Icon name="close" size={30} color={Colors.textSecondary} />
							</TouchableOpacity>
							<View
								style={{
									width: Dim.width - 40,
									justifyContent: "center",
									alignItems: "center",
									position: "absolute",
									bottom: 0,
									zIndex: 100,
								}}>
								<TouchableOpacity
									onPress={() => readMessage(message._id)}
									style={{
										width: "80%",
										...ButtonStyles.buttonLarge,
										backgroundColor: Colors.primary,
									}}>
									<Text
										style={{
											...ButtonStyles.buttonTextLarge,
										}}>
										{message.buttonCTA || welcomeMessages.length === 1
											? "Close"
											: "Next"}
									</Text>
								</TouchableOpacity>
								{welcomeMessages.length >= 2 ? (
									<>
										<TouchableOpacity
											onPress={() => handleSkipAll()}
											style={{
												...ButtonStyles.button,
												marginTop: 10,
											}}>
											<Text
												style={{
													fontSize: 15,
												}}>
												Close All
											</Text>
										</TouchableOpacity>
									</>
								) : (
									<></>
								)}
							</View>
							<View
								style={{
									maxHeight: Dim.height - 160,
								}}>
								<View
									style={{
										borderRadius: 20,
										width: Dim.width * 0.9,
										justifyContent: "flex-start",
										alignItems: "center",
										paddingTop: 30,
										height: Dim.height - 160,
									}}>
									<WelcomeMessage key={message._id + "1"} message={message} />
								</View>
							</View>
						</View>
					</ModalWrapper>
				);
			})}
		</>
	);
}
