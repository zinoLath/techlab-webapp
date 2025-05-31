#!/bin/bash

cd backend
npm start &

cd ..

cd frontend
npm run dev &
