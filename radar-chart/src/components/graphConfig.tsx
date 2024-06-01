export const mockData = {
  labels: ["Performance", "Pricing", "Sustainability", "Supplier"],
  datasets: [
    {
      data: [4, 7, 8, 2],
      backgroundColor: "rgba(225, 29, 72, 0.24)",
      borderColor: "rgba(225, 29, 72, 1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(225, 29, 72, 1)",
      pointBorderColor: "rgba(225, 29, 72, 1)",
    },
  ],
};

export const options = {
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
