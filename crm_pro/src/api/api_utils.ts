const baseUrl = import.meta.env.VITE_API_URL === undefined
    ? "" : import.meta.env.VITE_API_URL;

export async function ApiPost<TResult, TBody>(
    url: string,
    body: TBody,
    token: string | null = null
): Promise<TResult | Error> {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as TResult;
    }
    catch (error) {
        console.error('Error in ApiPost:', error);
        throw error;
    }
}

export async function ApiGet<TResult>(
    url: string,
    token: string | null = null
): Promise<TResult | Error> {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as TResult;
    }
    catch (error) {
        console.error('Error in ApiGet:', error);
        throw error;
    }
}
