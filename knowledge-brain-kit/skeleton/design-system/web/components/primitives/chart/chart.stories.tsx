import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
    Bar, BarChart,
    CartesianGrid,
    Line, LineChart,
    Area, AreaChart,
    Pie, PieChart, Cell,
    ScatterChart, Scatter, ZAxis,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar, LabelList,
    ComposedChart,
    XAxis, YAxis,
    Legend, Tooltip,
} from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "./chart"

const meta: Meta = {
    title: "Primitives/Chart",
    tags: ["autodocs"],
    parameters: { layout: "padded" },
}

export default meta
type Story = StoryObj

// -----------------------------------------------
// Helper: read a CSS custom property from :root at render time.
// Using getComputedStyle ensures we resolve the actual value
// even in SVG context where CSS vars don't inherit directly.
// -----------------------------------------------
function getCssVar(name: string): string {
    if (typeof window === "undefined") return "#000"
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
}

// -----------------------------------------------
// Colors are now handled dynamically by the theme provider via --chart-* variables
// -----------------------------------------------

// -----------------------------------------------
// Bar Chart
// -----------------------------------------------
const barData = [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
]

export const BarChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            desktop: { label: "Desktop", color: "var(--chart-1)" },
            mobile: { label: "Mobile", color: "var(--chart-2)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Bar Chart — Visitors by device</h3>
                <ChartContainer config={config} className="h-[260px] w-full">
                    <BarChart data={barData}>
                        <CartesianGrid vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Line Chart
// -----------------------------------------------
const lineData = [
    { month: "Jan", revenue: 4200, expenses: 2400 },
    { month: "Feb", revenue: 3800, expenses: 1398 },
    { month: "Mar", revenue: 5200, expenses: 3800 },
    { month: "Apr", revenue: 4800, expenses: 3908 },
    { month: "May", revenue: 6900, expenses: 4800 },
    { month: "Jun", revenue: 8200, expenses: 3800 },
]

export const LineChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            revenue: { label: "Revenue", color: "var(--chart-1)" },
            expenses: { label: "Expenses", color: "var(--chart-2)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Line Chart — Revenue vs Expenses</h3>
                <ChartContainer config={config} className="h-[260px] w-full">
                    <LineChart accessibilityLayer data={lineData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line type="natural" dataKey="revenue"
                            stroke="var(--color-revenue)" strokeWidth={2.5}
                            dot={{ fill: "var(--color-revenue)" }} activeDot={{ r: 6 }} />
                        <Line type="natural" dataKey="expenses"
                            stroke="var(--color-expenses)" strokeWidth={2.5} strokeDasharray="5 4"
                            dot={{ fill: "var(--color-expenses)" }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Area Chart
// -----------------------------------------------
export const AreaChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            desktop: { label: "Desktop", color: "var(--chart-1)" },
            mobile: { label: "Mobile", color: "var(--chart-2)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Area Chart — Stacked visitors</h3>
                <ChartContainer config={config} className="h-[260px] w-full">
                    <AreaChart data={barData}>
                        <CartesianGrid vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area type="monotone" dataKey="desktop" stackId="a"
                            stroke="var(--color-desktop)" fill="var(--color-desktop)" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="mobile" stackId="a"
                            stroke="var(--color-mobile)" fill="var(--color-mobile)" fillOpacity={0.3} />
                    </AreaChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Pie / Donut Chart — per-slice colors via Cell
// -----------------------------------------------
const pieData = [
    { name: "Chrome", value: 400 },
    { name: "Firefox", value: 300 },
    { name: "Safari", value: 300 },
    { name: "Edge", value: 200 },
    { name: "Other", value: 100 },
]

export const PieChartDemo: Story = {
    render: () => {
        const PIE_COLORS = [
            "var(--chart-1)",
            "var(--chart-2)",
            "var(--chart-3)",
            "var(--chart-4)",
            "var(--chart-5)"
        ]
        const config: ChartConfig = {}

        return (
            <div className="max-w-lg w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Pie Chart — Browser market share</h3>
                <ChartContainer config={config} className="h-[300px] w-full">
                    <PieChart>
                        <Tooltip
                            formatter={(value, name) => [value, name]}
                            contentStyle={{
                                backgroundColor: getCssVar("--background"),
                                border: `1px solid ${getCssVar("--border")}`,
                                borderRadius: "0.5rem",
                                fontSize: 12,
                            }}
                        />
                        <Legend formatter={(value) => (
                            <span style={{ fontSize: 12 }}>{value}</span>
                        )} />
                        <Pie data={pieData} dataKey="value" nameKey="name"
                            cx="50%" cy="50%"
                            outerRadius={110} innerRadius={55} paddingAngle={3}>
                            {pieData.map((_, i) => (
                                <Cell key={`c-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Scatter Chart
// -----------------------------------------------
const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
]

export const ScatterChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            groupA: { label: "Group A", color: "var(--chart-1)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Scatter Chart — Distribution</h3>
                <ChartContainer config={config} className="h-[260px] w-full">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" strokeOpacity={0.2} />
                        <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                        <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                        <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                        <Scatter name="Group A" data={scatterData} fill="var(--chart-1)" fillOpacity={0.7} />
                    </ScatterChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Bubble Chart (Scatter with ZAxis)
// -----------------------------------------------
const bubbleData = [
    { name: 'Boston', salary: 105000, growth: -2, jobs: 120000, fill: "var(--chart-2)" },
    { name: 'Washington D.C.', salary: 110000, growth: 2, jobs: 140000, fill: "var(--chart-2)" },
    { name: 'Chicago', salary: 95000, growth: 12, jobs: 90000, fill: "var(--chart-1)" },
    { name: 'Los Angeles', salary: 100000, growth: 10, jobs: 80000, fill: "var(--chart-1)" },
    { name: 'Austin', salary: 92000, growth: 22, jobs: 60000, fill: "var(--chart-3)" },
    { name: 'San Francisco', salary: 130000, growth: 30, jobs: 200000, fill: "var(--chart-5)" },
    { name: 'Toronto', salary: 85000, growth: 50, jobs: 150000, fill: "var(--chart-3)" }
]

export const BubbleChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            cities: { label: "Cities", color: "var(--chart-2)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Bubble Chart — Salary vs Growth</h3>
                <ChartContainer config={config} className="h-[300px] w-full">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" strokeOpacity={0.2} />
                        <XAxis type="number" dataKey="growth" name="Growth" unit="%" />
                        <YAxis type="number" dataKey="salary" name="Salary" unit="$" />
                        <ZAxis type="number" dataKey="jobs" range={[100, 3000]} name="Tech Jobs" />
                        <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                        <Scatter name="Cities" data={bubbleData} fillOpacity={0.7} />
                    </ScatterChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Radar Chart
// -----------------------------------------------
const radarData = [
    { subject: 'Math', A: 120, B: 110, fullMark: 150 },
    { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
    { subject: 'English', A: 86, B: 130, fullMark: 150 },
    { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
    { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
    { subject: 'History', A: 65, B: 85, fullMark: 150 },
]

export const RadarChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            studentA: { label: "Student A", color: "var(--chart-1)" },
            studentB: { label: "Student B", color: "var(--chart-3)" },
        }
        return (
            <div className="max-w-xl w-full flex flex-col items-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 w-full text-left">Radar Chart — Skill Comparison</h3>
                <ChartContainer config={config} className="h-[350px] w-full max-w-[400px]">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: "var(--muted-foreground)" }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Radar name="Student A" dataKey="A" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.4} />
                        <Radar name="Student B" dataKey="B" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.4} />
                    </RadarChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Process Diagram (Composed Chart)
// -----------------------------------------------
const processData = [
    { name: 'Lead', count: 590, drop: 800 },
    { name: 'Pitch', count: 868, drop: 967 },
    { name: 'Negotiation', count: 1397, drop: 1098 },
    { name: 'Review', count: 1480, drop: 1200 },
    { name: 'Closed', count: 1520, drop: 1108 },
]

export const ProcessChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            count: { label: "Active Deals", color: "var(--chart-4)" },
            drop: { label: "Dropped Deals", color: "var(--chart-5)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Process / Pipeline Chart — Composed</h3>
                <ChartContainer config={config} className="h-[300px] w-full">
                    <ComposedChart data={processData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" scale="band" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="count" barSize={20} fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="drop" stroke="var(--chart-5)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                </ChartContainer>
            </div>
        )
    },
}

// -----------------------------------------------
// Radial Chart
// -----------------------------------------------
const radialData = [
    { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
    { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
    { browser: "firefox", visitors: 187, fill: "var(--chart-3)" },
    { browser: "edge", visitors: 173, fill: "var(--chart-4)" },
    { browser: "other", visitors: 90, fill: "var(--chart-5)" },
]

export const RadialChartDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            visitors: { label: "Visitors" },
            chrome: { label: "Chrome", color: "var(--chart-1)" },
            safari: { label: "Safari", color: "var(--chart-2)" },
            firefox: { label: "Firefox", color: "var(--chart-3)" },
            edge: { label: "Edge", color: "var(--chart-4)" },
            other: { label: "Other", color: "var(--chart-5)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Radial Chart — Label</h3>
                <ChartContainer config={config} className="mx-auto aspect-square max-h-[300px]">
                    <RadialBarChart
                        data={radialData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={30}
                        outerRadius={110}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="browser" />}
                        />
                        <RadialBar dataKey="visitors" background cornerRadius={5}>
                            <LabelList
                                position="insideStart"
                                dataKey="browser"
                                className="fill-white capitalize mix-blend-luminosity"
                                fontSize={11}
                            />
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
            </div>
        )
    },
}

export const RadialChartStackedDemo: Story = {
    render: () => {
        const config: ChartConfig = {
            visitors: { label: "Visitors" },
            chrome: { label: "Chrome", color: "var(--chart-1)" },
            safari: { label: "Safari", color: "var(--chart-2)" },
            firefox: { label: "Firefox", color: "var(--chart-3)" },
            edge: { label: "Edge", color: "var(--chart-4)" },
            other: { label: "Other", color: "var(--chart-5)" },
        }
        return (
            <div className="max-w-xl w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Radial Chart — Stacked</h3>
                <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
                    <RadialBarChart data={radialData} innerRadius={30} outerRadius={110}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="browser" />}
                        />
                        <RadialBar dataKey="visitors" background cornerRadius={5} />
                    </RadialBarChart>
                </ChartContainer>
            </div>
        )
    },
}

