import { BarChart } from "react-native-gifted-charts";
import React from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";

interface BarChartItem {
    label: string;
    value: number;
}

interface Props {
    data: BarChartItem[];
    title?: string;
}

export default function BarChartComponent({ data, title }: Props) {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#76A346', '#D32F2F', '#1976D2', '#FBC02D'];

  return (
    <Box className="p-4 rounded-lg shadow">
      {title && <Heading size="md">{title}</Heading>}
      <Box style={{ marginLeft: -45, marginTop: -40, marginBottom: -60 }}>
        <BarChart
          data={data.slice(0,5)}
          width={290}
          height={180}
          horizontal
          barWidth={22}
          barBorderRadius={4}
          frontColor={colors[Math.floor(Math.random() * colors.length)]}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisAtTop
          disablePress
          initialSpacing={0}
          xAxisLabelTextStyle={
            { color: 'black', fontSize: 14, width: 200, includeFontPadding: false, textAlign: 'left', marginLeft: 40 }
          }
        />
      </Box>
    </Box>
  )
}