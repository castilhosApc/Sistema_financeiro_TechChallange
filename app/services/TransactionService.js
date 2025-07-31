class TransactionService {
    constructor() {
      this.baseURL = '/api/transactions';
    }
  
    async create(transaction) {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction)
      });
      return await response.json();
    }
  
    async getAll() {
      const response = await fetch(this.baseURL);
      const data = await response.json();
      return data;
    }
  }
  
  const transactionService = new TransactionService();
  export default transactionService;