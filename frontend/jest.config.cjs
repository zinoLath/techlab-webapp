module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts', 'tsx'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};