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
	Platform,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Icon from "../components/icons";
import { Colors, Fonts } from "../styles/theme";
import { ButtonStyles, GlobalStyles } from "../styles/styles";
import postApi from "../api/post/post";
import userApi from "../api/user/user";
const { width, height } = Dimensions.get("window");
export default function CameraPage({ route, navigation }) {
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const cameraType = CameraType.front;
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
			navigation.goBack();
		}
	}
	async function handleSave() {
		let formData = createFormData(photo);
		const result = await userApi.uploadAvatar({ formData });
		if (result.ok) {
			//@ts-expect-error
			uploadImage(result.data._id);
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
							SmileNow!
						</Text>
					</View>
					<Camera
						style={{
							height: width - 20,
							width: width - 20,
							borderRadius: (width - 20) / 2,
							overflow: "hidden",

							position: "absolute",
							top: width / 2,
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
						<View style={{ opacity: 0 }}>
							<Icon name="" size={30} />
						</View>
					</View>
				</>
			) : (
				<>
					<View style={{ height: 100, marginTop: 30 }}>
						<Text
							style={{
								fontFamily: Fonts.title.fontFamily,
								fontSize: 40,
							}}>
							Looks Great!
						</Text>
					</View>
					<Image
						source={{ uri: photo?.uri }}
						style={{
							position: "absolute",
							top: width / 2,
							height: width - 20,
							width: width - 20,
							borderRadius: (width - 20) / 2,
						}}
					/>
					<View style={{ position: "absolute", bottom: 100 }}>
						<TouchableOpacity
							onPress={() => retakePhoto()}
							style={{
								...ButtonStyles.button,
								...ButtonStyles.primaryOutlined,
							}}>
							<Icon
								name="image-remove"
								size={20}
								type={"MaterialCommunity"}
								color={Colors.primary}
							/>
							<Text
								style={{
									...ButtonStyles.buttonText,
									color: Colors.primary,
								}}>
								Retake
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								marginTop: 10,
								width: width - 20,
								...ButtonStyles.button,
								...ButtonStyles.primary,
							}}
							onPress={() => handleSave()}>
							<Text style={{ ...ButtonStyles.buttonTextLarge }}>
								Save Photo
							</Text>
						</TouchableOpacity>
					</View>
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
