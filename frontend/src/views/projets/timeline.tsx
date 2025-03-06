import React from "react";
import { Box } from "@mui/material";
import { Chart } from "react-google-charts";

interface Task {
  name: string;
  status: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
}

interface Jalon {
  name: string;
  endDate: string;
}

interface Livrable {
  name: string;
  endDate: string;
  status: string;
}

interface TimelineProps {
  tasks: Task[];
  jalons: Jalon[];
  livrables: Livrable[];
}

const Timeline: React.FC<TimelineProps> = ({ tasks, jalons, livrables }) => {
  const chartData = [
    ["Task", "Nom (Info)", "Début", "Fin"],
    ...tasks.map((task) => [
      task.assignedTo,
      `${task.status} — ${task.name}`,
      new Date(task.startDate),
      new Date(task.endDate),
    ]),
    ...jalons.map((jalon) => {
      const endDate = new Date(jalon.endDate);
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      return ["Jalons", `${jalon.name}`, endDate, endDatePlusOne];
    }),
    ...livrables.map((livrable) => {
      const endDate = new Date(livrable.endDate);
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      return ["Livrables", `${livrable.status} — ${livrable.name}`, endDate, endDatePlusOne];
    }),
  ];

  return (
    <Box sx={{ fontFamily: "Open Sans, sans-serif", padding: "20px" }}>
      <Chart
        chartType="Timeline"
        data={chartData}
        width="100%"
        height="400px"
        options={{
          timeline: { showRowLabels: true },
          hAxis: { format: "dd/MM/yyyy", slantedText: true, slantedTextAngle: 45 },
          tooltip: { isHtml: true, trigger: "focus" },
        }}
      />

    </Box>
  );
};

export default Timeline;
