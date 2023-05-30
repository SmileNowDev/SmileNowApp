import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	Button,
	Dimensions,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	Touchable,
	TouchableOpacity,
	View,
	ActivityIndicator,
	Platform,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Icon from "../../components/core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import postApi from "../../api/post/post";
import { imageHeight, imageWidth } from "../../pages/post";
const { width, height } = Dimensions.get("window");
export default function CameraPage({ route, navigation }) {
	const { eventId } = route.params;
	const [loading, setLoading] = useState(false);
	const [caption, setCaption] = useState("");
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [cameraType, setCameraType] = useState(CameraType.back);
	const [flashMode, setFlashMode] = useState(FlashMode.off);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const [photo, setPhoto] = useState(null);
	const cameraRef = useRef(null);
	const [remainingTime, setRemainingTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [getPostCacheFired, setGetPostCacheFired] = useState(false);
	const [expired, setExpired] = useState(false);
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
		let formData = createFormData(photo);
		const result = await postApi.uploadImage({ formData, postId });
		if (result.ok) {
			setLoading(false);
			navigation.navigate("Party", { eventId });
		}
	}
	async function handlePost() {
		setLoading(true);
		const result = await postApi.create({ eventId, caption });
		if (result.ok) {
			//@ts-expect-error
			uploadImage(result.data._id);
		} else {
			setLoading(false);
			Alert.alert("Error", "Something went wrong, please try again later.");
		}
	}
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			if (status !== "granted") {
				Alert.alert("Sorry, we need camera permissions to make this work!");
			}
		})();
	}, []);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				alignItems: "center",
			}}>
			{expired ? (
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
							width: width - 20,
							...ButtonStyles.buttonLarge,
							...ButtonStyles.primary,
						}}
						onPress={() => navigation.goBack()}>
						<Text style={{ ...ButtonStyles.buttonTextLarge }}>Go Back</Text>
					</TouchableOpacity>
				</View>
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
							<Text
								style={{
									fontFamily: Fonts.button.fontFamily,
									fontSize: Fonts.button.fontSize,
									textAlign: "left",
									width: width - 20,
								}}>
								Time Remaining: {remainingTime.toString()}
							</Text>

							<TextInput
								placeholderTextColor={Colors.textSecondary}
								style={{
									...GlobalStyles.textInput,
									marginTop: 10,
									width: width - 20,
									height: 60,
								}}
								placeholder="Caption Your Photo"
								value={caption}
								onChangeText={setCaption}
								returnKeyType="done"
							/>
							<View
								style={{
									position: "relative",
									height: imageHeight,
									width: imageWidth,
									marginTop: 10,
								}}>
								{loading ? (
									<ActivityIndicator
										size={"large"}
										color={Colors.primary}
										style={{
											height: width - 20,
											width: width - 20,
											position: "absolute",
											top: (width - 20) / 2,
											zIndex: 100,
										}}
									/>
								) : (
									<></>
								)}
								<Image
									source={{ uri: photo?.uri }}
									style={{ width: "100%", height: "100%", borderRadius: 10 }}
								/>
								<TouchableOpacity
									onPress={() => retakePhoto()}
									style={{
										position: "absolute",
										top: 20,
										left: 20,
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
							</View>

							<TouchableOpacity
								style={{
									marginTop: 20,
									width: width - 20,
									...ButtonStyles.buttonLarge,
									...ButtonStyles.primary,
								}}
								onPress={() => handlePost()}>
								<Text style={{ ...ButtonStyles.buttonTextLarge }}>Post</Text>
							</TouchableOpacity>
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
