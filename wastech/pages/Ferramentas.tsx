import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/components-dashboard/Header"; // ← Ajuste no import
import { Navbar } from "../components/components-dashboard/Navbar"; // ← Ajuste no import

/* ===============================
   📦 Base de dados de plantas COM IMAGENS LOCAIS
   =============================== */
const PLANT_DATABASE = [
  {
    name: "Tomate Cereja",
    idealTemp: { min: 18, max: 28 },
    idealRainfall: { min: 50, max: 150 },
    idealHumidity: { min: 60, max: 80 },
    spaceNeeded: "medium",
    harvestTime: "60-80 dias",
    image: "/Imagens/tomate.png",
    tips: ["Regar a cada 2 dias", "Necessita de sol pleno", "Adubar a cada 15 dias"],
    sunExposure: "full"
  },
  {
    name: "Manjericão",
    idealTemp: { min: 15, max: 30 },
    idealRainfall: { min: 30, max: 120 },
    idealHumidity: { min: 50, max: 85 },
    spaceNeeded: "small",
    harvestTime: "30-60 dias",
    image: "/Imagens/manjericao.png",
    tips: ["Regar diariamente", "Proteger do vento forte", "Podar regularmente"],
    sunExposure: "partial"
  },
  {
    name: "Alface Crespa",
    idealTemp: { min: 10, max: 25 },
    idealRainfall: { min: 60, max: 200 },
    idealHumidity: { min: 70, max: 90 },
    spaceNeeded: "small",
    harvestTime: "40-50 dias",
    image: "/Imagens/alface.png",
    tips: ["Manter solo úmido", "Colher folhas externas primeiro", "Plantar em local fresco"],
    sunExposure: "partial"
  },
  {
    name: "Cenoura",
    idealTemp: { min: 15, max: 25 },
    idealRainfall: { min: 50, max: 150 },
    idealHumidity: { min: 60, max: 80 },
    spaceNeeded: "medium",
    harvestTime: "70-100 dias",
    image: "/Imagens/cenoura.png",
    tips: ["Solo solto e arenoso", "Regar regularmente", "Desbastar mudas"],
    sunExposure: "full"
  },
  {
    name: "Hortelã",
    idealTemp: { min: 12, max: 28 },
    idealRainfall: { min: 40, max: 180 },
    idealHumidity: { min: 65, max: 85 },
    spaceNeeded: "small",
    harvestTime: "60-90 dias",
    image: "/Imagens/hortela.png",
    tips: ["Melhor em vasos separados", "Manter solo úmido", "Podar regularmente"],
    sunExposure: "partial"
  },
  {
    name: "Pimenta Calabresa",
    idealTemp: { min: 20, max: 32 },
    idealRainfall: { min: 40, max: 100 },
    idealHumidity: { min: 50, max: 70 },
    spaceNeeded: "medium",
    harvestTime: "70-90 dias",
    image: "/Imagens/pimenta.png",
    tips: ["Sol pleno", "Regar quando solo estiver seco", "Suporte para crescimento"],
    sunExposure: "full"
  },
  {
    name: "Rúcula",
    idealTemp: { min: 10, max: 25 },
    idealRainfall: { min: 40, max: 120 },
    idealHumidity: { min: 60, max: 80 },
    spaceNeeded: "small",
    harvestTime: "30-40 dias",
    image: "/Imagens/rucula.png",
    tips: ["Colher folhas jovens", "Cresce rápido", "Gosta de clima ameno"],
    sunExposure: "partial"
  },
  {
    name: "Morango",
    idealTemp: { min: 15, max: 25 },
    idealRainfall: { min: 40, max: 100 },
    idealHumidity: { min: 65, max: 80 },
    spaceNeeded: "small",
    harvestTime: "60-90 dias",
    image: "/Imagens/morango.png",
    tips: ["Vasos suspensos", "Proteger do excesso de chuva", "Colher maduro"],
    sunExposure: "full"
  },
  {
    name: "Salsinha",
    idealTemp: { min: 10, max: 25 },
    idealRainfall: { min: 40, max: 120 },
    idealHumidity: { min: 60, max: 80 },
    spaceNeeded: "small",
    harvestTime: "70-90 dias",
    image: "/Imagens/salsinha.png",
    tips: ["Cortar talos externos", "Sol pleno ou parcial", "Regas regulares"],
    sunExposure: "partial"
  },
  {
    name: "Coentro",
    idealTemp: { min: 15, max: 25 },
    idealRainfall: { min: 40, max: 100 },
    idealHumidity: { min: 60, max: 75 },
    spaceNeeded: "small",
    harvestTime: "30-45 dias",
    image: "/Imagens/coentro.png",
    tips: ["Colher folhas jovens", "Não transplantar", "Sol pleno"],
    sunExposure: "full"
  }
];

// VERIFICAÇÃO: TODAS as plantas têm imagens?
console.log('✅ VERIFICAÇÃO DE IMAGENS LOCAIS:');
PLANT_DATABASE.forEach((plant, index) => {
  if (plant.image) {
    console.log(`✅ ${plant.name} - ${plant.image}`);
  } else {
    console.log(`❌ ${plant.name} - SEM IMAGEM`);
  }
});

const OPENWEATHER_API_KEY = "6ec5ac7a1c9e25dc52ebcde8522746cd";

