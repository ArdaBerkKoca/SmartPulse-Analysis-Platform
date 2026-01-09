import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LayoutDashboard, CheckCircle, XCircle, HelpCircle, MessageSquare, Filter, Search, X } from 'lucide-react';

const SENTIMENT_COLORS: { [key: string]: string } = {
  'Positive': '#00C49F',
  'Neutral': '#FFBB28',
  'Negative': '#FF8042',
  'Unknown': '#8884d8'
};

function App() {
  const [summary, setSummary] = useState<any[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null); // Detay için state

  useEffect(() => {
    fetch('http://localhost:5084/api/feedback/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Summary fetch error:", err));

    fetch('http://localhost:5084/api/feedback')
      .then(res => res.json())
      .then(data => {
        setAllFeedbacks(data.slice(-50).reverse());
      })
      .catch(err => console.error("Feedback list error:", err));
  }, []);

  const filteredFeedbacks = allFeedbacks.filter(f => {
    const matchesFilter = filter === 'All' ? true : f.sentimentScore === filter;
    const matchesSearch = f.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (name: string, size = 22) => {
    if (name === 'Positive') return <CheckCircle size={size} color="#00C49F" />;
    if (name === 'Negative') return <XCircle size={size} color="#FF8042" />;
    return <HelpCircle size={size} color="#FFBB28" />;
  };

  return (
    <div style={{ 
      padding: '15px 30px', backgroundColor: '#f8fafc', height: '100vh', width: '100vw', 
      boxSizing: 'border-box', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <LayoutDashboard size={24} color="#1e293b" />
        <h1 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>SmartPulse Analytics</h1>
      </div>
      
      {/* Middle: Chart and Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '15px', flex: 3, minHeight: 0 }}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>Sentiment Distribution</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary} cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" paddingAngle={5} dataKey="value">
                  {summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
           {summary.map((item, index) => (
             <div key={index} style={{ backgroundColor: '#fff', padding: '10px 18px', borderRadius: '12px', borderLeft: `5px solid ${SENTIMENT_COLORS[item.name]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
               <div>
                  <h4 style={{ margin: 0, color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.name}</h4>
                  <p style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0', color: '#1e293b', lineHeight: 1.2 }}>{item.value?.toLocaleString()}</p>
                  <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Total Feedbacks</span>
               </div>
               {getIcon(item.name, 22)}
             </div>
           ))}
        </div>
      </div>

      {/* Bottom: Searchable Feedbacks */}
      <div style={{ backgroundColor: '#fff', padding: '15px 20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', flex: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} /> Recent Feedback Analysis
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
              <input 
                type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '5px 10px 5px 30px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', width: '150px', backgroundColor: '#fff', color: '#1e293b' }}
              />
            </div>
            {['All', 'Positive', 'Neutral', 'Negative'].map(type => (
              <button key={type} onClick={() => setFilter(type)} style={{ padding: '3px 10px', borderRadius: '6px', border: 'none', fontSize: '10px', fontWeight: '600', cursor: 'pointer', backgroundColor: filter === type ? '#1e293b' : '#f1f5f9', color: filter === type ? '#fff' : '#64748b' }}>{type}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
          {filteredFeedbacks.map((f, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedFeedback(f)} // Tıklama olayı
              style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#1e293b' }}>{f.customerName}</span>
                <p style={{ margin: '1px 0 0 0', fontSize: '11px', color: '#64748b' }}>{f.content.substring(0, 140)}...</p>
              </div>
              <span style={{ marginLeft: '12px', padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', backgroundColor: f.sentimentScore === 'Positive' ? '#ecfdf5' : f.sentimentScore === 'Negative' ? '#fef2f2' : '#fffbeb', color: f.sentimentScore === 'Positive' ? '#059669' : f.sentimentScore === 'Negative' ? '#dc2626' : '#d97706' }}>
                {f.sentimentScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Feedback Detail (Pop-up) */}
      {selectedFeedback && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setSelectedFeedback(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              {getIcon(selectedFeedback.sentimentScore, 32)}
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{selectedFeedback.customerName}</h2>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#475569', whiteSpace: 'pre-wrap' }}>
                {selectedFeedback.content}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px' }}>
              <span>Source: {selectedFeedback.source}</span>
              <span>Sentiment: <strong style={{ color: SENTIMENT_COLORS[selectedFeedback.sentimentScore] }}>{selectedFeedback.sentimentScore}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;