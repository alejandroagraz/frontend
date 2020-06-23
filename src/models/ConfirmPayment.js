class ConfirmPayment {
    constructor(id, amount_payable, token_email, session_id) {
        this.id = id;
        this.amount_payable = amount_payable;
        this.token_email = token_email;
        this.session_id = session_id;
    }
}

export default ConfirmPayment;