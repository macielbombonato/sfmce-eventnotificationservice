FROM node:14

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o aplicativo irá rodar
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["node", "src/app.js"]