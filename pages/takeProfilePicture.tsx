import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Alert,
	Dimensions,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Icon from "../components/core/icons";
import { Colors, Fonts } from "../styles/theme";
import userApi from "../api/user/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Context } from "../providers/provider";
import { Button } from "../components/SmileNowUI";
import ScreenWrapper from "../components/core/screenWrapper";
import Header from "../components/layout/header";
const { width, height } = Dimensions.get("window");
export default function CameraPage({ route, navigation }) {
	const queryClient = useQueryClient();
	const { userId } = useContext(Context);
	const [loading, setLoading] = useState(false);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const cameraType = CameraType.front;
	const [flashMode, setFlashMode] = useState(FlashMode.off);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const [photo, setPhoto] = useState(null);
	const cameraRef = useRef(null);

	//taking photo
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

	//saving photo

	const { isLoading, mutate, isError } = useMutation(
		(formData) => userApi.uploadAvatar({ formData }),
		{
			onSuccess: (data) => {
				// console.log("pfp uploaded");
				// console.log("postId", data.data);
				// uploadImage();
				// uploadImage(data._id);
				// let userData = queryClient.getQueryData(["user", userId]);
				// console.log("user Data", userData);
				queryClient.invalidateQueries(["user", userId]);
				queryClient.setQueryData(["user", userId], (oldData) => {
					return {
						//@ts-expect-error
						...oldData,
						//@ts-expect-error
						pic: data.pic,
					};
				});
			},
			onError: (error) => {
				// console.log("error", error);
				Alert.alert(
					"Image Upload Failed",
					"Oops, something went wrong, please try again later."
				);
			},
		}
	);
	const createFormData = (photo) => {
		let formData = new FormData();
		let filename = photo.uri.split("/").pop();
		let match = /\.(\w+)$/.exec(filename);
		let type = match ? `image/${match[1]}` : `image`;
		//@ts-expect-error
		formData.append("image", { uri: photo.uri, name: filename, type });
		return formData;
	};

	async function handleSave() {
		let formData = createFormData(photo);
		// console.log("formData", formData._parts[0][1]);
		// @ts-expect-error
		mutate(formData, {
			onSuccess: (data) => {
				navigation.navigate("Profile");
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

	return (
		<SafeAreaView
			style={{
				flex: 1,
				alignItems: "center",
			}}>
			<Header title="Edit Profile Picture" goBack />
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
					{isLoading ? (
						<ActivityIndicator
							size={"large"}
							color={Colors.primary}
							style={{
								height: width - 20,
								width: width - 20,
								position: "absolute",
								top: width / 2,
								zIndex: 100,
							}}
						/>
					) : (
						<></>
					)}
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
					<View
						style={{
							position: "absolute",
							bottom: 100,
							alignItems: "center",
							gap: 10,
						}}>
						<Button
							variant="outlined"
							colorScheme="secondary"
							style={{ width: width * 0.8 }}
							size="lg"
							onPress={() => retakePhoto()}>
							Retake Photo
						</Button>
						<Button
							style={{ width: width * 0.8 }}
							size="lg"
							onPress={() => handleSave()}>
							Save Photo
						</Button>
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
