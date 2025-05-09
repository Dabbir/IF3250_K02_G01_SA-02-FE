import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Newspaper, BarChart3, Trophy, Smile, Meh, Frown } from "lucide-react";

const NewsPublication = () => {
  const [, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalPublications: 0,
    totalMedia: 0,
    totalPRValue: 0,
    tonePercentages: {
      positive: 0,
      neutral: 0,
      negative: 0
    },
    dominantTone: "neutral"
  });

  const API_URL = import.meta.env.VITE_HOST_NAME;

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${API_URL}/api/publikasi`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch publications: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.data) {
          setPublications(result.data);
          calculateMetrics(result.data);
        } else {
          throw new Error("Failed to fetch publications");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Publikasi gagal dimuat!");
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [API_URL]);

  const calculateMetrics = (data: any[]) => {
    const totalPublications = data.length;

    const uniqueMedia = new Set(data.map(item => item.media_publikasi));
    const totalMedia = uniqueMedia.size;

    const totalPRValue = data.reduce((sum, item) => {
      const value = parseFloat(item.pr_value) || 0;
      return sum + value;
    }, 0);

    const toneCounts = {
      positif: 0,
      netral: 0,
      negatif: 0
    };

    data.forEach(item => {
      const tone = item.tone.toLowerCase();
      if (tone === 'positif') toneCounts.positif++;
      else if (tone === 'netral') toneCounts.netral++;
      else if (tone === 'negatif') toneCounts.negatif++;
    });

    const total = totalPublications;
    const tonePercentages = {
      positive: total > 0 ? Math.round((toneCounts.positif / total) * 100) : 0,
      neutral: total > 0 ? Math.round((toneCounts.netral / total) * 100) : 0,
      negative: total > 0 ? Math.round((toneCounts.negatif / total) * 100) : 0
    };

    let dominantTone = "neutral";
    if (toneCounts.positif > toneCounts.netral && toneCounts.positif > toneCounts.negatif) {
      dominantTone = "positive";
    } else if (toneCounts.negatif > toneCounts.netral && toneCounts.negatif > toneCounts.positif) {
      dominantTone = "negative";
    }

    setMetrics({
      totalPublications,
      totalMedia,
      totalPRValue,
      tonePercentages,
      dominantTone
    });
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} M`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Jt`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} Rb`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between items-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Publikasi Berita</h2>
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#6C9A8B] text-white rounded hover:bg-[#5a8277] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const toneEmojis = {
    positive: <Smile className="w-6 h-6 text-green-600" />,
    neutral: <Meh className="w-6 h-6 text-gray-600" />,
    negative: <Frown className="w-6 h-6 text-red-600" />
  };

  const toneColors = {
    positive: "from-green-400 to-green-600",
    neutral: "from-gray-400 to-gray-600",
    negative: "from-red-400 to-red-600"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Publikasi Berita</h2>
        <Newspaper className="w-5 h-5 text-gray-500" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600">Total Publikasi</p>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-800">{metrics.totalPublications}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600">Total Media</p>
            <Newspaper className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-800">{metrics.totalMedia}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600">PR Value</p>
            <Trophy className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-sm font-bold text-green-800">
            Rp <span className="text-lg">{formatCurrency(metrics.totalPRValue)}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Analisis Sentimen Publikasi</h3>

        <div className="space-y-3">
          {metrics.tonePercentages.positive > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-12 flex items-center justify-center">
                {toneEmojis.positive}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Positif</span>
                  <span className="font-semibold">{metrics.tonePercentages.positive}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${toneColors.positive} transition-all duration-500 ease-out`}
                    style={{ width: `${metrics.tonePercentages.positive}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {metrics.tonePercentages.neutral > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-12 flex items-center justify-center">
                {toneEmojis.neutral}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Netral</span>
                  <span className="font-semibold">{metrics.tonePercentages.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${toneColors.neutral} transition-all duration-500 ease-out`}
                    style={{ width: `${metrics.tonePercentages.neutral}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {metrics.tonePercentages.negative > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-12 flex items-center justify-center">
                {toneEmojis.negative}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Negatif</span>
                  <span className="font-semibold">{metrics.tonePercentages.negative}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${toneColors.negative} transition-all duration-500 ease-out`}
                    style={{ width: `${metrics.tonePercentages.negative}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sentimen Dominan:</span>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              metrics.dominantTone === 'positive' ? 'bg-green-100 text-green-800' :
              metrics.dominantTone === 'negative' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {metrics.dominantTone === 'positive' ? 'Positif' :
               metrics.dominantTone === 'negative' ? 'Negatif' : 'Netral'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPublication;