import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { LayoutDashboard, CheckCircle, XCircle, HelpCircle, Search, X, Database, Star, Zap } from 'lucide-react';

const SENTIMENT_COLORS: { [key: string]: string } = {
  'Positive': '#22c55e',
  'Neutral': '#eab308',
  'Negative': '#ef4444',
  'Unknown': '#94a3b8'
};

function App() {
  const [summary, setSummary] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [sourceStats, setSourceStats] = useState<any[]>([]);
  const [topKeywords, setTopKeywords] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  useEffect(() => {
    fetch('http://localhost:5084/api/feedback/summary').then(res => res.json()).then(data => setSummary(data));
    fetch('http://localhost:5084/api/feedback/trend').then(res => res.json()).then(data => setTrendData(data));
    fetch('http://localhost:5084/api/feedback').then(res => res.json()).then(data => setAllFeedbacks(data.slice(-50).reverse()));
    fetch('http://localhost:5084/api/feedback/source-distribution').then(res => res.json()).then(data => setSourceStats(data));
    fetch('http://localhost:5084/api/feedback/top-keywords').then(res => res.json()).then(data => setTopKeywords(data));
  }, []);

  const totalCount = summary.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const positiveCount = summary.find(s => s.name === 'Positive')?.value || 0;
  const successRate = totalCount > 0 ? ((positiveCount / totalCount) * 100).toFixed(1) : 0;

  const filteredFeedbacks = allFeedbacks.filter(f => {
    const matchesFilter = filter === 'All' ? true : f.sentimentScore === filter;
    const matchesSearch = f.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (name: string, size = 20) => {
    if (name === 'Positive') return <CheckCircle size={size} color={SENTIMENT_COLORS['Positive']} />;
    if (name === 'Negative') return <XCircle size={size} color={SENTIMENT_COLORS['Negative']} />;
    return <HelpCircle size={size} color={SENTIMENT_COLORS['Neutral']} />;
  };

  return (
    <div style={{ padding: '15px 30px', backgroundColor: '#f8fafc', height: '100vh', width: '100vw', boxSizing: 'border-box', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* 1. Header & KPI Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LayoutDashboard size={24} color="#1e293b" />
          <h1 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>SmartPulse Analytics</h1>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Analyzed Data</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Database size={16} color="#6366f1" /> {totalCount.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Success Rate</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Star size={16} fill="#22c55e" stroke="none" /> %{successRate}
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. Top Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr', gap: '15px', flex: 3, minHeight: 0 }}>
        
        {/* Sentiment Distribution */}
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={summary} cx="50%" cy="50%" innerRadius="55%" outerRadius="75%" paddingAngle={5} dataKey="value">
                {summary.map((entry, index) => <Cell key={index} fill={SENTIMENT_COLORS[entry.name] || '#94a3b8'} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Trends (FIXED: Added Neutral Line) */}
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Trends (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="neutral" stroke="#eab308" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Strategic Insights */}
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <Zap size={16} color="#eab308" fill="#eab308" /> AI Strategic Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
             {topKeywords.length > 0 ? topKeywords.map((item, i) => (
               <div key={i} style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', textTransform: 'capitalize' }}>{item.word}</span>
                 <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.count.toLocaleString()} mentions</span>
               </div>
             )) : <div style={{ fontSize: '11px', color: '#94a3b8' }}>Analyzing data...</div>}
          </div>
        </div>
      </div>

      {/* 3. Platform & Feedback Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '15px', flex: 2, minHeight: 0 }}>
          
          {/* Source Platform Share */}
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Source Platform Share</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceStats} layout="vertical" margin={{ left: 30, right: 30, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" fontSize={10} width={70} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Feedback Feed (FIXED: Added all filter buttons) */}
          <div style={{ backgroundColor: '#fff', padding: '15px 20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>Feedback Analysis Feed</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                   <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                   <input type="text" placeholder="Search insights..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '5px 8px 5px 28px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', width: '130px', outline: 'none' }} />
                </div>
                {['All', 'Positive', 'Neutral', 'Negative'].map(t => (
                  <button key={t} onClick={() => setFilter(t)} style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: filter === t ? '#1e293b' : '#f1f5f9', color: filter === t ? '#fff' : '#64748b', transition: 'all 0.2s' }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredFeedbacks.map((f, i) => (
                <div key={i} onClick={() => setSelectedFeedback(f)} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>{f.customerName} <small style={{ color: '#94a3b8', fontWeight: 'normal' }}>• {f.source}</small></span>
                    <p style={{ margin: '1px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>{f.content.substring(0, 80)}...</p>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', backgroundColor: f.sentimentScore === 'Positive' ? '#ecfdf5' : f.sentimentScore === 'Negative' ? '#fef2f2' : '#fffbeb', color: f.sentimentScore === 'Positive' ? '#16a34a' : f.sentimentScore === 'Negative' ? '#dc2626' : '#d97706' }}>
                    {f.sentimentScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Detail Modal */}
      {selectedFeedback && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedFeedback(null)}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '500px', maxWidth: '90%', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFeedback(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} color="#94a3b8" /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                {getIcon(selectedFeedback.sentimentScore, 30)}
                <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b', fontWeight: 'bold' }}>{selectedFeedback.customerName}</h2>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px' }}>{selectedFeedback.content}</p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                <span>Source: <b>{selectedFeedback.source}</b></span>
                <span>Sentiment: <b style={{ color: SENTIMENT_COLORS[selectedFeedback.sentimentScore] }}>{selectedFeedback.sentimentScore}</b></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;