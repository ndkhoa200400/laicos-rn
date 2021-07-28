import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import { Variable } from "../styles/theme.style";
import Statistic from "../Screens/Statistic";
import { AddTransaction } from "../Screens/AddTransaction";
import HomeScreen from "../Screens/HomeScreen";
import { HistoryScreen } from "../Screens/HistoryScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

const HomeScreenComponent = () => {
	return (
		<HomeStack.Navigator  headerMode="none">
			<HomeStack.Screen name="Trang chủ" component={HomeScreen} />
			<HomeStack.Screen name="Lịch sử" component={HistoryScreen} />
		</HomeStack.Navigator>
	);
};

// @refresh reset
export const MainNavigator = () => {
	return (
		<Tab.Navigator
			tabBarOptions={{
				showLabel: false,
				activeTintColor: "#3CD3AD",
				style: {
					marginTop: 0,

					backgroundColor: Variable.BACKGROUND_ITEM_COLOR,
					height: 70,
					elevation: 10,
					shadowColor: Variable.BACKGROUND_ITEM_COLOR,
				},
			}}
		>
			<Tab.Screen
				name="HomeStack"
				component={HomeScreenComponent}
				options={{
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={
									focused
										? require("../Assets/Images/homeActive.png")
										: require("../Assets/Images/home.png")
								}
								resizeMode="contain"
							/>
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="Thống kê"
				component={Statistic}
				options={{
					tabBarLabel: "Thống kê",
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={
									focused
										? require("../Assets/Images/statisticActive.png")
										: require("../Assets/Images/statistic.png")
								}
								resizeMode="contain"
							/>
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="Thêm"
				component={AddTransaction}
				options={{
					tabBarVisible: false,
					tabBarLabel: "Thêm",
					tabBarIcon: () => (
						<View>
							<Image
								source={require("../Assets/Images/add.png")}
								resizeMode="contain"
							/>
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="Kế hoạch"
				component={HomeScreen}
				options={{
					tabBarLabel: "Kế hoạch",
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={
									focused
										? require("../Assets/Images/planActive.png")
										: require("../Assets/Images/plan.png")
								}
								resizeMode="contain"
							/>
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="Cá nhân"
				component={HomeScreen}
				options={{
					tabBarLabel: "Cá nhân",
					tabBarIcon: ({ focused }) => (
						<View>
							<Image
								source={
									focused
										? require("../Assets/Images/accountActive.png")
										: require("../Assets/Images/account.png")
								}
								resizeMode="contain"
							/>
						</View>
					),
				}}
			/>
		</Tab.Navigator>
	);
};
