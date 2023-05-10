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
			{!isPreviewing ? (
				<>
					<View style={{ height: 100, marginTop: 30 }}>
						<Text
							style={{
								fontFamily: Fonts.title.fontFamily,
								fontSize: 40,
							}}>
							Smile Now!
						</Text>
					</View>
					<Camera
						style={{
							height: width - 20,
							width: width - 20,
							borderRadius: 20,
							overflow: "hidden",
							marginTop: 20,
						}}
						type={cameraType}
						flashMode={flashMode}
						ref={cameraRef}></Camera>

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
					<TextInput
						placeholderTextColor={Colors.textSecondary}
						style={{
							...GlobalStyles.textInput,
							marginTop: 30,
							width: width - 20,
							height: 100,
						}}
						placeholder="Caption Your Photo"
						value={caption}
						onChangeText={setCaption}
					/>
					<View
						style={{
							position: "relative",
							height: width - 20,
							width: width - 20,
							marginTop: 20,
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
