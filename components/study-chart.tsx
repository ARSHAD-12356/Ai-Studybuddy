"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const weeklyData = [
  { day: "Mon", hours: 3.5, goal: 3.5 },
  { day: "Tue", hours: 4.2, goal: 3.5 },
  { day: "Wed", hours: 2.8, goal: 3.5 },
  { day: "Thu", hours: 4.1, goal: 3.5 },
  { day: "Fri", hours: 3.9, goal: 3.5 },
  { day: "Sat", hours: 3.0, goal: 3.5 },
  { day: "Sun", hours: 3.0, goal: 3.5 },
]

export function StudyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Study Time</CardTitle>
        <CardDescription>Your study hours compared to daily goals this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value, name) => [`${value} hours`, name === "hours" ? "Actual" : "Goal"]} />
            <Bar dataKey="goal" fill="#e2e8f0" name="goal" />
            <Bar dataKey="hours" fill="#be123c" name="hours" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
