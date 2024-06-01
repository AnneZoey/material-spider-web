export const OverviewCard = ({
} ) => {
  return {
    <Card className="flex flex-col md:flex-row gap-6 justify-center items-center w-full p-6 mt-3">
    <div className="aspect-square w-[300px]">
      <Radar data={radarChartData} options={radarOptions} />
    </div>
    <div className="flex w-full flex-col gap-3 flex-1">
      <h1 className="text-2xl font-semibold animate-slideIn">
        {materialData[currentMaterialIndex]["Material Name"]}
      </h1>
      {labels.map((label, index) => (
        <div key={index} className="opacity-0 animate-slideIn delay-75">
          <HorizontalBarData
            label={label}
            value={radarChartData.datasets[0].data[index]}
          />
        </div>
      ))}
    </div>
  </Card>
  }
};
