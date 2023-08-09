import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Animated,
	TouchableWithoutFeedback,
} from "react-native";
import Header from "../components/layout/header";
import { ButtonStyles, Dim, GlobalStyles } from "../styles/styles";
import { Colors, Fonts } from "../styles/theme";
import Icon from "../components/core/icons";
import QRCode from "react-native-qrcode-svg";
import { useQueryClient } from "@tanstack/react-query";
import ScreenWrapper from "../components/core/screenWrapper";
import PartyLoading from "../components/party/partyLoading";
import AnimatedLottieView from "lottie-react-native";

export default function CreatePartyPage({ route, navigation }) {
	const { eventId } = route.params;
	const queryClient = useQueryClient();
	const data = queryClient.getQueryData(["event", eventId]);

	// Create Animated Values for the three lines and content
	const line1OffsetY = useRef(new Animated.Value(Dim.height)).current;
	const line2OffsetY = useRef(new Animated.Value(Dim.height)).current;
	const line3OffsetY = useRef(new Animated.Value(Dim.height)).current;
	const lottieProgress = useRef(new Animated.Value(0)).current;
	const line3Scale = useRef(new Animated.Value(1)).current;
	const contentOffsetY = useRef(new Animated.Value(Dim.height)).current;
	const skipAnimationOffsetY = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		// Start the animation
		Animated.sequence([
			Animated.parallel([
				Animated.sequence([
					Animated.timing(line1OffsetY, {
						toValue: Dim.height / 2.4,
						duration: 1000,
						useNativeDriver: true,
						delay: 0,
					}),
					Animated.timing(line1OffsetY, {
						toValue: -Dim.height,
						duration: 1000,
						useNativeDriver: true,
						delay: 250,
					}),
				]),
				Animated.sequence([
					Animated.timing(line2OffsetY, {
						toValue: Dim.height / 2.4,
						duration: 1000,
						useNativeDriver: true,
						delay: 1000,
					}),
					Animated.timing(line2OffsetY, {
						toValue: -Dim.height,
						duration: 1000,
						useNativeDriver: true,
						delay: 250,
					}),
				]),
				Animated.parallel([
					Animated.timing(lottieProgress, {
						toValue: 1,
						duration: 3000,
						useNativeDriver: true,
						delay: 3000,
					}),
					Animated.sequence([
						Animated.timing(line3OffsetY, {
							toValue: Dim.height / 2.4,
							duration: 1000,
							useNativeDriver: true,
							delay: 2000,
						}),
						Animated.timing(line3Scale, {
							toValue: 1.25,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(line3Scale, {
							toValue: 1,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(line3Scale, {
							toValue: 1.25,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(line3Scale, {
							toValue: 1,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(line3OffsetY, {
							toValue: -Dim.height,
							duration: 1000,
							useNativeDriver: true,
							delay: 1500,
						}),
					]),
				]),
			]),
			Animated.parallel([
				Animated.timing(contentOffsetY, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(skipAnimationOffsetY, {
					toValue: -Dim.height,
					duration: 500,
					useNativeDriver: true,
				}),
			]),
		]).start(() => {
			line1OffsetY.setValue(Dim.height);
			line2OffsetY.setValue(Dim.height);
			line3OffsetY.setValue(Dim.height);
			contentOffsetY.setValue(0);
			lottieProgress.setValue(0);
			line3Scale.setValue(1);
			skipAnimationOffsetY.setValue(-Dim.height);
		});
	}, []);
	if (!data) {
		return <PartyLoading variant="white_backdrop" />;
	}
	return (
		<>
			<View
				style={{
					top: 50,
					zIndex: 100,
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 4,
				}}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						padding: 10,
						zIndex: 100,
						flexDirection: "row",
						gap: 5,
						alignItems: "center",
					}}>
					<Icon
						name="chevron-left"
						size={30}
						type="Feather"
						color={Colors.textSecondary}
					/>
					<Text
						style={{
							color: Colors.textSecondary,
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}>
						Back
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						padding: 10,
						zIndex: 100,
						flexDirection: "row",
						gap: 5,
						alignItems: "center",
					}}
					onPress={() => navigation.navigate("Party", { eventId })}>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							color: Colors.textSecondary,
						}}>
						Skip to Party
					</Text>
					<Icon
						name="chevron-right"
						size={30}
						type="Feather"
						color={Colors.textSecondary}
					/>
				</TouchableOpacity>
			</View>
			<SafeAreaView style={{ flex: 1, height: Dim.height }}>
				<Animated.Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.title.fontSize,
						zIndex: 3,
						textAlign: "center",
						position: "absolute",
						left: 0,
						right: 0,
						transform: [{ translateY: line1OffsetY }],
					}}>
					Welcome
				</Animated.Text>
				<Animated.Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.title.fontSize,
						zIndex: 2,
						textAlign: "center",
						position: "absolute",
						left: 0,
						right: 0,
						transform: [{ translateY: line2OffsetY }],
					}}>
					to
				</Animated.Text>
				<AnimatedLottieView
					style={{
						width: Dim.width,
						height: Dim.height,
						position: "absolute",
						zIndex: 1,
						top: 0,
						left: 0,
					}}
					progress={lottieProgress}
					source={require("../assets/animations/confetti.json")}
				/>
				<Animated.View
					style={{
						position: "absolute",
						zIndex: 3,
						left: 0,
						right: 0,
						transform: [{ translateY: line3OffsetY }],
					}}>
					<Animated.Text
						style={{
							fontFamily: Fonts.title.fontFamily,
							fontSize: Fonts.title.fontSize,
							textAlign: "center",

							transform: [{ scale: line3Scale }],
						}}>
						{/* @ts-expect-error */}
						{data?.title}
					</Animated.Text>
					<Text
						style={{
							textAlign: "center",
							fontStyle: "italic",
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}>
						A Smile Now Experience
					</Text>
				</Animated.View>
				<Animated.View
					style={{
						zIndex: 1,
						position: "absolute",
						left: 0,
						top: 0,
						width: Dim.width,
						height: Dim.height,
						transform: [{ translateY: skipAnimationOffsetY }],
					}}>
					<TouchableOpacity
						style={{
							position: "absolute",
							width: Dim.width,
							height: Dim.height,
						}}
						onPress={() => {
							line1OffsetY.stopAnimation();
							line2OffsetY.stopAnimation();
							line3OffsetY.stopAnimation();
							contentOffsetY.stopAnimation();
							lottieProgress.stopAnimation();
						}}
					/>
				</Animated.View>
				<Animated.View
					style={{
						alignItems: "center",
						left: 0,
						right: 0,
						gap: 10,
						top: 60,
						paddingTop: 5,
						zIndex: 100,
						transform: [{ translateY: contentOffsetY }],
					}}>
					<View>
						<Text
							style={{
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
							{/* @ts-expect-error */}
							{data.inviteCode}
						</Text>
					</View>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}>
						Or they can use the in-app scanner
					</Text>
					<View
						style={{
							shadowColor: "#000",
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
						}}>
						<View
							style={{
								height: Dim.width - 130,
								width: Dim.width - 130,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 10,
								backgroundColor: Colors.background,
								overflow: "hidden",
							}}>
							{/* @ts-expect-error */}
							<QRCode value={data.inviteCode} size={Dim.width - 150} />
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("PartySettings", { eventId });
						}}
						style={{
							zIndex: 50,
							width: Dim.width - 130,
							...ButtonStyles.button,
							...ButtonStyles.outlinedTextSecondary,
						}}>
						<Icon name="settings" color={Colors.textSecondary} />
						<Text
							style={{
								...ButtonStyles.buttonText,
								color: Colors.textSecondary,
							}}>
							Adjust Party Settings
						</Text>
					</TouchableOpacity>

					<Text
						style={{
							marginTop: 40,
							fontFamily: Fonts.title.fontFamily,
							fontSize: Fonts.subTitle.fontSize,
						}}>
						Take the First Picture!
					</Text>
					<TouchableOpacity
						onPress={() => navigation.navigate("Camera", { eventId })}
						style={{
							...ButtonStyles.primary,
							width: 80,
							height: 80,
							borderRadius: 40,
							alignItems: "center",
							justifyContent: "center",
						}}>
						<Icon name="camera" size={40} type="Feather" color="white" />
					</TouchableOpacity>
					{/* <Text>My friends don't have the app yet ☹️</Text> */}
					{/* TODO - add a view with information on how to get people to download it and get started*/}
					{/* much later TODO: an interactive guide that explains the joys of the app that can be easily shared - maybe a  video */}
				</Animated.View>
			</SafeAreaView>
		</>
	);
}