/* ===============================
   🌤️ Tipos
   =============================== */
interface WeatherData {
  dailyData: Array<{ date: Date; temp: number; rain: number; humidity: number }>;
  averages: { temp: number; rain: number; humidity: number };
}

interface Plant {
  name: string;
  idealTemp: { min: number; max: number };
  idealRainfall: { min: number; max: number };
  idealHumidity: { min: number; max: number };
  spaceNeeded: string;
  harvestTime: string;
  image: string;
  tips: string[];
  sunExposure: string;
  suboptimal?: boolean;
  additionalTips?: string[];
}

/* ===============================
   📊 Componente de Gráfico COM CHART.JS - MUITO MAIS BONITO
   =============================== */
const WeatherChart: React.FC<{ weatherData: WeatherData }> = ({ weatherData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!weatherData || !chartRef.current) return;

    // Carrega Chart.js dinamicamente
    const loadChartJS = () => {
      if ((window as any).Chart) {
        initializeChart();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = initializeChart;
      document.head.appendChild(script);
    };

    const initializeChart = () => {
      const Chart = (window as any).Chart;
      if (!Chart || !chartRef.current) return;

      // CORREÇÃO: Verificação adicional para null
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      // Destrói gráfico anterior se existir
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Dados para o gráfico (próximos 7 dias)
      const data = weatherData.dailyData.slice(0, 7);
      
      // Formata datas
      const labels = data.map(day => {
        const date = new Date(day.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });

      // Cria o gráfico
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: data.map(day => day.temp),
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#ff6b6b',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              yAxisID: 'y'
            },
            {
              label: 'Precipitação (mm)',
              data: data.map(day => day.rain),
              type: 'bar',
              backgroundColor: 'rgba(77, 171, 247, 0.7)',
              borderColor: 'rgba(77, 171, 247, 1)',
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false,
              yAxisID: 'y1'
            },
            {
              label: 'Umidade (%)',
              data: data.map(day => day.humidity),
              borderColor: '#51cf66',
              backgroundColor: 'rgba(81, 207, 102, 0.1)',
              borderWidth: 3,
              borderDash: [5, 5],
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#51cf66',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              yAxisID: 'y2'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#495057',
                font: {
                  size: 12,
                  family: "'Inter', 'Segoe UI', sans-serif",
                  weight: '600'
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#2b2d42',
              bodyColor: '#2b2d42',
              borderColor: '#e9ecef',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    if (label.includes('Temperatura')) {
                      label += `${context.parsed.y.toFixed(1)}°C`;
                    } else if (label.includes('Precipitação')) {
                      label += `${context.parsed.y.toFixed(1)}mm`;
                    } else if (label.includes('Umidade')) {
                      label += `${context.parsed.y.toFixed(1)}%`;
                    }
                  }
                  return label;
                }
              }
            },
            title: {
              display: true,
              text: 'Evolução Climática - Próximos 7 Dias',
              color: '#2b2d42',
              font: {
                size: 16,
                family: "'Inter', 'Segoe UI', sans-serif",
                weight: '700'
              },
              padding: {
                bottom: 20
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(233, 236, 239, 0.8)',
                drawBorder: false
              },
              ticks: {
                color: '#6c757d',
                font: {
                  size: 11,
                  family: "'Inter', 'Segoe UI', sans-serif"
                }
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Temperatura (°C)',
                color: '#ff6b6b',
                font: {
                  size: 12,
                  family: "'Inter', 'Segoe UI', sans-serif",
                  weight: '600'
                }
              },
              grid: {
                color: 'rgba(233, 236, 239, 0.5)',
                drawBorder: false
              },
              ticks: {
                color: '#6c757d',
                font: {
                  size: 11
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Precipitação (mm)',
                color: '#4dabf7',
                font: {
                  size: 12,
                  family: "'Inter', 'Segoe UI', sans-serif",
                  weight: '600'
                }
              },
              grid: {
                drawOnChartArea: false,
                drawBorder: false
              },
              ticks: {
                color: '#6c757d',
                font: {
                  size: 11
                }
              }
            },
            y2: {
              type: 'linear',
              display: false,
              position: 'right'
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          elements: {
            line: {
              tension: 0.4
            }
          }
        }
      });
    };

    loadChartJS();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [weatherData]);

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0 text-primary">
            📊 Evolução Climática
          </h5>
          <span className="badge bg-light text-dark small">
            Próximos 7 dias
          </span>
        </div>
        <p className="text-muted small mb-4">
          Previsão de temperatura, precipitação e umidade para otimizar seu planejamento de plantio
        </p>
        <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
          <canvas ref={chartRef} />
        </div>
        <div className="row mt-4 text-center">
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center">
              <div className="legend-color temperature-color me-2"></div>
              <small className="text-muted fw-semibold">Temperatura</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center">
              <div className="legend-color precipitation-color me-2"></div>
              <small className="text-muted fw-semibold">Precipitação</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center">
              <div className="legend-color humidity-color me-2"></div>
              <small className="text-muted fw-semibold">Umidade</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   🗺️ MapComponent SUPER SIMPLES
   =============================== */
