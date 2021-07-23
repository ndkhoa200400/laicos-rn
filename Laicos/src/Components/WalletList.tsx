import React, { useEffect, useRef, useState } from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { IWallet } from "../type";
import { WalletItem } from "./WalletItem";
import { globalStyles, Variable } from "../styles/theme.style";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { PaginationComponent } from "./PaginationCarousel";

const { width: screenWidth } = Dimensions.get("window");
const data: IWallet[] = [
	{
		name: "BAMEBANK",
		moneyIn: 600000,
		moneyOut: 500000,
	},
	{
		name: "NGUOIYEUBANK",
		moneyIn: 750000,
		moneyOut: 100000,
	},
	{
		name: "BODUONGBANK",
		moneyIn: 100000000,
		moneyOut: 5000000,
	},
];

export const WalletList = () => {
	const [wallets, setWallet] = useState<IWallet[]>([]);
	const [active, setActive] = useState(0);
	useEffect(() => {
		return setWallet(data);
	}, []);
	const carouselRef = useRef(null);

	const _renderItem = ({ item, index }) => {
		return (
			<View style={[styles.item,]}>
				<WalletItem wallet={item} />
			</View>
		);
	};

	return (
		<View style={styles.pagerView}>
			<View style={{marginBottom:16}}>
				<Carousel
					layout="default"
					ref={carouselRef}
					sliderWidth={screenWidth}
					sliderHeight={100}
					itemWidth={screenWidth - 80}
					data={wallets}
					renderItem={_renderItem}
					onSnapToItem={(index) => setActive(index)}
				/>
		
				<PaginationComponent items={wallets} active={active} />
			
			</View>
			
		</View>
	);
};
const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
		margin: 0,
		padding: 0,
		flexDirection: "column",
		alignContent: "flex-start",
		justifyContent: "flex-start",
		marginBottom:20,
	},
	item: {
		flex: 0,
		width: screenWidth - 80,
	},
});
