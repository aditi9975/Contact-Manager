import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../../assets/firebase"; // Import auth for getting user UID
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import "../../Styles/HomeAn.css"; // Import custom styles

const Analytics = () => {
  const [categories, setCategories] = useState({
    Family: 0,
    Friends: 0,
    Work: 0,
    Other: 0,
  });
  const [growthData, setGrowthData] = useState([]); // Growth data for line chart

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const contactsRef = ref(db, `users/${user.uid}/contacts`);
      onValue(contactsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const counts = { Family: 0, Friends: 0, Work: 0, Other: 0 };
          const growth = [];

          Object.values(data).forEach((contact) => {
            counts[contact.category] += 1;
            const date = new Date(contact.createdAt).toLocaleDateString();
            const existing = growth.find((entry) => entry.date === date);
            if (existing) existing.count += 1;
            else growth.push({ date, count: 1 });
          });

          setCategories(counts);
          setGrowthData(growth);
        }
      });
    }
  }, []);

  const pieData = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="contact-home-app">
      <h2>Contact Analytics</h2>

      <div className="chart-section">
        <div className="pie-chart">
          <h3>Categories Distribution</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="growth-chart">
          <h3>Contact Growth Over Time</h3>
          <LineChart width={500} height={300} data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
