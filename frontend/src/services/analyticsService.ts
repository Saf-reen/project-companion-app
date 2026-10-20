/** DEMO DATA ONLY. Real scan analytics require dynamic redirect infrastructure and a backend. */
export interface DemoAnalytics {
  total: number;
  overTime: { day: string; scans: number }[];
  devices: { name: string; value: number }[];
  geo: { country: string; scans: number }[];
}

export function getDemoAnalytics(): DemoAnalytics {
  const overTime = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    scans: Math.round(120 + 60 * Math.sin(i / 2) + i * 9),
  }));
  return {
    total: overTime.reduce((s, d) => s + d.scans, 0),
    overTime,
    devices: [
      { name: "iOS", value: 46 },
      { name: "Android", value: 41 },
      { name: "Desktop", value: 9 },
      { name: "Other", value: 4 },
    ],
    geo: [
      { country: "United States", scans: 812 },
      { country: "Germany", scans: 431 },
      { country: "Brazil", scans: 356 },
      { country: "India", scans: 298 },
      { country: "France", scans: 187 },
    ],
  };
}
