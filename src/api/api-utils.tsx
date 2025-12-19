export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = 'Une erreur est survenue';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    // Si 204, on s'assure que ce n'est pas une erreur de logique
    if (response.status === 204) {
        console.warn(" Réponse 204 reçue : le body est vide.");
        return {} as T;
    }

    const data = await response.json();

    // DEBUG PRAGMATIQUE : Ajoutez ce log pour voir ce que le front reçoit réellement
    console.log(" API Response Data:", data);

    return data;
}