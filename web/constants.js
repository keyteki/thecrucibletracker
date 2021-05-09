export default {
    api: {
        endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/api'
    },
    s3: {
        endpoint: 'https://crucible-tracker-images.s3.amazonaws.com'
    }
};
