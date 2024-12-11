/**
 * Classe utilitaire pour gérer les appels API
 */
export class ApiClient {
    static async post<T>(url: string, data: any): Promise<T> {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        // Vérifie d'abord si la réponse est OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Vérifie si la réponse est du JSON valide
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("La réponse n'est pas au format JSON!");
        }
  
        return await response.json();
      } catch (error) {
        if (error instanceof TypeError && error.message === "La réponse n'est pas au format JSON!") {
          throw error;
        }
        throw new Error(
          `Erreur lors de l'appel API à ${url}: ${error instanceof Error ? error.message : "Erreur inconnue"}`
        );
      }
    }
  }