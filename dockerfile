# Шаг 1: Используем официальный образ Node.js
FROM node:18 AS builder

# Шаг 2: Устанавливаем рабочую директорию
WORKDIR /app

# Шаг 3: Копируем package.json и package-lock.json
COPY package*.json ./

# Шаг 4: Устанавливаем зависимости
RUN npm install

# Шаг 5: Копируем всё остальное
COPY . .

# Шаг 6: Компилируем TypeScript в JavaScript
RUN npm run build

# Шаг 7: Устанавливаем образ для продакшена
FROM node:18 AS production

# Шаг 8: Устанавливаем рабочую директорию
WORKDIR /app

# Шаг 9: Копируем только необходимые файлы из предыдущего этапа
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Шаг 10: Настраиваем переменные окружения
# ENV DATABASE_URL="file:/app/prisma/dev.db"
# ENV PORT=3000

# Шаг 11: Генерация Prisma Client
RUN npx prisma generate

# Шаг 12: Пробрасываем порт
EXPOSE 3000

# Шаг 13: Команда запуска приложения
CMD ["node", "dist/src/main"]
