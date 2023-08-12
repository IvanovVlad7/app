import React, { useState, useEffect } from "react";
import axios from "axios";

interface DashboardProps {
  user: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/data").then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Hi {user}!</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;