const MapComponent: React.FC<{ 
  onLocationSelect: (lat: number, lon: number) => void,
  selectedLat: number | null,
  selectedLon: number | null
}> = ({ onLocationSelect, selectedLat, selectedLon }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    // Carrega Leaflet apenas uma vez
    const loadLeaflet = () => {
      if ((window as any).L) {
        initializeMap();
        return;
      }

      // Carrega CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Carrega JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      // Limpa o container
      if (mapRef.current.innerHTML) {
        mapRef.current.innerHTML = '';
      }

      // Cria o mapa
      mapInstance.current = L.map(mapRef.current).setView([-23.55, -46.63], 5);
      
      // Adiciona tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Evento de clique
      mapInstance.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Remove marcador anterior
        if (markerInstance.current) {
          mapInstance.current.removeLayer(markerInstance.current);
        }
        
        // Adiciona novo marcador
        markerInstance.current = L.marker([lat, lng])
          .addTo(mapInstance.current)
          .bindPopup(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
          .openPopup();

        onLocationSelect(lat, lng);
      });

      // Adiciona marcador se já tiver seleção
      if (selectedLat && selectedLon) {
        if (markerInstance.current) {
          mapInstance.current.removeLayer(markerInstance.current);
        }
        markerInstance.current = L.marker([selectedLat, selectedLon])
          .addTo(mapInstance.current)
          .bindPopup(`📍 ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`)
          .openPopup();
        mapInstance.current.setView([selectedLat, selectedLon], 10);
      }

      // Ajusta tamanho
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 100);
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onLocationSelect]);

  // Efeito para atualizar marcador quando coordenadas mudam
  useEffect(() => {
    if (mapInstance.current && selectedLat && selectedLon) {
      const L = (window as any).L;
      if (!L) return;

      if (markerInstance.current) {
        mapInstance.current.removeLayer(markerInstance.current);
      }
      
      markerInstance.current = L.marker([selectedLat, selectedLon])
        .addTo(mapInstance.current)
        .bindPopup(`📍 ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`)
        .openPopup();
      
      mapInstance.current.setView([selectedLat, selectedLon], 10);
    }
  }, [selectedLat, selectedLon]);

  return (
    <div 
      ref={mapRef}
      style={{ 
        height: '400px', 
        backgroundColor: '#eee', 
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}
      className="mt-2"
    />
  );
};

/* ===============================
   🌿 Componente principal COM IMAGENS LOCAIS
   =============================== */
export const Ferramentas: React.FC = () => {
  const [location, setLocation] = useState("");
  const [spaceType, setSpaceType] = useState("small");
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLon, setSelectedLon] = useState<number | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  // MESMA FUNÇÃO da OpenWeather API do JS original
  const fetchClimateDataFromOpenWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${OPENWEATHER_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao obter dados da OpenWeather");
    const data = await response.json();
    
    const days: any = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!days[dateStr]) {
        days[dateStr] = {
          date: date,
          temp: [],
          rain: 0,
          humidity: []
        };
      }
      
      days[dateStr].temp.push(item.main.temp);
      days[dateStr].rain += item.rain ? item.rain['3h'] || 0 : 0;
      days[dateStr].humidity.push(item.main.humidity);
    });
    
    const dailyData = [];
    for (const dateStr in days) {
      const day = days[dateStr];
      dailyData.push({
        date: day.date,
        temp: day.temp.reduce((a: number, b: number) => a + b, 0) / day.temp.length,
        rain: day.rain,
        humidity: day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length
      });
    }
    
    const averages = {
      temp: dailyData.reduce((sum, day) => sum + day.temp, 0) / dailyData.length,
      rain: dailyData.reduce((sum, day) => sum + day.rain, 0) / dailyData.length,
      humidity: dailyData.reduce((sum, day) => sum + day.humidity, 0) / dailyData.length
    };
    
    return {
      dailyData: dailyData,
      averages: averages
    };
  };

  // MESMA FUNÇÃO de simulação do JS original
  const simulateWeatherData = (lat: number, lon: number): WeatherData => {
    const dailyData = [];
    const today = new Date();
    
    const isNorthern = lat > 0;
    const seasonalOffset = isNorthern ? 
      (today.getMonth() / 12 * Math.PI * 2) : 
      ((today.getMonth() + 6) / 12 * Math.PI * 2);
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const seasonalVar = Math.sin(seasonalOffset + i/14 * Math.PI) * 8;
      const baseTemp = 25 - (Math.abs(lat) / 3);
      
      dailyData.push({
        date: date,
        temp: baseTemp + seasonalVar + (Math.random() * 4 - 2),
        rain: Math.max(0, (Math.random() * 10 + seasonalVar/3)),
        humidity: 60 + seasonalVar/2 + (Math.random() * 15 - 7.5)
      });
    }
    
    return {
      dailyData: dailyData,
      averages: {
        temp: dailyData.reduce((sum, day) => sum + day.temp, 0) / dailyData.length,
        rain: dailyData.reduce((sum, day) => sum + day.rain, 0) / dailyData.length,
        humidity: dailyData.reduce((sum, day) => sum + day.humidity, 0) / dailyData.length
      }
    };
  };

  // MESMA FUNÇÃO de status de plantio
  const getPlantingStatus = (day: any) => {
    const tempOk = day.temp >= 15 && day.temp <= 30;
    const rainOk = day.rain >= 1 && day.rain <= 20;
    const humidityOk = day.humidity >= 50 && day.humidity <= 85;

    if (tempOk && rainOk && humidityOk) return { status: 'good', text: 'Bom para plantar' };
    if (day.temp < 5 || day.temp > 35 || day.humidity < 30) return { status: 'bad', text: 'Não plantar' };
    return { status: 'neutral', text: 'Condições regulares' };
  };

  // MESMA FUNÇÃO de recomendações
  const generatePlantRecommendations = (weatherData: WeatherData, spaceType: string): Plant[] => {
    const { averages } = weatherData;
    
    if (!averages || isNaN(averages.temp) || isNaN(averages.rain) || isNaN(averages.humidity)) {
      return [];
    }

    let recommendations = PLANT_DATABASE.filter(plant => {
      const tempOk = averages.temp >= plant.idealTemp.min && averages.temp <= plant.idealTemp.max;
      const rainOk = averages.rain >= plant.idealRainfall.min && averages.rain <= plant.idealRainfall.max;
      const humidityOk = averages.humidity >= plant.idealHumidity.min && averages.humidity <= plant.idealHumidity.max;
      const spaceOk = (spaceType === "small" && plant.spaceNeeded === "small") ||
                     (spaceType === "medium" && (plant.spaceNeeded === "small" || plant.spaceNeeded === "medium")) ||
                     (spaceType === "large");
      return tempOk && rainOk && humidityOk && spaceOk;
    });

    if (recommendations.length === 0) {
      recommendations = PLANT_DATABASE.filter(plant => {
        const tempMargin = 2;
        const rainMargin = 10;
        const humidityMargin = 5;
        
        const tempClose = (averages.temp >= plant.idealTemp.min - tempMargin && 
                         averages.temp <= plant.idealTemp.max + tempMargin);
        const rainClose = (averages.rain >= plant.idealRainfall.min - rainMargin && 
                          averages.rain <= plant.idealRainfall.max + rainMargin);
        const humidityClose = (averages.humidity >= plant.idealHumidity.min - humidityMargin && 
                             averages.humidity <= plant.idealHumidity.max + humidityMargin);
        
        const spaceOk = (spaceType === "small" && plant.spaceNeeded === "small") ||
                       (spaceType === "medium" && (plant.spaceNeeded === "small" || plant.spaceNeeded === "medium")) ||
                       (spaceType === "large");
        
        return (tempClose || rainClose || humidityClose) && spaceOk;
      });

      if (recommendations.length > 0) {
        recommendations = recommendations.map(plant => ({
          ...plant,
          suboptimal: true,
          additionalTips: ["Esta planta pode não ter o desempenho ideal nas condições atuais, mas pode ser cultivada com cuidados extras."]
        }));
      }
    }

    return recommendations;
  };

  // MESMA FUNÇÃO de detecção de localização
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setSelectedLat(position.coords.latitude);
        setSelectedLon(position.coords.longitude);
        setLocation("Sua Localização Atual");
      }, error => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível detectar sua localização. Por favor, digite sua cidade.");
      });
    } else {
      alert("Geolocalização não suportada pelo seu navegador. Por favor, digite sua cidade.");
    }
  };

  // MESMA FUNÇÃO de seleção do mapa
