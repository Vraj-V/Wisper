class HttpError extends Error{
    constructor(msg,errCode){
        super(msg);
        this.code=errCode;
    }
}

module.exports=HttpError;