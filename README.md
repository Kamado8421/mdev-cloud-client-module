# MdevCloudClient

Cliente TypeScript/Node.js para consumir a API **MDev-Cloud** de forma tipada, com cache interno e suporte a debug.

> **Agradecimentos:**[M'Dev Systems](https://github.com/Kamado8421) e [@luciano\_mendesz9](https://instagram.com/luciano_mendesz9)

> **Contribua Financeiramente para a permanência do projeto:** [contribuir](https://wa.me//559885742985?text=Gostaria+de+contribuir+financeiramente+com+o+projeto+MDev-Cloud)

---

## 📦 Instalação

```bash
npm install mdev-cloud
# ou
yarn add mdev-cloud
# ou
pnpm add mdev-cloud
```

> Requer **Node.js 18+** (fetch nativo).
> Para Node <18, instale manualmente:
>
> ```bash
> npm install node-fetch
> ```

---

## 🚀 Importando

```ts
import { MdevCloudClient } from "mdev-cloud-client";
```

---

## 🔧 Inicialização

```ts
const client = new MdevCloudClient({
  host: "https://meu-servidor.com",
  db_key: "minha-db-key"
});

await client.init({
  debug: true,        // exibe logs no console
  showRequest: false  // exibe resposta bruta de cada request
});
```

* `debug` → Mostra logs internos (ex.: erros de requisição, dados carregados).
* `showRequest` → Loga a resposta bruta de cada requisição no console.

---

## 📚 Métodos Disponíveis

A biblioteca possui **dois tipos de métodos**:

* **Métodos "on\*" → fazem requisições reais na API**
* **Métodos sem prefixo → usam apenas o cache local (mais rápido)**

---

### **1. Testar conexão**

```ts
const status = await client.onTestConnection();
console.log(status.wasConnected); // true ou false
```

* **Retorno:**`{ wasConnected: boolean, message: string }`
* **Uso interno do `init()`**, mas pode ser chamado manualmente.

---

### **2. Obter todos os clientes do cache (local)**

```ts
const localClients = client.getAllClients();
console.log(localClients);
```

* **Não faz requisição** — usa apenas os dados carregados na inicialização.

---

### **3. Obter um cliente do cache (local)**

```ts
const clientData = client.getClient("5511999999999@s.whatsapp.net");
console.log(clientData);
```

* **Não faz requisição** — busca direto no cache local.
* **Retorna:**`DataClientType | null`

---

### **4. Buscar cliente na API (requisição real)**

```ts
const user = await client.onGetClient("5511999999999@s.whatsapp.net");
console.log(user);
```

* **Retorna:**`DataClientType | null`
* **Faz requisição real** e **não atualiza o cache local** automaticamente.

---

### **5. Buscar todos os clientes da API**

```ts
const clients = await client.onGetAllClients();
console.log(clients);
```

* **Retorna:**`DataClientType[]`
* **Atualiza o cache local** (`dataClients`).

---

### **6. Criar cliente na API**

```ts
const newClient = await client.onCreateClient("5511999999999@s.whatsapp.net", "Luciano");
console.log(newClient);
```

* **Retorna:**`DataClientType | null`
* **Adiciona automaticamente no cache local** se sucesso.

---

### **7. Atualizar cliente na API**

```ts
const updatedClient = await client.onUpdateClient("5511999999999@s.whatsapp.net", {
  username: "Novo Nome"
});
console.log(updatedClient);
```

* **Retorna:**`DataClientType` atualizado
* **Atualiza automaticamente no cache local.**

---

### **8. Deletar cliente na API**

```ts
const deleted = await client.onDeleteClient("5511999999999@s.whatsapp.net");
console.log(deleted); // true
```

* **Retorna:**`true` se sucesso
* **Remove do cache local automaticamente.**

---

## 🏗 Estrutura do objeto `DataClientType`

```ts
type DataClientType {
    id: number;
    createdAt: Date;
    name: string;
    jid: string;
    isPremium: boolean;
    isWoner: boolean;
    isBaned: boolean;
    level: string | null;
    xp: number | null;
    money: number | null;
}
```

*(Pode ser expandido conforme a API real.)*

---

## 📖 Exemplo Completo

```ts
import { MdevCloudClient } from "mdev-cloud-client";

async function main() {
  const client = new MdevCloudClient({
    host: "https://meu-servidor.com",
    db_key: "minha-db-key"
  });

  await client.init({ debug: true, showRequest: true });

  // Criar cliente
  const novo = await client.onCreateClient("5511999999999@s.whatsapp.net", "Luciano");
  console.log("Novo cliente:", novo);

  // Buscar todos
  const todos = await client.onGetAllClients();
  console.log("Clientes na API:", todos);

  // Atualizar cliente
  const atualizado = await client.onUpdateClient(novo!.jid, { username: "Luciano Mendes", isPremium: true });
  console.log("Atualizado:", atualizado);

  // Deletar cliente
  await client.onDeleteClient(atualizado.jid);
  console.log("Cliente removido");
}

main().catch(console.error);
```

---

## 🤝 Contribuindo

Pull requests são bem-vindos!
Siga as etapas:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'feat: nova funcionalidade'`)
4. Push na branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📜 Licença

Este projeto é open-source sob a licença **MIT**.

> **Agradecimentos especiais:**
>
> * [M'Dev Systems](https://github.com/MDevSystems)
> * [@luciano\_mendesz9](https://github.com/luciano-mendesz9)

---


