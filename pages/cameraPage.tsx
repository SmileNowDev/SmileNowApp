import React, { useEffect, useRef, useState } from "react";
import {
	Dimensions,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Camera } from "expo-camera";
import Icon from "../components/icons";
import { Colors } from "../styles/theme";
const { width, height } = Dimensions.get("window");
export default function CameraPage({}) {
	const [hasPermission, setHasPermission] = useState(false);
	const [cameraType, setCameraType] = useState(Camera.Constants.Type);
	const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const [photoUri, setPhotoUri] = useState(null);
	const cameraRef = useRef(null);
	const takePhoto = async () => {
		if (cameraRef.current) {
			const { uri } = await cameraRef.current.takePictureAsync({
				quality: 0.5,
				base64: true,
			});
			setPhotoUri(uri);
			setIsPreviewing(true);
		}
	};

	const retakePhoto = () => {
		setIsPreviewing(false);
		setPhotoUri(null);
	};

	const toggleFlashMode = () => {
		setFlashMode(
			flashMode === Camera.Constants.FlashMode.off
				? Camera.Constants.FlashMode.on
				: Camera.Constants.FlashMode.off
		);
	};

	const toggleCameraType = () => {
		setCameraType(
			cameraType === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back
		);
	};
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	return (
		<SafeAreaView>
			<Text>Camera</Text>
			<Camera
				style={{ height: width - 20, width: width - 20 }}
				type={cameraType}
				flashMode={flashMode}
				ref={cameraRef}>
				<View style={styles.footer}>
					<TouchableOpacity>
						<Icon
							name="flash"
							size={30}
							type={"Ion"}
							color={Colors.textSecondary}
						/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.shutter} onPress={() => takePhoto()}>
						<View style={styles.innerShutter} />
					</TouchableOpacity>
					<TouchableOpacity>
						<Icon
							name="ios-camera-reverse"
							size={30}
							type={"Ion"}
							color={Colors.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			</Camera>
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
