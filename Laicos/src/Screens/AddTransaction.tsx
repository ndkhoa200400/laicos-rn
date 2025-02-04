import React, { useEffect, useState } from "react";
import {
	BackHandler,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import Modal from "react-native-modalbox";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradButton } from "../Components/LinearGradButton";
import { Variable } from "../styles/theme.style";
import { IImage, ITransaction, ITransactionGroup, IWallet } from "../type";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { transaction, wallets } from "../data";
import { ChosenGroupView } from "../Components/ChosenGroupVIew";
import { BillImage } from "../Components/BillImage";
import { TitleHeader } from "./Title";
import { formatter } from "../Utils/format";

export const AddTransaction = ({ navigation, route }) => {
	const [chosenGroup, setChosenGroup] = useState<ITransactionGroup | null>(
		null
	);
	const [money, setMoney] = useState("0");
	const [image, setImages] = useState<IImage[]>([]);
	const [chosenDate, setChosenDate] = useState<Date>(new Date());
	const [isCalanderOpened, setOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [chosenWallet, setChosenWallet] = useState<IWallet>(wallets[0]);
	const getMarkedDate = () => {
		const markedDate: Record<string, any> = {};

		markedDate[moment(chosenDate).format("YYYY-MM-DD")] = {
			selected: true,
			selectedColor: Variable.GREEN_LIGHT_COLOR,
		};
		return markedDate;
	};
	useEffect(() => {
		const backAction = () => {
			resetState();
			navigation.goBack();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => backHandler.remove();
	}, []);

	const predictGroup = () => {
		const toMoney = parseInt(money);
		if (toMoney >= 0 && chosenGroup == null) {
			const predict: Record<string, number> = {};
			let _max = 0;
			let _group: ITransactionGroup | null | undefined = null;
			for (const trans of transaction) {
				if (trans.money) {
					if (Math.abs(toMoney - trans.money) <= 1) {
						if (predict[trans.group!.name]) {
							predict[trans.group!.name]++;
						} else {
							predict[trans.group!.name] = 1;
						}
						if (predict[trans.group!.name] > _max) {
							_max = predict[trans.group!.name];
							_group = trans.group;
						}
					}
				}
			}
			if (_group && predict[_group!.name] >= 3) {
				setChosenGroup(_group);
			}
		}
	};

	useEffect(predictGroup, [money])
	const resetState = () => {
		setMoney("0");
		setChosenDate(new Date());
		setDescription("");
		setChosenGroup(null);
		setChosenWallet(wallets[0]);
		setImages([]);
	};
	const createNewTransaction = () => {
		const toMoney = parseInt(money);
		if (image.length > 0 || (chosenGroup && toMoney >= 0)) {
			const newTransaction: ITransaction = {
				date: chosenDate,
				description: description,
				wallet: chosenWallet.name,
				money: toMoney,
				group: chosenGroup,
				images: image,
			};

			transaction.push(newTransaction);
			if (chosenGroup)
				for (const wallet of wallets) {
					if (wallet.name === chosenWallet.name) {
						if (chosenGroup.type === "EARN") {
							wallet.moneyIn += toMoney;
						} else {
							wallet.moneyOut += toMoney;
						}
						break;
					}
				}
			resetState();
			navigation.reset({
				index: 0,
				routes: [{ name: "Trang chủ" }],
			});
			navigation.goBack();
		}
	};
	const getFormattedMoney = (value: string) => {
		return formatter(parseInt(removeComma(value)));
	};
	const removeComma = (value: string) => {
		const re = new RegExp(",", "g");
		return value.replace(re, "");
	};
	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
			<ScrollView style={[styles.container]}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
				<TouchableOpacity
					onPress={() => {
						resetState();
						navigation.goBack();
					}}
					style={{ flex: 0 }}
				>
					{/* <View style={[styles.title]}>
						<Image
							source={require("../Assets/Images/Icons/ic_back.png")}
							style={{marginRight: 10 }}
						></Image>
						<Text style={[styles.titleText]}>
							Thêm chi tiêu mới
						</Text>
					</View> */}
					<TitleHeader title={"Thêm chi tiêu mới"} />
				</TouchableOpacity>
				{/* Chụp ảnh */}
				<BillImage
					navigation={navigation}
					image={image}
					setImages={setImages}
				/>
				{/* Form input */}
				<View style={[styles.form]}>
					{/*Calculator*/}
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("Calculator", {
								money: money,
								setMoney: setMoney,
							})
						}
					>
						<Text style={[styles.input]}>
							{getFormattedMoney(money)}đ
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("Chọn nhóm", {
								setChosenGroup: setChosenGroup,
								chosenGroup: chosenGroup,
							})
						}
					>
						{chosenGroup ? (
							<ChosenGroupView chosenGroup={chosenGroup} />
						) : (
							<Text style={[styles.placeholder]}>Chọn nhóm</Text>
						)}
					</TouchableOpacity>
					{/* Thêm ghi chú */}
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("Thêm ghi chú", {
								setDescription,
								description,
							})
						}
					>
						{description ? (
							<Text style={[styles.input]}>{description}</Text>
						) : (
							<Text style={[styles.placeholder]}>
								Thêm ghi chú
							</Text>
						)}
					</TouchableOpacity>
					{/* <TextInput
						style={[styles.input]}
						placeholder="Thêm ghi chú"
						placeholderTextColor="white"
						onChangeText={setDescription}
						value={description}
					/> */}

					{/* Chọn ngày tháng */}
					<TouchableOpacity onPress={() => setOpen(true)}>
						{new Date().toLocaleDateString() ===
						chosenDate.toLocaleDateString() ? (
							<Text style={[styles.input]}>Hôm nay</Text>
						) : (
							<Text style={[styles.input]}>
								{moment(chosenDate).format("DD-MM-YYYY")}
							</Text>
						)}
					</TouchableOpacity>
					{/* Chọn ví */}
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("Chọn ví", {
								chosenWallet: chosenWallet,
								setChosenWallet: setChosenWallet,
							})
						}
					>
						<Text style={[styles.input]}>{chosenWallet.name}</Text>
					</TouchableOpacity>
				</View>

				{/* Buttons */}
				<View style={[{ flex: 1, marginTop: 16 }]}>
					<LinearGradButton
						color={Variable.BUTTON_PRIMARY}
						text={"LƯU"}
						action={createNewTransaction}
					/>
				</View>
			</ScrollView>
			<Modal
				entry="bottom"
				position="bottom"
				style={styles.modalView}
				isOpen={isCalanderOpened}
				backdrop={true}
				backdropColor={Variable.BACKGROUND_COLOR}
				coverScreen={true}
				onClosed={() => setOpen(false)}
				backButtonClose={true}
			>
				<Calendar
					enableSwipeMonths={true}
					markedDates={getMarkedDate()}
					onDayPress={(date) => {
						setChosenDate(new Date(date.dateString));
						setOpen(false);
					}}
					theme={{
						backgroundColor: Variable.BACKGROUND_COLOR,
						calendarBackground: Variable.BACKGROUND_COLOR,
						selectedDayBackgroundColor: Variable.GREEN_LIGHT_COLOR,
						selectedDayTextColor: "white",
						todayTextColor: "#00adf5",
						dayTextColor: "white",
						textDisabledColor: "#B1B1B1",
						arrowColor: "white",
						monthTextColor: "white",
						indicatorColor: "white",
					}}
				/>
			</Modal>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 16,
		marginHorizontal: 16,
	},
	title: {
		marginHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	titleText: {
		color: "white",
		fontSize: Variable.FONT_SIZE_LARGE,
		fontWeight: "bold",
	},
	form: {
		backgroundColor: Variable.BACKGROUND_ITEM_COLOR,
		borderRadius: Variable.BORDER_RADIUS_MEDIUM,
		paddingVertical: 8,
		marginTop: 16,
	},
	input: {
		margin: 14,
		borderBottomWidth: 1,
		borderColor: "white",
		color: "white",
		fontSize: Variable.FONT_SIZE_MEDIUM,
		padding: 6,
	},
	modalView: {
		margin: 0,
		justifyContent: "flex-end",
		height: 300,
	},
	placeholder: {
		margin: 14,
		borderBottomWidth: 1,
		borderColor: "white",
		color: Variable.GREY_COLOR,
		fontSize: Variable.FONT_SIZE_MEDIUM,
		padding: 6,
	},
});
