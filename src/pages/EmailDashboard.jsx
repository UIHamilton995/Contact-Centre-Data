import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Search } from 'lucide-react';
import logo from '../assets/Leadway Health Logo.svg';

const apiUrl = "https://prognosis-api.leadwayhealth.com/api/EnrolleeClaims/GetEmailSent?fromdate=2023-12-31&todate=2026-12-31";

const EmailDashboard = () => {
  const [emailsData, setEmailsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data)

        // Sort date of mails, most recent first; descending order
        const sortedData = data.result.sort((a, b) => {
          const dateA = new Date(a.DateCreated)
          const dateB = new Date(b.DateCreated)
          return dateB - dateA
        })
        
        // Extract and validate result array from the response
        setEmailsData(sortedData);
        setSearchResults(sortedData);
      } catch (error) {
        setError("Failed to fetch data.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Calculate statistics
  const sentEmails = emailsData.reduce((total, email) => total + (email.SentEmail || 0), 0);
  const notSentEmails = emailsData.reduce((total, email) => total + (email.NotSent || 0), 0);
  const totalEmails = sentEmails + notSentEmails;

  const pieData = [
    { name: 'Sent', value: sentEmails },
    { name: 'Not Sent', value: notSentEmails }
  ];

  const barData = [
    { name: 'Total', value: totalEmails },
    { name: 'Sent', value: sentEmails },
    { name: 'Not Sent', value: notSentEmails }
  ];

  const COLORS = ['#0088FE', '#de5310'];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = emailsData.filter(email =>
      (email.Email || '').toLowerCase().includes(term) ||
      email.CompanyName.toLowerCase().includes(term) ||
      email.FirstName.toLowerCase().includes(term) ||
      email.Surname.toLowerCase().includes(term)
    );

    setSearchResults(filtered);
  };

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <img src={logo} alt="Leadway Health Logo" />
          <h1 className="text-3xl font-bold text-gray-800">Email Tracking Dashboard</h1>
          <p className="text-gray-600">Track and monitor email delivery status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm underline">Total Emails</h3>
            <p className="text-5xl font-bold">{formatNumber(totalEmails)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm underline">Sent Emails</h3>
            <p className="text-5xl font-bold text-green-600">{formatNumber(sentEmails)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm underline">Failed Emails</h3>
            <p className="text-5xl font-bold text-red-600">{formatNumber(notSentEmails)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 border-b">Delivery Status Distribution</h3>
            <div className="flex justify-center">
              <PieChart width={350} height={350}>
                <Pie
                  data={pieData}
                  cx={170}
                  cy={140}
                  innerRadius={30}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-6 border-b">Email Statistics</h3>
            <BarChart width={400} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#5b56a6" />
            </BarChart>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email, company, name, or sender..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute right-4 top-4 text-gray-400" />
          </div>
        </div>

        {/* Email List */}
        {isLoading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((email, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{email.Email || "N/A"}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.FirstName} {email.Surname}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{email.CompanyName}</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          email.Status === "Sent" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {email.Status}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(email.DateCreated).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDashboard;
