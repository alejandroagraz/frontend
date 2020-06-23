class ConfirmPayment {
    constructor(id, amount_payable, token, session_id) {
        this.id = id;
        this.amount_payable = amount_payable;
        this.token = token;
        this.session_id = session_id;
    }
}

export default ConfirmPayment;