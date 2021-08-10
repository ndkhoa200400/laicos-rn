import { Picker } from "@react-native-picker/picker"
import React, { FC, useEffect, useState } from "react"
import { Dimensions, Text, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
} from "victory-native"
import StatisticTabItem from "../Components/StatisticTabItem"
import { transaction } from "../data"
import { globalStyles, Variable } from "../styles/theme.style"

const Statistic: FC<{}> = () => {
  const [selectedLabelChartType, setSelectedLabelChartType] =
    useState<string>("month")
  const [isShowHeader, setIsShowHeader] = useState(true)

  const [transactionData, setTransactionData] = useState<any[]>([])

  const mergeTransaction = () => {
    const parentsInData: any[] = []
    for (let i = 0; i < transaction.length; i++) {
      if (transaction[i] && transaction[i].group)
        if (transaction[i]?.group?.parent === null) {
          parentsInData.find(
            (e) => e.parentId === transaction[i]?.group?.id
          ) === undefined &&
            parentsInData.push({
              parentName: transaction[i]?.group?.name,
              parentId: transaction[i]?.group?.id,
              parentIcon: transaction[i]?.group?.icon,
              money: 0,
              type: transaction[i]?.group?.type,
              childs: [],
            })
        }
    }
    for (let i = 0; i < transaction.length; i++) {
      if (transaction[i] && transaction[i].group)
        if (transaction[i]?.group?.parent === null) {
          let idx = parentsInData.findIndex(
            (e) => e.parentId === transaction[i]?.group?.id
          )
          if (idx >= 0) parentsInData[idx].money += transaction[i].money
        } else {
          let idx = parentsInData.findIndex(
            (e) => e.parentId === transaction[i]?.group?.parent
          )
          if (idx >= 0) parentsInData[idx].childs.push(transaction[i])
        }
    }

    return parentsInData
  }

  useEffect(() => {
    setTransactionData(mergeTransaction())
  }, [])

  return (
    <View>
      {isShowHeader && (
        <View>
          <Text
            style={[
              globalStyles.fontSizeLarge,
              globalStyles.whiteText,
              {
                fontWeight: "bold",
                paddingTop: 10,
                paddingLeft: 15,
              },
            ]}
          >
            Thống kê
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "flex-end",
              marginTop: 15,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 15,
                marginEnd: 10,
                marginBottom: 10,
              }}
            >
              <Picker
                selectedValue={selectedLabelChartType}
                dropdownIconColor="white"
                style={{
                  color: "white",
                  width: 130,
                }}
                onValueChange={(itemValue) =>
                  setSelectedLabelChartType(itemValue)
                }
              >
                <Picker.Item label="Ngày" value="day" />
                <Picker.Item label="Tuần" value="week" />
                <Picker.Item label="Tháng" value="month" />
                <Picker.Item label="Năm" value="year" />
              </Picker>
            </View>
          </View>
          <View>
            <MultipleBarChart />
          </View>
        </View>
      )}
      <View
        style={{
          backgroundColor: "#212230",
          width: 70,
          height: 25,
          paddingTop: 10,
          alignSelf: "center",
          alignItems: "center",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <Text
          onPress={() => setIsShowHeader(!isShowHeader)}
          style={[
            {
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderLeftWidth: 12,
              borderRightWidth: 12,
              borderBottomWidth: 8,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "white",
            },
            !isShowHeader && {
              transform: [{ rotate: "180deg" }],
            },
          ]}
        />
      </View>
      <View
        style={{
          backgroundColor: "#212230",
          height: "100%",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
            paddingTop: 10,
          }}
        >
          Thống kê trong tháng 7
        </Text>
        <ScrollableTabView
          tabBarPosition="top"
          tabBarInactiveTextColor="white"
          tabBarUnderlineStyle={{
            backgroundColor: Variable.GREEN_LIGHT_COLOR,
            elevation: 20,
          }}
          tabBarActiveTextColor={Variable.GREEN_LIGHT_COLOR}
          tabBarTextStyle={{ fontSize: 16 }}
        >
          <StatisticTabItem
            type="LOAN"
            data={transactionData}
            tabLabel="Khoản vay"
          />
          <StatisticTabItem
            type="SPEND"
            data={transactionData}
            tabLabel="Khoản chi"
          />

          <StatisticTabItem
            type="EARN"
            data={transactionData}
            tabLabel="Khoản thu"
          />
        </ScrollableTabView>
      </View>
    </View>
  )
}
export default Statistic

