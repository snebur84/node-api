import bcrypt from "bcrypt";
import User from "../models/userModel.js";

async function createUser(name, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new User({
            name,
            email,
            password: hashedPassword, 
        });

        await newUser.save();
        console.log("Usuário criado com sucesso:", newUser);
        return newUser;
    } catch (err) {
        console.error("Erro ao criar o usuário:", err);
        throw err;
    }
}

async function getUsers() {
    try {
        const users = await User.find(); 
        return users;
    } catch (err) {
        console.error("Erro ao obter usuários:", err);
        throw err;
    }
}

async function getUser(id) {
    try {
        const user = await User.findById(id); 
        return user;
    } catch (err) {
        console.error("Erro ao obter usuários:", err);
        throw err;
    }
}

async function chUser(id, data) {
    try {
        const user = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true 
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user;
    } catch (err) {
        console.error("Erro ao editar usuário:", err);
        throw err;
    }
}


async function delUser(id) {
    try {
        const user
        = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    }
    catch (err) {
        console.error("Erro ao deletar usuário:", err);
        throw err;
    }
}

export { createUser, getUsers, getUser, chUser, delUser };
