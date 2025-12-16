// src/services/api-utils.ts

export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        // On essaie de récupérer le message d'erreur du backend
        let errorMessage = 'Une erreur est survenue';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
       
            errorMessage = response.statusText;
        }

        throw new Error(errorMessage);
    }

    // Si la réponse est 204 (No Content), on renvoie un objet vide typé
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}