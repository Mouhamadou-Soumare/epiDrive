import React, { useState } from "react";
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

  if (loading) return <p>Chargement des données en temps réel...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // Transformation des données pour le graphique
  const groupedData = data.reduce((acc: Record<string, Record<string, number>>, item: any) => {
    const { dateGroup, status, count } = item;
    if (!acc[dateGroup]) acc[dateGroup] = {};
    acc[dateGroup][status] = parseInt(count, 10); // Convertir les nombres si nécessaire
    return acc;
  }, {});

  const labels = Object.keys(groupedData); // Dates
  const statuses = ["ALL", "EN_ATTENTE", "EN_PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE"];

  // Filtrer les données en fonction de l'état sélectionné
  const filteredStatuses = statuses.filter((status) => selectedStatus === "ALL" || status === selectedStatus);

  // Préparer les datasets pour chaque statut
  const datasets = filteredStatuses.map((status) => ({
    label: status,
    data: labels.map((date) => groupedData[date][status] || 0),
    backgroundColor: getColorForStatus(status),
  }));

  // Options du graphique avec typage explicite
  const chartData = {
    labels,
    datasets,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // ✅ Correction du type ici
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        stacked: true, // Empilement sur l'axe X
      },
      y: {
        title: {
          display: true,
          text: "Nombre de Commandes",
        },
        beginAtZero: true,
        stacked: true, // Empilement sur l'axe Y
      },
    },
  };

  return (
    <div>
      {/* Menu déroulant pour filtrer les commandes */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="status-filter" style={{ marginRight: "0.5rem" }}>
          Filtrer par statut :
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc" }}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <Bar data={chartData} options={options} />
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
    ALL: "#CCCCCC", // Gris pour "ALL"
  };
  return colors[status] || "#CCCCCC"; // Couleur par défaut (gris)
}

export default CommandHistoryRealtimeChart;