const handleMapLocationSelect = (lat: number, lon: number) => {
  setSelectedLat(lat);
  setSelectedLon(lon);
  setLocation("Local selecionado no mapa");
};

// ✅ ADICIONE ESTA FUNÇÃO:
// BUSCA RÁPIDA COM ENTER - APENAS ATUALIZA O MAPA
const handleQuickSearch = async () => {
  if (!location.trim()) return;

  try {
    setIsSearching(true);
    const coords = await getCoordinates(location);
    setSelectedLat(coords.lat);
    setSelectedLon(coords.lon);
    
    // Busca recomendações automaticamente
    setTimeout(() => {
      getRecommendations();
    }, 1000);
    
  } catch (error: any) {
    console.error('Erro na busca rápida:', error);
    alert(`Não foi possível encontrar "${location}". Tente outro nome.`);
  } finally {
    setIsSearching(false);
  }
};

// MESMA FUNÇÃO para obter coordenadas
// ✅ FUNÇÃO CORRIGIDA PARA BUSCAR COORDENADAS DA CIDADE
const getCoordinates = async (location: string): Promise<{lat: number, lon: number}> => {
  console.log(`🔍 Buscando coordenadas para: "${location}"`);
  
  // Primeiro tenta com Nominatim (OpenStreetMap)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&accept-language=pt-BR`;
    console.log(`🌐 Tentando Nominatim: ${nominatimUrl}`);
    
    const response = await fetch(nominatimUrl, { 
      headers: { 
        'User-Agent': 'WastechApp/1.0',
        'Accept': 'application/json'
      } 
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }
    
    const results = await response.json();
    console.log(`📋 Resultados Nominatim:`, results);
    
    if (results && results.length > 0) {
      const result = results[0];
      const coords = { 
        lat: parseFloat(result.lat), 
        lon: parseFloat(result.lon) 
      };
      console.log(`✅ Coordenadas encontradas via Nominatim:`, coords);
      return coords;
    }
  } catch (nominatimError) {
    console.warn('❌ Erro no Nominatim, tentando OpenWeather:', nominatimError);
  }

  // Fallback: Tenta com OpenWeather Geocoding API
  try {
    const openWeatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    console.log(`🌐 Tentando OpenWeather Geocoding: ${openWeatherUrl}`);
    
    const response = await fetch(openWeatherUrl);
    if (!response.ok) {
      throw new Error(`OpenWeather Geocoding error: ${response.status}`);
    }
    
    const results = await response.json();
    console.log(`📋 Resultados OpenWeather:`, results);
    
    if (results && results.length > 0) {
      const result = results[0];
      const coords = { 
        lat: result.lat, 
        lon: result.lon 
      };
      console.log(`✅ Coordenadas encontradas via OpenWeather:`, coords);
      return coords;
    }
  } catch (openWeatherError) {
    console.warn('❌ Erro no OpenWeather Geocoding:', openWeatherError);
  }

  // Se ambas as APIs falharem, lança erro
  throw new Error(`Localização "${location}" não encontrada. Tente usar "Cidade, Estado" ou "Cidade, País".`);
};



  // FUNÇÃO PRINCIPAL - MESMA LÓGICA do JS original
 // ✅ FUNÇÃO PRINCIPAL ATUALIZADA
