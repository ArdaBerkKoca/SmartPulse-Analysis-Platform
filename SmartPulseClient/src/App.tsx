import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LayoutDashboard, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const SENTIMENT_COLORS: { [key: string]: string } = {
  'Positive': '#00C49F',
  'Neutral': '#FFBB28',
  'Negative': '#FF8042',
  'Unknown': '#8884d8'
};

function App() {
  const [summary, setSummary] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5084/api/feedback/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Veri çekme hatası:", err));
  }, []);

  const getIcon = (name: string) => {
    if (name === 'Positive') return <CheckCircle size={20} color="#00C49F" />;
    if (name === 'Negative') return <XCircle size={20} color="#FF8042" />;
    return <HelpCircle size={20} color="#FFBB28" />;
  };

  return (
    // boxSizing: 'border-box' genişlik hesaplamasını padding dahil yapar
    <div style={{ 
      padding: '20px 40px', 
      backgroundColor: '#f8fafc', 
      height: '100vh', 
      width: '100vw', 
      boxSizing: 'border-box', 
      overflow: 'hidden', // Kaydırma çubuklarını kesin olarak öldürür
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Başlık: Sabit yükseklik */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexShrink: 0 }}>
        <LayoutDashboard size={28} color="#1e293b" />
        <h1 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          SmartPulse Analytics Dashboard
        </h1>
      </div>
      
      {/* Ana Panel: Kalan alanı kaplar (flex: 1) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 0.8fr', 
        gap: '20px',
        flex: 1, 
        minHeight: 0 // Grid'in taşmasını engeller
      }}>
        
        {/* Sol Taraf: Grafik Kartı */}
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '16px' }}>Müşteri Duygu Dağılımı</h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {summary.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SENTIMENT_COLORS[entry.name] || SENTIMENT_COLORS['Unknown']} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sağ Taraf: Bilgi Kartları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between' }}>
           {summary.map((item, index) => (
             <div key={index} style={{ 
               backgroundColor: '#fff', 
               padding: '15px 25px', 
               borderRadius: '16px', 
               boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
               borderLeft: `6px solid ${SENTIMENT_COLORS[item.name] || '#8884d8'}`,
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               flex: 1 // Kartların eşit boyda dikey yayılmasını sağlar
             }}>
               <div>
                  <h4 style={{ margin: 0, color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', color: '#1e293b' }}>
                    {item.value?.toLocaleString()}
                  </p>
               </div>
               <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '50%' }}>
                  {getIcon(item.name)}
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

export default App;