import React from "react";
import { ScrollView, View } from "react-native";
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
	type?: "center" | "bottom";
	onClose?: () => void;
}
export default function ModalWrapper({
	visible,
	setVisible,
	children,
	fullHeight = false,
	scrollable = false,
	noSwipe = false,
	type = "bottom",
	onClose = () => {},
}) {
	const containerStyle =
		type === "bottom"
			? {
					paddingHorizontal: 20,
					height: fullHeight ? Dim.height * 0.85 : Dim.height * 0.6,
					backgroundColor: Colors.background,
					alignContent: "center",
					justifyContent: "center",
					position: "absolute",
					borderTopRightRadius: 20,
					borderTopLeftRadius: 20,
					bottom: 0,
					left: 0,
					right: 0,
			  }
			: {
					height: Dim.height * 0.85,
					paddingHorizontal: 10,
					marginHorizontal: 10,
					backgroundColor: Colors.background,
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
					borderRadius: 20,
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
			  };
	const swipeToClose = {
		width: 150,
		height: 5,
		backgroundColor: Colors.textSecondary + "70",
		borderRadius: 10,
		alignSelf: "center",
		marginBottom: 10,
		position: "absolute",
		top: 10,
	};

	return (
		<Modal
			animationIn={"slideInUp"}
			hasBackdrop={true}
			backdropColor={Colors.textSecondary}
			backdropOpacity={0.7}
			animationInTiming={300}
			animationOutTiming={300}
			onBackdropPress={() => {
				onClose();
				setVisible(false);
			}}
			supportedOrientations={["portrait", "landscape"]}
			// transparent={true}
			isVisible={visible}
			onSwipeComplete={() => {
				onClose();
				setVisible(false);
			}}
			swipeDirection={"down"}
			// @ts-expect-error
			onRequestClose={() => {
				onClose();
				setVisible(false);
			}}
			propagateSwipe={noSwipe ? false : true}
			style={{
				margin: 0,
				left: 0,
				height: Dim.height,
			}}>
			{/* @ts-expect-error */}
			<View style={containerStyle}>
				{type === "bottom" && !noSwipe && (
					<>
						{/* @ts-expect-error */}
						<View style={swipeToClose} />
					</>
				)}
				{scrollable ? (
					<ScrollView>
						{children}
						<View style={{ height: Dim.height }} />
					</ScrollView>
				) : (
					<>{children}</>
				)}
			</View>
		</Modal>
	);
}
