# Salesforce Marketing Cloud Event Notification Service - Exemplo

O Marketing Cloud da Salesforce possui um serviço chamado Event Notification Service, que pode ser utilizado para receber uma notificação de mensagens que são enviadas pela plataforma. Assim, é possível criar sistemas de monitoramento para determinado tipo de mensagem.

Aqui vamos explorar um exemplo muito simples de uma aplicação que pode ser chamada pela plataforma e quantificar essas mensagens.

## Dados técnicos do projeto

Este projeto é uma aplicação Node.js que pode ser implantada no Heroku, com suporte a testes locais utilizando Docker e Docker Compose. A aplicação inclui uma API que alimenta um banco de dados in-memory e possui autenticação via Bearer Token. Além disso, uma camada visual é disponibilizada para apresentar os dados, acessível mediante credenciais configuradas em variáveis de ambiente do Heroku.

## Estrutura do Projeto

```
node-heroku-app
├── src
│   ├── api
│   │   ├── index.js        # Ponto de entrada da API
│   │   └── auth.js         # Funções de autenticação
│   ├── db
│   │   └── memory.js       # Banco de dados in-memory
│   ├── views
│   │   ├── index.ejs       # Página principal
│   │   └── login.ejs       # Página de login
│   ├── public
│   │   └── styles.css       # Estilos CSS
│   └── app.js              # Ponto de entrada da aplicação
├── test
│   └── api.test.js         # Testes da API
├── .dockerignore            # Arquivos a serem ignorados pelo Docker
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore               # Arquivos a serem ignorados pelo Git
├── Dockerfile               # Instruções para construir a imagem Docker
├── docker-compose.yml       # Configuração do Docker Compose
├── package.json             # Configuração do npm
└── README.md                # Documentação do projeto
```

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   cd node-heroku-app
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env` e preencha com suas credenciais.

## Execução

Para executar a aplicação localmente utilizando Docker, utilize o seguinte comando:

```
docker-compose up
```

A aplicação estará disponível em `http://localhost:3000`.

## Testes

Para executar os testes, utilize o seguinte comando:

```
npm test
```

## Implantação no Heroku

1. Crie um novo aplicativo no Heroku:
   ```
   heroku create <NOME_DO_APLICATIVO>
   ```

2. Configure as variáveis de ambiente no Heroku:
   ```
   heroku config:set NOME_VARIAVEL=valor
   ```

3. Faça o push do código para o Heroku:
   ```
   git push heroku main
   ```

4. Acesse a aplicação no Heroku:
   ```
   heroku open
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.