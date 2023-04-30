import React from "react";
import {
	KeyboardAvoidingView,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	View,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "../../styles/theme";
import { Dim } from "../../styles/styles";
interface ModalProps {
	visible: boolean;
	setVisible: any;
	children: any;
	fullHeight?: boolean;
	scrollable?: boolean;
	noSwipe?: boolean;
}
export default function ModalWrapper({
	visible,
	setVisible,
	children,
	fullHeight,
	scrollable,
	noSwipe,
}) {
	const containerStyle = {
		paddingHorizontal: 20,
		height: fullHeight ? Dim.height * 0.85 : Dim.height * 0.6,
		backgroundColor: Colors.background,
		alignContent: "center",
		justifyContent: "center",
	};

	return (
		<Modal
			animationIn={"slideInUp"}
			hasBackdrop={true}
			backdropColor={Colors.background}
			backdropOpacity={0.7}
			animationInTiming={300}
			animationOutTiming={300}
			onBackdropPress={() => setVisible(false)}
			supportedOrientations={["portrait", "landscape"]}
			// transparent={true}
			isVisible={visible}
			onSwipeComplete={() => {
				setVisible(false);
			}}
			swipeDirection={"down"}
			onRequestClose={() => {
				setVisible(false);
			}}
			propagateSwipe={noSwipe ? false : true}
			style={{
				padding: 0,
				margin: 0,
				left: 0,
				height: Dim.height,
			}}
		>
			<View style={containerStyle}>
				{scrollable ? (
					<ScrollView>
						{children}
						<View style={{ height: Dim.height }} />
					</ScrollView>
				) : (
					<View>{children}</View>
				)}
			</View>
		</Modal>
	);
}
