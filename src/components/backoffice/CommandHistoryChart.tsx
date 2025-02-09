import React, { useState, useEffect, useMemo } from "react";
import { useSSE } from "@/hooks/useSSE";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CommandHistoryRealtimeChart = () => {
  const { data, loading, error } = useSSE("/api/backoffice/home/commandhistory"); // URL SSE
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [formattedData, setFormattedData] = useState<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Transformation des données pour le graphique
    const groupedData = data.reduce((acc: Record<string, Record<string, number>>, item: any) => {
      const { dateGroup, status, count } = item;
      if (!acc[dateGroup]) acc[dateGroup] = {};
      acc[dateGroup][status] = parseInt(count, 10); // Convertir les nombres
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const statuses = ["ALL", "EN_ATTENTE", "EN_PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE"];
    
    // Filtrage des données en fonction du statut sélectionné
    const filteredStatuses = statuses.filter((status) => selectedStatus === "ALL" || status === selectedStatus);

    // Création des datasets
    const datasets = filteredStatuses.map((status) => ({
      label: status,
      data: labels.map((date) => groupedData[date][status] || 0),
      backgroundColor: getColorForStatus(status),
    }));

    setFormattedData({ labels, datasets });
  }, [data, selectedStatus]);

  // Options du graphique
  const options: ChartOptions<"bar"> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: "Nombre de Commandes",
        },
        beginAtZero: true,
        stacked: true,
      },
    },
  }), []);

  return (
    <div>
      {/* Gestion du chargement et des erreurs */}
      {loading && <p className="text-center text-lg font-medium">🔄 Chargement des données en temps réel...</p>}
      {error && <p className="text-red-500 text-center">❌ Erreur : {error}</p>}

      {/* Affichage du filtre si les données sont présentes */}
      {data && data.length > 0 && (
        <div className="mb-4">
          <label htmlFor="status-filter" className="mr-2 font-medium">
            Filtrer par statut :
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border rounded-md"
          >
            {["ALL", "EN_ATTENTE", "EN_PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Affichage du graphique ou message s'il n'y a pas de données */}
      {formattedData.labels.length > 0 ? (
        <Bar data={formattedData} options={options} />
      ) : (
        <p className="text-center text-gray-500">Aucune donnée disponible pour ce statut.</p>
      )}
    </div>
  );
};

// Fonction pour associer une couleur spécifique à chaque statut
function getColorForStatus(status: string) {
  const colors: Record<string, string> = {
    EN_ATTENTE: "#FF6384", // Rouge
    EN_PREPARATION: "#36A2EB", // Bleu
    EXPEDIEE: "#FFCE56", // Jaune
    LIVREE: "#4BC0C0", // Vert
    ANNULEE: "#9966FF", // Violet
    ALL: "#CCCCCC", // Gris
  };
  return colors[status] || "#CCCCCC"; // Couleur par défaut (gris)
}

export default CommandHistoryRealtimeChart;
