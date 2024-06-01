import { useEffect, useState } from "react";
import { cn } from "./lib/utils";
import ExcelJS from "exceljs";
import { Card } from "@/components/ui/card";
import { HorizontalBarData } from "@/components/horizontalBarData";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "../app/globals.css";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

import { CircleCheck, Loader } from "lucide-react";
import { options as radarOptions } from "./components/graphConfig";
import type { MaterialData, SupplierData } from "./types";

// Constants for normalizing the data
const MIN_CARBON = 1.039817914;
const MAX_CARBON = 49.92375818;
const MIN_COST = 1.534362314;
const MAX_COST = 99.72078126;

// Constants for comparisions
const GOOD_PERFORMANCE = 5;
const GOOD_COST = 50;
const GOOD_CARBON = 25;
const GOOD_SUPPLIER = 5;

// Normalization function
const normalize = (
  value: number,
  min: number,
  max: number,
  newMin: number,
  newMax: number
) => {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
};

function App() {
  const labels = ["Performance", "Pricing", "Sustainability", "Supplier"];
  const [materialData, setMaterialData] = useState<MaterialData[] | null>(null);
  const [supplierData, setSupplierData] = useState<SupplierData[] | null>(null);
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(4);
  const [matchingSupplier, setMatchingSupplier] = useState<SupplierData | null>(
    null
  );
  const [supplierLookup, setSupplierLookup] = useState<{
    [key: string]: SupplierData;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the Excel file
        const response = await fetch("/test_data.xlsx");
        const arrayBuffer = await response.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const materialDataSheet = workbook.getWorksheet("Material Data");
        const supplierDataSheet = workbook.getWorksheet("Supplier Data");

        // Process the Excel file for Material Data
        const materialDataJson: MaterialData[] = [];
        if (materialDataSheet) {
          materialDataSheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const materialDataEntry = {
                "Material Name": row.getCell(1).value as string,
                "Supplier Name": row.getCell(2).value as string,
                "Material Type": row.getCell(3).value as string,
                Cost: row.getCell(4).value as number,
                "Carbon Footprint": row.getCell(5).value as number,
                "Performance Score": row.getCell(6).value as number,
              };
              materialDataJson.push(materialDataEntry);
            }
          });
        }

        // Process the Excel file for Supplier Data
        const supplierDataJson: SupplierData[] = [];
        if (supplierDataSheet) {
          supplierDataSheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const supplierDataEntry = {
                "Supplier Name": row.getCell(1).value as string,
                "Supplier Score": row.getCell(2).value as number,
              };
              supplierDataJson.push(supplierDataEntry);
            }
          });
        }

        // Set the state
        setMaterialData(materialDataJson);
        setSupplierData(supplierDataJson);
        console.log(materialData);
        console.log(supplierData);

        // Create supplier lookup
        const newSupplierLookup = supplierDataJson.reduce<{
          [key: string]: SupplierData;
        }>((lookup, supplier) => {
          lookup[supplier["Supplier Name"]] = supplier;
          return lookup;
        }, {});
        setSupplierLookup(newSupplierLookup);

        // Find the matching supplier
        const matchedSupplier =
          newSupplierLookup[
            materialDataJson[currentMaterialIndex]["Supplier Name"]
          ];
        setMatchingSupplier(matchedSupplier || null);
      } catch (error) {
        console.error("Error fetching or processing the Excel file:", error);
      }
    };

    fetchData();
  }, []);

  // Update the matching supplier
  useEffect(() => {
    if (materialData && supplierLookup) {
      const matchedSupplier =
        supplierLookup[materialData[currentMaterialIndex]["Supplier Name"]];
      setMatchingSupplier(matchedSupplier || null);
    }
  }, [currentMaterialIndex, materialData, supplierLookup]);

  if (!materialData || !supplierData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-4xl">
        <Loader className="h-10 w-10 mr-3 animate-spin" /> Loading...
      </div>
    );
  }

  /* Navigation functions */
  // Increase the index
  const increaseIndex = () => {
    setCurrentMaterialIndex((prevIndex) => {
      if (prevIndex < materialData.length - 1) {
        return prevIndex + 1;
      } else {
        return prevIndex;
      }
    });
  };

  // Go to the first index
  const toFirstIndex = () => {
    setCurrentMaterialIndex(0);
  };

  // Decrease the index
  const decreaseIndex = () => {
    setCurrentMaterialIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        return prevIndex;
      }
    });
  };

  // Go to the last index
  const toLastIndex = () => {
    setCurrentMaterialIndex(materialData.length - 1);
  };

  // Data for the Radar chart
  const radarChartData = {
    labels: ["Performance", "Pricing", "Sustainability", "Supplier"],
    datasets: [
      {
        data: [
          materialData[currentMaterialIndex]["Performance Score"],
          normalize(
            materialData[currentMaterialIndex]["Cost"],
            MIN_COST,
            MAX_COST,
            0,
            10
          ),
          normalize(
            materialData[currentMaterialIndex]["Carbon Footprint"],
            MIN_CARBON,
            MAX_CARBON,
            0,
            10
          ),
          matchingSupplier ? matchingSupplier["Supplier Score"] : 0,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Tabs
        defaultValue="overview"
        className="max-w-[700px] flex flex-col items-center justify-center min-h-screen m-auto"
      >
        <TabsList className="flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
        </TabsList>

        {/* Content for each tab */}
        {/* Overview tab */}
        <TabsContent value="overview" className=" w-full">
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
        </TabsContent>

        {/* Performance tab */}
        <TabsContent value="performance" className=" w-full">
          <Card className="flex flex-col md:flex-row gap-6 justify-center items-center w-full p-6 mt-3 ">
            <Card className="aspect-square w-[300px] flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-3 animate-slideIn">
                Performance
              </h1>
              <div className="text-4xl flex justify-center items-center opacity-0 animate-slideIn delay-75">
                <h2>
                  {Math.round(
                    materialData[currentMaterialIndex]["Performance Score"] *
                      100
                  ) / 100}{" "}
                </h2>
                <CircleCheck
                  className={cn(
                    "ml-3 h-6 w-6 transition-all duration-300 ease-in-out",
                    materialData[currentMaterialIndex]["Performance Score"] >
                      GOOD_PERFORMANCE
                      ? "text-primary"
                      : "text-secondary"
                  )}
                />
              </div>
            </Card>
            <div className="flex flex-col gap-3 flex-1">
              <h1 className="font-semibold text-2xl animate-fadeIn">
                What does this mean?
              </h1>
              <p className="opacity-0 animate-fadeIn delay-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Pricing tab */}
        <TabsContent value="pricing" className=" w-full">
          <Card className="flex flex-col md:flex-row gap-6 justify-center items-center w-full p-6 mt-3 ">
            <Card className="aspect-square w-[300px] flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-3 animate-slideIn">Cost</h1>
              <div className="text-4xl flex justify-center items-center opacity-0 animate-slideIn delay-75">
                <h2>
                  {Math.round(
                    materialData[currentMaterialIndex]["Cost"] * 100
                  ) / 100}{" "}
                </h2>
                <CircleCheck
                  className={cn(
                    "ml-3 h-6 w-6 transition-all duration-300 ease-in-out",
                    materialData[currentMaterialIndex]["Cost"] < GOOD_COST
                      ? "text-primary"
                      : "text-secondary"
                  )}
                />
              </div>
            </Card>
            <div className="flex flex-col gap-3 flex-1">
              <h1 className="font-semibold text-2xl animate-fadeIn">
                What does this mean?
              </h1>
              <p className="opacity-0 animate-fadeIn delay-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Sustainability tab */}
        <TabsContent value="sustainability" className=" w-full">
          <Card className="flex flex-col md:flex-row gap-6 justify-center items-center w-full p-6 mt-3 ">
            <Card className="aspect-square w-[300px] flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-3 animate-slideIn">
                Sustainability
              </h1>
              <div className="text-4xl flex justify-center items-center opacity-0 animate-slideIn delay-75">
                <h2>
                  {Math.round(
                    materialData[currentMaterialIndex]["Carbon Footprint"] * 100
                  ) / 100}{" "}
                </h2>
                <CircleCheck
                  className={cn(
                    "ml-3 h-6 w-6 transition-all duration-300 ease-in-out",
                    materialData[currentMaterialIndex]["Carbon Footprint"] <
                      GOOD_CARBON
                      ? "text-primary"
                      : "text-secondary"
                  )}
                />
              </div>
            </Card>
            <div className="flex flex-col gap-3 flex-1">
              <h1 className="font-semibold text-2xl animate-fadeIn">
                What does this mean?
              </h1>
              <p className="opacity-0 animate-fadeIn delay-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Supplier tab */}
        <TabsContent value="supplier" className=" w-full">
          <Card className="flex flex-col md:flex-row gap-6 justify-center items-center w-full p-6 mt-3 ">
            <Card className="aspect-square w-[300px] flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-3 animate-slideIn">
                Supplier
              </h1>
              <div className="text-4xl flex justify-center items-center opacity-0 animate-slideIn delay-75">
                <h2>
                  {matchingSupplier
                    ? Math.round(matchingSupplier["Supplier Score"] * 100) / 100
                    : 0}
                </h2>
                <CircleCheck
                  className={cn(
                    "ml-3 h-6 w-6 transition-all duration-300 ease-in-out",
                    matchingSupplier &&
                      matchingSupplier["Supplier Score"] > GOOD_SUPPLIER
                      ? "text-primary"
                      : "text-secondary"
                  )}
                />
              </div>
            </Card>
            <div className="flex flex-col gap-3 flex-1">
              <h1 className="font-semibold text-2xl animate-fadeIn">
                What does this mean?
              </h1>
              <p className="opacity-0 animate-fadeIn delay-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Navigation buttons */}
        <NavigationButtons
          currentIndex={currentMaterialIndex}
          totalItems={materialData.length}
          increaseIndex={increaseIndex}
          decreaseIndex={decreaseIndex}
          toFirstIndex={toFirstIndex}
          toLastIndex={toLastIndex}
        />
      </Tabs>
    </>
  );
}

export default App;
