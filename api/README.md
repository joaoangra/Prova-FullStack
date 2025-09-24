# API - Backend do Techman

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para aplicações web Node.js.
- **Prisma ORM**: ORM para interagir com o banco de dados MySQL.
- **MySQL**: Banco de dados relacional.

## Passo a Passo para Executar
1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Banco de Dados**:
   - Crie um arquivo `.env` na raiz do diretório `api/` com as configurações do MySQL:
     ```
     DATABASE_URL="mysql://username:password@localhost:3306/techman_db"
     ```
   - Substitua `username`, `password` e `techman_db` pelas suas credenciais reais.

3. **Executar Migrações**:
   ```bash
   npx prisma migrate dev
   ```

4. **Iniciar o Servidor**:
   ```bash
   node server.js
   ```
   - O servidor estará rodando em `http://localhost:3000` (ou a porta configurada).

5. **Verificar Funcionamento**:
   - Acesse `http://localhost:3000` no navegador ou use ferramentas como Postman para testar as rotas.

## Estrutura
- `controllers/`: Controladores para usuários, equipamentos e comentários.
- `routes/`: Definição das rotas da API.
- `prisma/`: Configurações do Prisma, incluindo schema e migrações.
