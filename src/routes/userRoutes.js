import { Router } from "express";
const router = Router();
import { createUser, getUsers, getUser, chUser, delUser } from "../controllers/userController.js";

router.post("/users", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await createUser(name, email, password);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

router.get("/users", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Erro ao obter usuários" });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: "Erro ao obter usuário" });
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        const user = await chUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (err) {
        if (err.message === "Usuário não encontrado") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Erro ao editar usuário" });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await delUser(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        if (err.message === "Usuário não encontrado") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

export default router;
