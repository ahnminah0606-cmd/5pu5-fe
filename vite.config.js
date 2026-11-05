// # 2026-11-05 | React 개발 서버와 배포용 빌드 설정
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
