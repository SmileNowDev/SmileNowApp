import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
	Animated,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Icon from "../../components/core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { ButtonStyles, Dim, GlobalStyles } from "../../styles/styles";
import postApi from "../../api/post/post";
import { imageHeight, imageWidth } from "../../pages/post";
import {
	QueryClient,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
export default function CameraPage({ route, navigation }) {
	const queryClient = useQueryClient();
	const { eventId } = route.params;

	const [loading, setLoading] = useState(false);
	const [caption, setCaption] = useState("");
	const [cameraType, setCameraType] = useState(CameraType.back);
	const [flashMode, setFlashMode] = useState(FlashMode.off);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const [photo, setPhoto] = useState(null);
	const cameraRef = useRef(null);
	const [remainingTime, setRemainingTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [getPostCacheFired, setGetPostCacheFired] = useState(false);
	const [expired, setExpired] = useState(false);

	const keyboardOffset = useRef(new Animated.Value(0)).current;

	async function getPostCache() {
		const result = await postApi.getPostCache({ eventId });
		if (result.ok) {
			if (result.data) {
				//@ts-expect-error
				setEndTime(result.data.endTime);
			} else {
				setExpired(true);
			}
			setGetPostCacheFired(true);
		} else {
			// handle error
			setExpired(true);
		}
	}
	useEffect(() => {
		getPostCache();
	}, [eventId]);

	useEffect(() => {
		if (endTime && getPostCacheFired) {
			const interval = setInterval(() => {
				const now = new Date().getTime();
				const end = new Date(endTime).getTime();
				const remaining = end - now;
				const minutes = Math.floor(
					(remaining % (1000 * 60 * 60)) / (1000 * 60)
				);
				const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
				const remainingTime = `${minutes.toString().padStart(2, "0")}:${seconds
					.toString()
					.padStart(2, "0")}`;
				setRemainingTime(remainingTime);
				if (remaining <= 0) {
					setExpired(true);
					clearInterval(interval);
				}
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [endTime, getPostCacheFired]);

	const takePhoto = async () => {
		if (cameraRef.current) {
			const result = await cameraRef.current.takePictureAsync({
				quality: 0.1,
				base64: true,
			});
			setPhoto(result);
			setIsPreviewing(true);
		}
	};

	const retakePhoto = () => {
		setIsPreviewing(false);
		setPhoto(null);
	};

	const toggleFlashMode = () => {
		setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off);
	};

	const toggleCameraType = () => {
		setCameraType(
			cameraType === CameraType.back ? CameraType.front : CameraType.back
		);
	};
	const createFormData = (photo, body = {}) => {
		let formData = new FormData();
		let filename = photo.uri.split("/").pop();
		let match = /\.(\w+)$/.exec(filename);
		let type = match ? `image/${match[1]}` : `image`;
		//@ts-expect-error
		formData.append("image", { uri: photo.uri, name: filename, type });
		return formData;
	};

	async function uploadImage(postId: string) {
		console.log("Uploading image");
		let formData = createFormData(photo);
		const result = await postApi.uploadImage({ formData, postId });
		//@ts-expect-error;
		console.log("upload image result: ", result.data.uri);
		if (result.ok) {
			//@ts-expect-error;
			return result.data.uri;
			// navigation.navigate("Party", { eventId });
		}
	}

	const { mutate, status, error, isLoading } = useMutation(
		() => postApi.create({ eventId, caption }),
		{
			onSuccess: async (newPost) => {
				console.log("inside of on success of the post mutation");
				let newPostData: Object = newPost?.data;
				console.log("new post: ", newPostData);
				// @ts-expect-error
				let imageSrc = await uploadImage(newPost.data._id);
				queryClient.setQueryData(["posts", eventId], (oldData) => {
					console.log("oldData: ", oldData);
					let _newPost = {
						...newPostData,
						src: imageSrc,
					};
					console.log("new post in cache", _newPost);
					//@ts-expect-error
					if (!oldData?.pages || !Array.isArray(oldData.pages)) {
						console.log("no old data");
						return {
							pageParams: 1,
							pages: [_newPost],
						}; // Return the new data as the only page
					} else {
						console.log("new post: ", newPost.data);

						//@ts-expect-error
						const firstPage = [_newPost, ...(oldData.pages[0].posts || [])];

						//@ts-expect-error
						const newPages = [firstPage, ...oldData.pages.slice(1)];
						return {
							//@ts-expect-error,
							pageParams: oldData.pageParams,
							pages: newPages,
						};
					}
				});
			},
		}
	);

	async function handlePost() {
		mutate(null, {
			onSuccess: (newPost) => {
				console.log("new post: ", newPost.data);
				navigation.navigate("Party", { eventId, newPost: newPost.data });
			},
			onError: (error) => {
				console.log("error: ", error);
				Alert.alert("Error", "Something went wrong, please try again later.");
			},
		});
	}
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			if (status !== "granted") {
				Alert.alert("Sorry, we need camera permissions to make this work!");
			}
		})();
	}, []);
	function ExpiredMessage() {
		return (
			<View style={{ justifyContent: "center", height: "100%" }}>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: 40,
						textAlign: "center",
					}}>
					EXPIRED
				</Text>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: 20,
						textAlign: "center",
					}}>
					Sorry! You waited too long...
				</Text>
				<TouchableOpacity
					style={{
						marginTop: 20,
						width: Dim.width - 20,
						...ButtonStyles.buttonLarge,
						...ButtonStyles.primary,
					}}
					onPress={() => navigation.goBack()}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				alignItems: "center",
			}}>
			{expired ? (
				<ExpiredMessage />
			) : (
				<>
					{!isPreviewing ? (
						<>
							<View style={{ marginTop: 10, marginBottom: 10 }}>
								<Text
									style={{
										fontFamily: Fonts.title.fontFamily,
										fontSize: 40,
									}}>
									Smile Now!
								</Text>
							</View>

							<Text
								style={{
									fontFamily: Fonts.body.fontFamily,
									fontSize: Fonts.body.fontSize,
								}}>
								Time Remaining
							</Text>
							<Text
								style={{
									fontFamily: Fonts.title.fontFamily,
									fontSize: 40,
								}}>
								{remainingTime.toString()}
							</Text>
							<View
								style={{
									borderRadius: 20,
									shadowOpacity: 0.25,
									shadowOffset: { width: 0, height: 4 },
									shadowRadius: 2,
									elevation: 2,
									shadowColor: "rgba(0, 0, 0, 0.25)",
								}}>
								<Camera
									style={{
										height: imageHeight,
										width: imageWidth,
										borderRadius: 20,
										overflow: "hidden",
										marginTop: 10,
									}}
									type={cameraType}
									flashMode={flashMode}
									ref={cameraRef}></Camera>
							</View>

							<View style={styles.footer}>
								<TouchableOpacity onPress={() => toggleFlashMode()}>
									<Icon
										name="flash"
										size={30}
										type={"Ion"}
										color={
											flashMode === FlashMode.off
												? Colors.textSecondary
												: Colors.primary
										}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.shutter}
									onPress={() => takePhoto()}>
									<View style={styles.innerShutter} />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => toggleCameraType()}>
									<Icon
										name="ios-camera-reverse"
										size={30}
										type={"Ion"}
										color={Colors.textSecondary}
									/>
								</TouchableOpacity>
							</View>
						</>
					) : (
						<>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									width: Dim.width - 20,
								}}>
								<Text
									style={{
										fontFamily: Fonts.button.fontFamily,
										fontSize: Fonts.button.fontSize,
										textAlign: "left",
									}}>
									Time Remaining: {remainingTime.toString()}
								</Text>
								<TouchableOpacity
									style={{
										...ButtonStyles.button,
										...ButtonStyles.primary,
									}}
									onPress={() => handlePost()}>
									{isLoading ? (
										<View>
											<ActivityIndicator color={Colors.background} size={15} />
										</View>
									) : (
										<Text style={{ ...ButtonStyles.buttonText }}>Post</Text>
									)}
								</TouchableOpacity>
							</View>
							<Animated.View
								// keyboard handling animated view
								style={{
									padding: 10,
									paddingBottom: 10,
									shadowOpacity: 0.25,
									shadowOffset: { width: 0, height: 4 },
									shadowRadius: 2,
									elevation: 2,
									shadowColor: "rgba(0, 0, 0, 0.25)",
									backgroundColor: Colors.background,
									borderRadius: 4,
									marginTop: 10,
									transform: [
										{
											translateY: keyboardOffset.interpolate({
												inputRange: [0, 1],
												outputRange: [0, -imageHeight * 0.5], // adjust this value to move as much as you need
											}),
										},
									],
								}}>
								{loading ? (
									<ActivityIndicator
										size={"large"}
										color={Colors.primary}
										style={{
											height: Dim.width - 20,
											width: Dim.width - 20,
											position: "absolute",
											top: (Dim.width - 20) / 2,
											zIndex: 100,
										}}
									/>
								) : (
									<></>
								)}

								<Image
									source={{ uri: photo?.uri }}
									style={{
										width: imageWidth,
										height: imageHeight,
										borderRadius: 5,
									}}
								/>

								<TextInput
									placeholderTextColor={Colors.textSecondary}
									style={{
										...GlobalStyles.textInput,
										marginTop: 10,
										height: 60,
										width: imageWidth,
									}}
									placeholder="Caption Your Photo"
									onBlur={() => {
										console.log("HERE 1");
										// set offset back to 0
										Animated.timing(keyboardOffset, {
											toValue: 0,
											duration: 500,
											useNativeDriver: false,
										}).start();
										console.log(keyboardOffset);
									}}
									onFocus={() => {
										// set offset to move image above keyboard
										console.log("HERE 2");
										Animated.timing(keyboardOffset, {
											toValue: 1,
											duration: 500,
											useNativeDriver: false,
										}).start();
										console.log(keyboardOffset);
									}}
									value={caption}
									onChangeText={setCaption}
									returnKeyType="done"
								/>
								<TouchableOpacity
									onPress={() => retakePhoto()}
									style={{
										position: "absolute",
										top: 20,
										left: 20,
										zIndex: 150,
										...ButtonStyles.buttonSmall,
										backgroundColor: Colors.foreground,
									}}>
									<Icon
										name="image-remove"
										size={20}
										type={"MaterialCommunity"}
										color={Colors.textSecondary}
									/>
									<Text
										style={{
											...ButtonStyles.buttonTextSmall,
											color: Colors.textSecondary,
										}}>
										Retake
									</Text>
								</TouchableOpacity>
							</Animated.View>
						</>
					)}
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 40,
		position: "absolute",
		bottom: 80,
	},
	shutter: {
		height: 80,
		width: 80,
		borderRadius: 40,
		borderStyle: "solid",
		borderWidth: 5,
		borderColor: Colors.primary,
		padding: 5,
	},
	innerShutter: {
		height: "100%",
		width: "100%",
		borderRadius: 50,
		backgroundColor: Colors.primary,
	},
});
