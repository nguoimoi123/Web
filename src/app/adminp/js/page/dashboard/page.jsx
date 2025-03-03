import "../../../css/dashboard.css"
import Image from 'next/image';
import { useEffect, useState } from 'react';
const Dashboard = ()=> {
    const [totalSales, setTotalSales] = useState(0);
    const [percentage, setPercentage] = useState(0); 
    const [totalSold, setTotalSold] = useState(0);
    const [soldPercentage, setSoldPercentage] = useState(0); 
    const [users, setUsers] = useState([]);
    const targetRevenue = 10000000;  
    const targetSold = 1000; 

    const fetchDataDetail = async () => {
        try {
          const response = await fetch("/api/detail");
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
    
          // Lọc dữ liệu với state = 3
          const filteredData = data.filter((item) => item.state === 3);
          
          // Tính tổng doanh thu
          const totalRevenue = filteredData.reduce(
            (sum, item) => sum + parseFloat(item.total_revenue || 0),
            0
          );
          setTotalSales(totalRevenue);
    
          // Tính phần trăm doanh thu đạt được
          setPercentage(Math.min((totalRevenue / targetRevenue) * 100, 100));
    
          // Tính tổng số lượng sản phẩm đã bán
          const totalQuantitySold = filteredData.reduce(
              (sum, item) => sum + (parseInt(item.total_quantity_sold, 10) || 0),  // Ép kiểu thành số
              0
            );
            
          setTotalSold(totalQuantitySold);
    
          // Tính phần trăm số lượng bán được
          setSoldPercentage(Math.min((totalQuantitySold / targetSold) * 100, 100));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    const fetchDataUser = async () => {
    try {
        const response = await fetch("/api/users");
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        const filteredData = data
            .filter((item) => item.role === 0)
            .sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần

        setUsers(filteredData);
    }catch (error) {
        console.error("Error fetching data:", error);
    }
    };
    useEffect(() => {     
        fetchDataDetail();
        fetchDataUser();
      }, []);
      
    

    // Tính toán giá trị stroke-dashoffset dựa trên phần trăm
    const radius = 36;
    const circumference = 2 * Math.PI * radius;

    const salesDashOffset = circumference - (circumference * (percentage / 100));
    const soldDashOffset =
        circumference - (circumference * (soldPercentage / 100));

    return (
        <div>
        <main>
            <h1>Dashboard</h1>
            <div className="analyse">
                <div className="sale">
                    <div className="status">
                        <div className="infor">
                            <h3>Total Sales</h3>
                            <h1>${totalSales.toLocaleString()}</h1>
                        </div>
                        <div className="progesss">
                            <svg>
                            <circle 
                                        cx="38" 
                                        cy="38" 
                                        r="36" 
                                        stroke="#4caf50"  // Màu của vòng tròn hoàn thành
                                        strokeWidth="8" 
                                        fill="none" 
                                        strokeDasharray={circumference} 
                                        strokeDashoffset={salesDashOffset} 
                                        transition="stroke-dashoffset 0.5s ease"
                                    />
                            </svg>
                            <div className="percentage">
                                <p>{percentage.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="visit">
                    <div className="status">
                        <div className="infor">
                            <h3>Sold</h3>
                            <h1>{totalSold.toLocaleString()}</h1>
                        </div>
                        <div className="progesss">
                            <svg>
                            <circle
                                        cx="38"
                                        cy="38"
                                        r="36"
                                        stroke="#f44336"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={soldDashOffset}
                                        style={{
                                            transition: "stroke-dashoffset 0.5s ease",
                                        }}
                                    />
                            </svg>
                            <div className="percentage">
                            <p>{soldPercentage.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="searches">
                    <div className="status">
                        <div className="infor">
                            <h3>Searches</h3>
                            <h1>15,886</h1>
                        </div>
                        <div className="progesss">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div className="percentage">
                                <p>+3%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="new-users">
          <h2>New Users</h2>
          <div className="user-list">
            {users.length > 0 ? (
              users.slice(0, 4).map((user, index) => (
                <div className="user" key={index}>
                  <Image
                    src={user.profilePicture || "/user.jpg"}
                    alt={user.name}
                    width={500}
                    height={500}
                    className="object-cover rounded mb-4"
                  />
                  <h2>{user.name}</h2>
                </div>
              ))
            ) : (
              <p>Loading users...</p>
            )}
          </div>
        </div>
           
        </main>
        </div>
    )
}
export default Dashboard;