//dev
const URL_PREFIX = "http://localhost:3002"

const API = {
    getUserData: async id => {
        const res = await fetch(`${URL_PREFIX}/api/users/${id}`)
        return await res.json()
    },
    getUserProperties: async (token) => {
        const res = await fetch(`${URL_PREFIX}/api/properties/allUserProperties`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    },
    getPropertyById: async (propertyId, token) => {
        const res = await fetch(`${URL_PREFIX}/api/properties/${propertyId}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    },
    createNewProperty: async (propertyData, token) => {
        const res = await fetch(`${URL_PREFIX}/api/properties`, {
            method: "POST",
            body: JSON.stringify(propertyData),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    },
    updateProperty: async (propertyId, propertyData, token) => {
        const res = await fetch(`${URL_PREFIX}/api/properties/${propertyId}`, {
            method: "Put",
            body: JSON.stringify(propertyData),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    },
    deleteProperty: async (propertyId, token) => {
        const res = await fetch(`${URL_PREFIX}/api/properties/${propertyId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    },
    isValidToken: async token => {
        const res = await fetch(`${URL_PREFIX}/api/users/isValidToken`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        return await res.json()
    },
    login: async userObj => {
        const res = await fetch(`${URL_PREFIX}/api/users/login`, {
            method: "POST",
            body: JSON.stringify(userObj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        return await res.json()
    },
    signup: async userObj => {
        const res = await fetch(`${URL_PREFIX}/api/users`, {
            method: "POST",
            body: JSON.stringify(userObj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        return await res.json()
    }
}

export default API