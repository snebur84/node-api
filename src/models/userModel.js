import { Schema, model } from "mongoose";

// Expressão regular para validação do e-mail
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return emailRegex.test(v); 
            },
            message: props => `${props.value} não é um e-mail válido!`
        }
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'], 
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres'] 
    },
}, { timestamps: true });

const User = model("User", userSchema);

export default User;