const MultipleBarChart = () => {
  const screenWidth = Dimensions.get("window").width
  const [isShowDetail, setIsShowDetail] = useState(false)
  return (
    <>
      <VictoryChart height={260}>
        <VictoryLegend
          x={40}
          y={0}
          orientation="horizontal"
          gutter={90}
          data={[
            {
              name: "Vay",
              symbol: { fill: "white" },
              labels: { fill: "white" },
            },
            {
              name: "Chi",
              symbol: { fill: "#F34A2F" },
              labels: { fill: "white" },
            },
            {
              name: "Thu",
              symbol: { fill: "#3CD3AD" },
              labels: { fill: "#3CD3AD" },
            },
          ]}
        />
        <VictoryAxis
          crossAxis
          style={{
            axis: { stroke: "#B1B1B1", strokeWidth: 0.9 },
            tickLabels: {
              fill: ({ index }) => (+index === 2 ? "#3CD3AD" : "#B1B1B1"),
            },
          }}
        />
        <VictoryAxis
          domain={[0, 12]}
          standalone={false}
          dependentAxis
          label="( triệu Đồng )"
          orientation="left"
          style={{
            grid: {
              stroke: ({ index }) => (+index % 2 !== 0 ? "#B1B1B1" : "none"),
              strokeWidth: 0.5,
            },
            tickLabels: {
              fill: ({ index }) => (+index % 2 !== 0 ? "#B1B1B1" : "none"),
            },
            axisLabel: { fill: "#B1B1B1" },
          }}
        />
        <VictoryGroup
          offset={10}
          colorScale={"qualitative"}
          animate={{ duration: 500, onLoad: { duration: 500 } }}
        >
          <VictoryBar
            name="vay"
            style={{
              data: { fill: "white" },
            }}
            data={[
              { x: "MAY", y: 2 },
              { x: "JUN", y: 3 },
              { x: "JUL", y: 2 },
              { x: "AUG", y: 3 },
              { x: "SEP", y: 2 },
            ]}
          />
          <VictoryBar
            name="thu"
            style={{
              data: { fill: "#F34A2F" },
            }}
            data={[
              { x: "MAY", y: 8 },
              { x: "JUN", y: 5 },
              { x: "JUL", y: 7 },
              { x: "AUG", y: 9 },
              { x: "SEP", y: 10 },
            ]}
          />

          <VictoryBar
            name="chi"
            style={{
              data: { fill: "#3CD3AD" },
            }}
            data={[
              { x: "MAY", y: 11 },
              { x: "JUN", y: 9 },
              { x: "JUL", y: 10 },
              { x: "AUG", y: 12 },
              { x: "SEP", y: 10 },
            ]}
          />
        </VictoryGroup>
      </VictoryChart>
      <Text
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          height: 260 - 70,
          width: 50,
          bottom: 20,
          left: screenWidth / 2.25,
          zIndex: 9999,
        }}
        onPress={() => {
          setIsShowDetail(!isShowDetail)
        }}
      ></Text>
      {isShowDetail && (
        <View
          style={{
            position: "absolute",
            backgroundColor: "#212230",
            height: 50,
            width: 80,
            top: 50,
            left: screenWidth / 2.4,
            borderRadius: 10,
            paddingLeft: 10,
            paddingRight: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderWidth: 0.4,
            borderColor: "white",
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: "white" }}>Vay:</Text>
            <Text style={{ fontSize: 12, color: "#F34A2F" }}>Chi:</Text>
            <Text style={{ fontSize: 12, color: "#3CD3AD" }}>Thu:</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "white" }}>2tr</Text>
            <Text style={{ fontSize: 12, color: "#F34A2F" }}>7tr</Text>
            <Text style={{ fontSize: 12, color: "#3CD3AD" }}>10tr</Text>
          </View>
        </View>
      )}
    </>
  )
}
