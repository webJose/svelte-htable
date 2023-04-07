export async function load({ fetch }) {
    const response = await fetch("https://my.api.mockaroo.com/employees.json", {
        headers: {
            "x-api-key": "a53dac10"
        }
    });
    return {
        data: await response.json()
    };
}
