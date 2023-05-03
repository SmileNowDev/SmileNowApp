// File: Reusable loading wrapper
// Default
import React, { useCallback, useState } from "react";
// Theming
// Libraries
import {
	ActivityIndicator,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";

type ScreenWrapperProps = {
	scrollEnabled?: any;
	onRefresh?: any;
	loading?: any;
	onBottomScroll?: any;
	children?: any;
	bottomLoading?: any;
	style?: any;
	keyboardShouldPersistTaps?: "always" | "never" | "handled";
};

export default function ScreenWrapper({
	scrollEnabled,
	onRefresh,
	loading,
	onBottomScroll,
	children,
	bottomLoading,
	style,
	keyboardShouldPersistTaps = "handled",
}: ScreenWrapperProps) {
	const [refreshing, setRefreshing] = useState(false);

	const isCloseToBottom = ({
		layoutMeasurement,
		contentOffset,
		contentSize,
	}) => {
		const paddingToBottom = 1000;
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		);
	};
	// @ts-expect-error
	const onRefreshWrapper = useCallback(async () => {
		setRefreshing(true);
		onRefresh();
		setRefreshing(false);
	});

	return (
		<>
			<ScrollView
				refreshControl={
					onRefresh ? (
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh ? onRefreshWrapper : null}
						/>
					) : null
				}
				onScroll={({ nativeEvent }) => {
					if (isCloseToBottom(nativeEvent)) {
						if (onBottomScroll) {
							onBottomScroll();
						}
					}
				}}
				scrollEventThrottle={400}
				scrollEnabled={scrollEnabled ? true : false}
				style={
					style
						? style
						: {
								borderRadius: 10,
								paddingHorizontal: 8,
						  }
				}
				keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			>
				<View style={{ alignItems: "center" }}>
					{loading ? (
						<ActivityIndicator />
					) : (
						<View
							style={{
								flex: 1,
								width: "100%",
								zIndex: 1,
							}}
						>
							{children}
						</View>
					)}
					{bottomLoading && <ActivityIndicator />}
					<View style={{ height: 100 }} />
				</View>
			</ScrollView>
		</>
	);
}