const getRecommendations = async () => {
  if (!location.trim()) {
    alert("Por favor, informe sua localização");
    return;
  }

  setLoading(true);
  try {
    let lat, lon;
    
    // Se for localização do mapa ou geolocalização, usa as coordenadas já selecionadas
    if (location === 'Local selecionado no mapa' || location === 'Sua Localização Atual') {
      if (!selectedLat || !selectedLon) {
        throw new Error("Por favor, selecione uma localização no mapa ou use a detecção automática");
      }
      lat = selectedLat;
      lon = selectedLon;
      console.log(`📍 Usando coordenadas do mapa: ${lat}, ${lon}`);
    } else {
      // Se o usuário digitou uma cidade, busca as coordenadas
      console.log(`🔍 Buscando coordenadas para cidade: "${location}"`);
      const coords = await getCoordinates(location);
      lat = coords.lat;
      lon = coords.lon;
      console.log(`✅ Coordenadas obtidas: ${lat}, ${lon}`);
      
      // Atualiza as coordenadas selecionadas para mostrar no mapa
      setSelectedLat(lat);
      setSelectedLon(lon);
    }

    let weatherData;
    
    // Tenta primeiro com a API real
    try {
      console.log(`🌤️ Buscando dados da OpenWeather API...`);
      weatherData = await fetchClimateDataFromOpenWeather(lat, lon);
      console.log(`✅ Dados reais obtidos:`, weatherData);
    } catch (apiError) {
      console.warn("❌ API falhou, usando dados simulados:", apiError);
      weatherData = simulateWeatherData(lat, lon);
      console.log(`📊 Dados simulados gerados:`, weatherData);
    }

    const recommendations = generatePlantRecommendations(weatherData, spaceType);
    setWeatherData(weatherData);
    setRecommendations(recommendations);
    setShowResults(true);

    console.log(`🌿 ${recommendations.length} plantas recomendadas`);

  } catch (error: any) {
    console.error("❌ Erro no processo:", error);
    
    // Mensagem de erro mais amigável
    let errorMessage = "Não foi possível processar sua solicitação. ";
    
    if (error.message.includes("não encontrada")) {
      errorMessage += "Verifique se o nome da cidade está correto e tente no formato 'Cidade, Estado'.";
    } else if (error.message.includes("localização")) {
      errorMessage += "Por favor, selecione uma localização no mapa ou use a detecção automática.";
    } else {
      errorMessage += "Tente novamente em alguns instantes.";
    }
    
    alert(errorMessage);

    // Fallback com dados simulados
    try {
      console.log(`🔄 Tentando fallback com dados simulados...`);
      const fallbackLat = selectedLat || -23.55;
      const fallbackLon = selectedLon || -46.63;
      const fallbackData = simulateWeatherData(fallbackLat, fallbackLon);
      const recommendations = generatePlantRecommendations(fallbackData, spaceType);
      
      setWeatherData(fallbackData);
      setRecommendations(recommendations);
      setShowResults(true);
      
      alert("⚠️ Sistema usando dados simulados para demonstração");
    } catch (fallbackError) {
      console.error("❌ Erro no fallback:", fallbackError);
      alert("❌ Não foi possível gerar recomendações. Tente novamente.");
    }
  } finally {
    setLoading(false);
  }
};

  // Renderizar calendário de plantio
  const renderPlantingCalendar = () => {
    if (!weatherData) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (
      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
        {weatherData.dailyData.slice(0, 14).map((day, i) => {
          const dayDate = new Date(day.date);
          const isToday = dayDate.toDateString() === today.toDateString();
          const { status, text } = getPlantingStatus(day);
          
          let weatherIcon;
          if (day.rain > 5) weatherIcon = '🌧️';
          else if (day.temp > 28) weatherIcon = '☀️';
          else if (day.temp < 15) weatherIcon = '❄️';
          else weatherIcon = '⛅';
          
          const statusClass = status === 'good' ? 'good-planting' : status === 'neutral' ? 'neutral-planting' : 'bad-planting';
          const todayClass = isToday ? 'current-day' : '';
          
          return (
            <div key={i} className={`calendar-day ${statusClass} ${todayClass}`} 
                 style={{ 
                   background: 'white', 
                   border: '2px solid #e9ecef', 
                   borderRadius: '10px', 
                   padding: '10px', 
                   textAlign: 'center' 
                 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <small className="fw-bold">{dayDate.getDate()}/{dayDate.getMonth() + 1}</small>
                <span>{weatherIcon}</span>
              </div>
              <small className="d-block mt-1">{day.temp.toFixed(1)}°C</small>
              <small className="d-block">{day.rain.toFixed(1)}mm</small>
              <div className="planting-status">{text}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar plantas recomendadas - COM IMAGENS LOCAIS
  const renderPlantRecommendations = () => {
    if (recommendations.length === 0) {
      return (
        <div className="col-12">
          <div className="alert alert-warning">
            <div className="d-flex align-items-center">
              <span className="me-2">🌱</span>
              <div>
                <strong>Nenhuma planta recomendada para as condições atuais.</strong>
                <br />
                <small className="text-muted">Tente ajustar o tipo de espaço ou verifique outras plantas que podem se adaptar.</small>
              </div>
            </div>
            <button 
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => {
                const allPlants = PLANT_DATABASE.map(plant => ({
                  ...plant,
                  suboptimal: true,
                  additionalTips: ["Esta planta não é ideal para as condições atuais, mas pode ser cultivada com cuidados extras."]
                }));
                setRecommendations(allPlants);
              }}
            >
              🌿 Mostrar todas as 10 plantas com dicas de cultivo
            </button>
          </div>
        </div>
      );
    }
    
    return recommendations.map((plant, index) => (
      <div key={index} className="col-md-6 col-lg-4 mb-4">
        <div className={`card card-plant h-100 ${plant.suboptimal ? 'border-warning' : 'border-success'} shadow-sm`} 
             style={{ 
               position: 'relative',
               transition: 'all 0.3s ease',
               borderWidth: plant.suboptimal ? '2px' : '1px'
             }}>
          {plant.suboptimal && (
            <div className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
              ⚠️ Condições subótimas
            </div>
          )}
          {!plant.suboptimal && (
            <div className="badge bg-success position-absolute top-0 end-0 m-2">
              ✅ Ideal
            </div>
          )}
          <img 
            src={plant.image} 
            className="card-img-top" 
            alt={plant.name}
            style={{ 
              height: '200px', 
              objectFit: 'cover',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
            onError={(e) => {
              // Fallback para imagem quebrada
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/4CAF50/white?text=${encodeURIComponent(plant.name)}`;
            }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-success">{plant.name}</h5>
            <p className="card-text">
              <small className="text-muted">
                <strong>🌱 Colheita:</strong> {plant.harvestTime}
              </small>
              <br />
              <small className="text-muted">
                <strong>☀️ Exposição solar:</strong> {plant.sunExposure === 'full' ? 'Sol pleno' : plant.sunExposure === 'partial' ? 'Meia sombra' : 'Sombra'}
              </small>
              <br />
              <small className="text-muted">
                <strong>📏 Espaço:</strong> {plant.spaceNeeded === 'small' ? 'Pequeno' : plant.spaceNeeded === 'medium' ? 'Médio' : 'Grande'}
              </small>
            </p>
            <div className="mt-auto">
              <h6 className="text-primary mb-2">💡 Dicas de cultivo:</h6>
              <ul className="small mb-3" style={{ paddingLeft: '1.2rem' }}>
                {plant.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="mb-1">{tip}</li>
                ))}
                {plant.additionalTips?.map((tip, tipIndex) => (
                  <li key={tipIndex} className="mb-1 text-warning">
                    <strong>{tip}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Renderizar dicas personalizadas
  const renderPersonalTips = () => {
    if (!weatherData) return null;
    
    const { averages } = weatherData;
    const numRecommendations = recommendations.length;
    const tips = [];

    if (!averages || isNaN(averages.temp) || isNaN(averages.rain) || isNaN(averages.humidity)) {
      tips.push("Não foi possível calcular as médias climáticas. Tente novamente mais tarde.");
    } else {
      if (averages.temp < 10) {
        tips.push("🌡️ Temperaturas muito baixas - considere plantar em estufa ou usar coberturas de proteção");
      } else if (averages.temp < 15) {
        tips.push("❄️ Temperaturas baixas - plantas de clima frio podem se desenvolver melhor");
      } else if (averages.temp > 28) {
        tips.push("🔥 Temperaturas altas - regue no início da manhã ou final da tarde para evitar evaporação");
      } else if (averages.temp > 32) {
        tips.push("☀️ Temperaturas muito altas - considere sombreamento para proteger as plantas");
      }

      if (averages.rain < 5) {
        tips.push("💧 Período seco - aumente a frequência de regas e considere usar cobertura morta");
      } else if (averages.rain > 15) {
        tips.push("🌧️ Período chuvoso - verifique a drenagem do solo para evitar encharcamento");
      }

      if (averages.humidity < 40) {
        tips.push("💨 Umidade muito baixa - pulverize água nas folhas nos horários mais frescos");
      } else if (averages.humidity > 85) {
        tips.push("💦 Umidade muito alta - aumente a ventilação para evitar fungos");
      }

      if (numRecommendations > 3) {
        tips.push("🎉 Excelentes condições para diversas plantas!");
      } else if (numRecommendations === 0) {
        tips.push("⚠️ Condições climáticas desafiadoras - considere plantas mais resistentes ou cultivo protegido");
      }
    }

    tips.push(
      "⏰ Melhor horário para regar: entre 6h e 10h da manhã",
      "🌱 Verifique sempre a umidade do solo antes de regar",
      "💚 Adube suas plantas a cada 15-30 dias durante o período de crescimento"
    );

    return (
      <>
        <div className={`alert ${numRecommendations > 0 ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
          <span className="me-2">{numRecommendations > 0 ? '✅' : '⚠️'}</span>
          <div>
            <strong>{numRecommendations} plantas</strong> recomendadas para suas condições atuais
          </div>
        </div>
        <ul className="list-group list-group-flush">
          {tips.map((tip, index) => (
            <li key={index} className="list-group-item d-flex align-items-center">
              <span className={`me-3 ${numRecommendations > 0 ? 'text-success' : 'text-warning'}`}>
                {index < tips.length - 3 ? '💡' : '🌱'}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <div className="container py-5">
        
        
        <div className="text-center mb-5">
          <h1 className="display-4">🌱 O Que Plantar?</h1>
          <p className="lead">Recomendações precisas baseadas em dados de satélite da OpenWeather API</p>
          <span className="nasa-badge">
            Dados da OpenWeather API
          </span>
        </div>

        <div className="row g-4">
          {/* Painel esquerdo - Configurações */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">⚙️ Configurações</h5>
                
 <div className="mb-3">
  <label className="form-label">📍 Localização</label>
  
  {/* Campo 1: Digitar localização */}
  <div className="mb-3">
    <label className="form-label small text-muted">Digite sua cidade</label>
    <div className="input-group">
      <input 
        type="text" 
        className="form-control" 
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleQuickSearch();
          }
        }}
        placeholder="Ex: São Paulo, Rio de Janeiro..." 
      />
      <button 
        className="btn btn-primary" 
        type="button"
        onClick={handleQuickSearch}
        disabled={!location.trim() || isSearching}
        title="Buscar no mapa"
      >
        {isSearching ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          '🔍'
        )}
      </button>
    </div>
    <div className="form-text small">
      Digite o nome da cidade e pressione Enter ou clique na lupa para buscar no mapa
    </div>
  </div>

  {/* Campo 2: Localização atual */}
  <div className="mb-3">
    <label className="form-label small text-muted">Clique ao lado para visualizar sua localização atual</label>
    <div className="d-grid">
      <button 
        className="btn btn-outline-success" 
        type="button"
        onClick={detectLocation}
      >
        📍 Usar Minha Localização Atual
      </button>
    </div>
  </div>

  {/* Mapa */}
  <div className="form-text small mb-2">Ou selecione manualmente no mapa abaixo</div>
  <MapComponent 
    onLocationSelect={handleMapLocationSelect}
    selectedLat={selectedLat}
    selectedLon={selectedLon}
  />
</div>
                
                <div className="mb-3">
                  <label className="form-label">🏠 Tipo de Espaço</label>
                  <select 
                    className="form-select" 
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                  >
                    <option value="small">🏡 Vaso/Pequeno (até 1m²)</option>
                    <option value="medium">🏢 Varanda/Médio (1-5m²)</option>
                    <option value="large">🌳 Quintal/Grande (+5m²)</option>
                  </select>
                </div>
                
                <button 
                  className="btn btn-success w-100 py-2 fw-bold" 
                  onClick={getRecommendations}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processando...
                    </>
                  ) : (
                    <>
                      🔍 Ver Sugestões de Plantio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Painel direito - Resultados */}
          <div className="col-lg-8">
            {showResults ? (
              <div id="results-section">
                {/* 🌟 SEÇÃO DE CONDIÇÕES CLIMÁTICAS */}
                <div className="card mb-4 climate-card shadow-sm border-0">
                  <div className="card-body p-4">
                    <h5 className="card-title text-center mb-4 d-flex align-items-center justify-content-center">
                      <img src="/Imagens/logoopen.png" alt="OpenWeather API" 
                           style={{ height: '32px', verticalAlign: 'middle', marginRight: '12px' }} />
                      Condições Climáticas Atuais
                    </h5>
                    
                    <div className="climate-stats-container">
                      <div className="row g-4 text-center">
                        {/* Temperatura */}
                        <div className="col-md-4">
                          <div className="climate-stat-card temperature-card p-4 rounded-3">
                            <div className="climate-icon mb-3">
                              🌡️
                            </div>
                            <h3 className="climate-value mb-2">
                              {weatherData?.averages.temp.toFixed(1)}°C
                            </h3>
                            <p className="climate-label mb-1 fw-bold">Temperatura Média</p>
                            <div className="climate-range small text-muted">
                              {weatherData && weatherData.averages.temp > 25 ? (
                                <span className="text-warning">🌡️ Mais quente que o normal</span>
                              ) : weatherData && weatherData.averages.temp < 15 ? (
                                <span className="text-primary">❄️ Mais frio que o normal</span>
                              ) : (
                                <span className="text-success">✅ Condição ideal</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Precipitação */}
                        <div className="col-md-4">
                          <div className="climate-stat-card rainfall-card p-4 rounded-3">
                            <div className="climate-icon mb-3">
                              💧
                            </div>
                            <h3 className="climate-value mb-2">
                              {weatherData?.averages.rain.toFixed(1)}mm
                            </h3>
                            <p className="climate-label mb-1 fw-bold">Precipitação</p>
                            <div className="climate-range small text-muted">
                              {weatherData && weatherData.averages.rain > 10 ? (
                                <span className="text-info">🌧️ Período chuvoso</span>
                              ) : weatherData && weatherData.averages.rain < 2 ? (
                                <span className="text-warning">☀️ Período seco</span>
                              ) : (
                                <span className="text-success">✅ Condição ideal</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Umidade */}
                        <div className="col-md-4">
                          <div className="climate-stat-card humidity-card p-4 rounded-3">
                            <div className="climate-icon mb-3">
                              💨
                            </div>
                            <h3 className="climate-value mb-2">
                              {weatherData?.averages.humidity.toFixed(1)}%
                            </h3>
                            <p className="climate-label mb-1 fw-bold">Umidade do Ar</p>
                            <div className="climate-range small text-muted">
                              {weatherData && weatherData.averages.humidity > 80 ? (
                                <span className="text-info">💦 Alta umidade</span>
                              ) : weatherData && weatherData.averages.humidity < 40 ? (
                                <span className="text-warning">🏜️ Baixa umidade</span>
                              ) : (
                                <span className="text-success">✅ Condição ideal</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <p className="text-muted small mb-0">
                        <span className="badge bg-success">OpenWeather API</span> 
                        <span className="ms-2">Dados atualizados em tempo real</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 📊 GRÁFICO ATUALIZADO - MUITO MAIS BONITO */}
                {weatherData && <WeatherChart weatherData={weatherData} />}
                
                <div className="card mb-4 planting-calendar">
                  <div className="card-body">
                    <h5 className="card-title">📅 Calendário de Plantio</h5>
                    <p className="text-muted small">Melhores dias para plantar baseados nas condições climáticas</p>
                    
                    <div className="d-flex gap-3 mb-3">
                      <div>
                        <span className="badge good-status me-2"></span>
                        <small>Bom para plantar</small>
                      </div>
                      <div>
                        <span className="badge neutral-status me-2"></span>
                        <small>Condições regulares</small>
                      </div>
                      <div>
                        <span className="badge bad-status me-2"></span>
                        <small>Não recomendado</small>
                      </div>
                    </div>
                    
                    {renderPlantingCalendar()}
                  </div>
                </div>
                
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">🌿 Plantas Recomendadas</h5>
                      <span className="badge bg-success">
                        {recommendations.length} {recommendations.length === 1 ? 'planta' : 'plantas'} encontradas
                      </span>
                    </div>
                    <div className="row g-4">
                      {renderPlantRecommendations()}
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">💡 Dicas Personalizadas</h5>
                    <div id="personal-tips">
                      {renderPersonalTips()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5" id="empty-state">
                <img src="/Imagens/logoopen.png" 
                     alt="Imagem de satélite da Terra" className="img-fluid rounded mb-3" 
                     style={{ maxHeight: '200px' }} />
                <h4>🌍 Descubra o que plantar em sua região</h4>
                <p className="text-muted">Informe sua localização para receber recomendações baseadas em dados de satélite</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 ESTILOS CSS ATUALIZADOS - COM ESTILOS DO GRÁFICO MODERNO 🌟 */}
      <style>{`
        .climate-stats-container {
          background: transparent !important;
          border-radius: 12px;
          padding: 0;
        }

        .climate-stats-container,
        .climate-stats-container * {
          background: transparent !important;
        }

        .card.climate-card {
          background: white !important;
        }
        
        .climate-stat-card {
          background: white;
          border: 1px solid #e9ecef !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          border-left: 4px solid transparent;
        }
        
        .climate-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        
        .temperature-card {
          border-left-color: #dc3545;
        }
        
        .rainfall-card {
          border-left-color: #0d6efd;
        }
        
        .humidity-card {
          border-left-color: #198754;
        }
        
        .climate-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }
        
        .climate-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }
        
        .climate-label {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .climate-range {
          font-size: 0.8rem;
        }
        
        .good-status {
          background-color: #198754;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .neutral-status {
          background-color: #ffc107;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .bad-status {
          background-color: #dc3545;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .good-planting {
          border-left: 4px solid #198754 !important;
        }
        
        .neutral-planting {
          border-left: 4px solid #ffc107 !important;
        }
        
        .bad-planting {
          border-left: 4px solid #dc3545 !important;
        }
        
        .current-day {
          border: 2px solid #0d6efd !important;
          background-color: #f8f9fe !important;
        }
        
        .nasa-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .planting-status {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 5px;
        }

        .good-planting .planting-status {
          color: #198754;
        }

        .neutral-planting .planting-status {
          color: #ffc107;
        }

        .bad-planting .planting-status {
          color: #dc3545;
        }

        /* Estilos do gráfico moderno */
        .chart-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }

        .legend-color {
          width: 16px;
          height: 4px;
          border-radius: 2px;
        }

        .temperature-color {
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
        }

        .precipitation-color {
          background: linear-gradient(90deg, #4dabf7, #74c0fc);
        }

        .humidity-color {
          background: linear-gradient(90deg, #51cf66, #69db7c);
        }

        /* Animações suaves */
        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }

        /* Melhorias para os cards de plantas */
        .card-plant {
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .card-plant:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }

        .card-plant img {
          transition: transform 0.3s ease;
        }

        .card-plant:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};