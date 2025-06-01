import '@testing-library/jest-dom';
import { TextEncoder } from 'util';


global.TextEncoder = TextEncoder;

interface GlobalThis {
    importMeta: object;
}

(globalThis as unknown as GlobalThis).importMeta = {
    env: {
        VITE_BACKEND_URL: 'http://localhost:3000',
    },
};