/** @type {import('next').NextConfig} */
const nextConfig = {
    "types": [
        "@types/apexcharts" // Add this line
    ],
    env: {
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        PROGRAM_ID: process.env.PROGRAM_ID,
    },


};


export default nextConfig;