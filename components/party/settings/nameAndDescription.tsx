import Icon from "../../core/icons";
import eventApi from "../../../api/post/event";
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Button,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { ButtonStyles, Dim, GlobalStyles } from "../../../styles/styles";
import { Colors, Fonts } from "../../../styles/theme";
import { debounce } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { IEvent } from "../../../pages/party/party";
export default function NameAndDescription({
	title,
	description,
	isHost,
	id,
	notificationFrequency,
}) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [clientDescription, setClientDescription] = useState(description);
	const [clientTitle, setClientTitle] = useState(title);
	const [isLoading, setIsLoading] = useState(false);
	const [initialTitle, setInitialTitle] = useState(title);
	const [initialDescription, setInitialDescription] = useState(description);
	const [hasMadeEdits, setHasMadeEdits] = useState(false);
	const [editsSaved, setEditsSaved] = useState(false);
	const detailsMutation = useMutation(
		//@ts-expect-error
		({ id, title, description, notificationFrequency }) => {
			return eventApi.updateEvent({
				eventId: id,
				title,
				description,
				settings: { notificationFrequency },
			});
		},
		{
			onSuccess: (data) => {
				setEditsSaved(true);
				toast.show("Party Details Saved", {
					type: "success",
					placement: "bottom",
					duration: 1000,
				});
				console.log("data: ", data);
				queryClient.setQueryData(["event", id], (oldData) => ({
					...(oldData as IEvent),
					//@ts-expect-error
					...data.data, // update this event's state
				}));
				console.log("updated event: ", data);
			},
		}
	);
	async function abandonChanges() {
		// revert the server state to match the client state (which should be stale when this button is clicked)
		// confirm that they will lose progress
		Alert.alert(
			"Are you sure you want to revert changes?",
			"All your hard work will be lost",
			[
				{
					text: "No, keep my changes",
					onPress: () => {},
					style: "cancel",
				},
				{
					text: "Yes, Revert Changes",
					onPress: () => {
						setClientTitle(initialTitle);
						setClientDescription(initialDescription);
						//@ts-expect-error
						detailsMutation.mutate({
							id,
							title: initialTitle,
							description: initialDescription,
							notificationFrequency,
						});
					},
				},
			]
		);
	}
	const debounceSaveDetails = debounce(() => {
		// save the new name and description to the database
		//while temporarily saving the original name and description to provide an "revert changes" option;

		console.log("saving");
		//@ts-expect-error
		detailsMutation.mutate({
			id,
			title: clientTitle,
			description: clientDescription,
			notificationFrequency,
		});
	}, 1000);

	useEffect(() => {
		if (
			clientTitle !== initialTitle ||
			clientDescription !== initialDescription
		) {
			setHasMadeEdits(true);
			setEditsSaved(false);
			debounceSaveDetails();
		} else {
			setHasMadeEdits(false);
			setEditsSaved(true);
		}
		return debounceSaveDetails.cancel;
	}, [clientDescription, clientTitle]);
	if (isHost) {
		return (
			<View style={{ padding: 10 }}>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.button.fontSize,
						flex: 0,
					}}>
					Party Details
				</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
					}}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "flex-start",
							gap: 5,
						}}>
						{hasMadeEdits && !detailsMutation.isLoading && (
							<>
								<Icon name="check" size={18} />
								<Text
									style={{
										fontFamily: Fonts.small.fontFamily,
										fontSize: Fonts.small.fontSize,
									}}>
									Saved
								</Text>
							</>
						)}
						{detailsMutation.isLoading && (
							<>
								<ActivityIndicator color={Colors.textSecondary} size={18} />
								<Text
									style={{
										fontFamily: Fonts.small.fontFamily,
										fontSize: Fonts.small.fontSize,
									}}>
									Saving...
								</Text>
							</>
						)}
					</View>

					{hasMadeEdits && (
						<TouchableOpacity
							onPress={() => abandonChanges()}
							style={{
								...ButtonStyles.buttonSmall,
								...ButtonStyles.outlined,
							}}>
							<Icon name="refresh" size={12} color={Colors.textSecondary} />
							<Text
								style={{
									...ButtonStyles.buttonTextSmall,
									color: Colors.textSecondary,
								}}>
								Revert Changes
							</Text>
						</TouchableOpacity>
					)}
				</View>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.textSecondary,
						paddingBottom: 5,
					}}>
					Name:
				</Text>

				<View style={{ position: "relative" }}>
					<TextInput
						value={clientTitle}
						placeholder="Enter a party Name"
						onChangeText={(newTitle) => {
							setClientTitle(newTitle);
						}}
						style={{
							...GlobalStyles.textInput,
						}}
					/>
					{clientTitle.length > 0 && (
						<TouchableOpacity
							onPress={() => setClientTitle("")}
							style={{
								position: "absolute",
								right: 0,
								top: 0,
								bottom: 0,
								alignItems: "center",
								justifyContent: "center",
								marginRight: 10,
								zIndex: 100,
							}}>
							<Icon name="cancel" size={20} color={Colors.textSecondary} />
						</TouchableOpacity>
					)}
				</View>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.textSecondary,
						paddingBottom: 5,
						marginTop: 20,
					}}>
					Description:
				</Text>
				<View>
					<TextInput
						multiline
						numberOfLines={4}
						clearButtonMode="always"
						value={clientDescription}
						placeholder="Enter a party Name"
						onChangeText={(newDescription) => {
							setClientDescription(newDescription);
						}}
						style={{
							...GlobalStyles.textInput,
							height: 150,
						}}
					/>
					{clientDescription.length > 0 && (
						<TouchableOpacity
							onPress={() => setClientDescription("")}
							style={{
								position: "absolute",
								right: 0,
								bottom: 10,
								alignItems: "center",
								justifyContent: "center",
								marginRight: 10,
								zIndex: 100,
							}}>
							<Icon name="cancel" size={20} color={Colors.textSecondary} />
						</TouchableOpacity>
					)}
				</View>
			</View>
		);
	} else {
		return (
			<View style={{ padding: 10 }}>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.button.fontSize,
						width: "100%",
						marginBottom: 10,
					}}>
					Party Details
				</Text>
				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
					}}>
					Name:
				</Text>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.text,
					}}>
					{title}
				</Text>

				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
						marginTop: 20,
					}}>
					Description:
				</Text>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.text,
					}}>
					{description}
				</Text>
			</View>
		);
	}
}
