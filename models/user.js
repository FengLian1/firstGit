const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
        const accountSchema = new Schema({
            userName: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            }, 
            first: {
                type: String,
                required: true
            }, 
            last: {
                type: String,
                required: true
            }, 
            password: {
                type: String,
                required: true
            }, 
            type : {
                type: String,
                default: "User"
            },
            date: {
                type: String,
                required: true
            }, 
        });

        accountSchema.pre("save",function(next){

            bcrypt.genSalt(10)
            .then(salt=>{
                bcrypt.hash(this.password,salt)
                .then(hash=>{
                    this.password=hash
                    
                    next();
                })
            })
    
    })

        const accountModel =mongoose.model("account",accountSchema);
        module.exports=accountModel;
