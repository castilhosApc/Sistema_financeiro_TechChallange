class Transaction {
    constructor(id, type, amount, date) {
      this.id = id;
      this.type = type;
      this.amount = amount;
      this.date = date;
    }
  
    get formattedAmount() {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(this.amount);
    }
  
    isCredit() {
      return this.type === 'DEPOSIT';
    }
  }
  
  export default Transaction;