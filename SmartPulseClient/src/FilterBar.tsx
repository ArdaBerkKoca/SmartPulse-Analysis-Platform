import { useState, useEffect } from 'react';
import api from './api';

interface Company {
  id: number;
  name: string;
  industry: string;
}

interface Source {
  id: number;
  platformName: string;
  baseUrl?: string;
}

interface FilterBarProps {
  onFilterChange: (filters: { companyId?: number; sourceId?: number }) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');

  useEffect(() => {
    // Backend'de yeni eklediğin endpoint'lerden listeleri çekiyoruz
    const fetchData = async () => {
      try {
        const companiesResponse = await api.get('/Feedback/companies');
        setCompanies(companiesResponse.data);
        
        const sourcesResponse = await api.get('/Feedback/sources');
        setSources(sourcesResponse.data);
      } catch (error) {
        console.error('Filtre verileri çekilirken hata oluştu:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleApply = () => {
    onFilterChange({
      companyId: selectedCompany ? parseInt(selectedCompany) : undefined,
      sourceId: selectedSource ? parseInt(selectedSource) : undefined
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      padding: '15px', 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '15px',
      alignItems: 'center'
    }}>
      <select 
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '12px',
          outline: 'none',
          cursor: 'pointer',
          backgroundColor: '#fff',
          color: '#1e293b',
          minWidth: '180px'
        }}
        value={selectedCompany} 
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        <option value="">Tüm Şirketler</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select 
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '12px',
          outline: 'none',
          cursor: 'pointer',
          backgroundColor: '#fff',
          color: '#1e293b',
          minWidth: '180px'
        }}
        value={selectedSource} 
        onChange={(e) => setSelectedSource(e.target.value)}
      >
        <option value="">Tüm Kaynaklar</option>
        {sources.map(s => (
          <option key={s.id} value={s.id}>{s.platformName}</option>
        ))}
      </select>

      <button 
        onClick={handleApply}
        style={{
          backgroundColor: '#6366f1',
          color: '#fff',
          padding: '8px 20px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
      >
        Filtrele
      </button>
    </div>
  );
};

export default FilterBar;
