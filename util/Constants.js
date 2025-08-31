export const Constants = {
    // Base URLs
    BASE_URLS: {
        USER: '/api/users',
        PROJECT: '/api/project',
        RESUME: '/api/resume',
        PROBLEM: '/api/problem',
    },

    // Endpoint configurations
    ENDPOINTS: {
        USER: {
            LOGIN: '/login',
            REGISTER: '/register',
            GET_ALL: '/profiles',
            DELETE: '/del-users',
        },
        PROJECT: {
            GET_ALL: '/get-all-project',
            ADD: '/add-project',
            GET_BY_ID: '/get-by-id/:id',
            UPDATE: '/update-project/:id',
            DELETE: '/delete-project/:id',
        },
        RESUME: {
            ADD: '/add-resume',
            GET_ALL: '/get-all-resumes',
            GET_BY_ID: '/get-by-id/:id',
            UPDATE: '/update-resume/:id',
            DELETE: '/delete-resume/:id',
            DELETE_RESOURCES: '/delete-resources',
        },
        PROBLEM: {
            ADD: '/add-problem',
            GET: '/get-by-id/:id',
            GET_ALL: '/get-all-problems',
            UPDATE: '/update-problem/:id',
            DELETE: '/delete-problem/:id',
        },
    },

    // Utility method to construct full URL
    getFullUrl(baseKey, endpointKey, endpointSubKey, params = {}) {
        const baseUrl = this.BASE_URLS[baseKey];
        const endpoint = this.ENDPOINTS[endpointKey][endpointSubKey];
        let url = `${baseUrl}${endpoint}`;

        // Replace URL parameters
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value);
        });

        return url;
    }
};