import supertest from 'supertest';
import express from 'express';
import userRoutes from './userRoutes.js';
import { connectMemoryDB, closeMemoryDB, clearMemoryDB } from '../utils/memoryDb.js';
import User from '../models/userModel.js'; 
const app = express();
app.use(express.json());
app.use(userRoutes); 
const request = supertest(app);

async function criarUsuarioTeste() {
    const userData = {
        name: 'Rubens',
        email: 'snebur84@gmail.com',
        password: '123456'
    };
    
    const user = new User(userData);
    await user.save(); 
    return user; 
}

describe('Testes para rotas CRUD de usuários', () => {
    beforeAll(async () => {
        await connectMemoryDB();
    });

    beforeEach(async () => {
        await clearMemoryDB();
    });

    afterAll(async () => {
        await closeMemoryDB();
    });

    it('Deve criar um usuário', async () => {
        const user = await criarUsuarioTeste();

        console.log("Usuário criado:", user); // Debug

        expect(user).toHaveProperty('_id');
        expect(user.name).toBe('Rubens');
        expect(user.email).toBe('snebur84@gmail.com');
    });

    it('Deve retornar erro ao criar um usuário com dados inválidos', async () => {
        const userData = {
            name: 'Rubens',
            email: '',
            password: 123456
        }
        const response = await request.post('/users').send(userData);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });

    it('Deve listar todos usuários', async () => {
        await criarUsuarioTeste(); 

        const response = await request.get('/users');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    it('Deve retornar uma lista vazia de usuários', async () => {
        const response = await request.get('/users');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it('Deve buscar um usuário por ID', async () => {
        const user = await criarUsuarioTeste(); 
        const response = await request.get(`/users/${user._id.toString()}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', user._id.toString());
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
    });

    it('Deve retornar erro ao buscar um usuário inexistente', async () => {
        const response = await request.get('/users/55abcdefgh44ijklmn99op');

        console.log(response.body);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('Deve editar um usuário existente', async () => {
        const user = await criarUsuarioTeste(); 
        const userData = {
            name: 'Rubens Lemos',
            email: 'snebur84@gmail.com',
            password: '123456'
        };
        const response = await request.put(`/users/${user._id.toString()}`).send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', user._id.toString());
        expect(response.body.name).toBe('Rubens Lemos');
    });

    it('Deve retornar erro ao editar um usuário com dados inválidos', async () => {
        const user = await criarUsuarioTeste(); 
        const userData = {
            name: 'Rubens Lemos',
            email: '',
            password: ''
        };
        const response = await request.put(`/users/${user._id.toString()}`).send(userData);
        console.log(response.body);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });

    it('Deve retornar erro ao editar um usuário inexistente', async () => {
        const userData = {
            name: 'Rubens Lemos',
            email: 'snebur84@gmail.com',
            password: '123456'
        };
        const response = await request.put('/users/67c5b88c37f4ac866572de0a').send(userData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('Deve deletar um usuário existente', async () => {
        const user = await criarUsuarioTeste(); 
        const response = await request.delete(`/users/${user._id.toString()}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', user._id.toString());
    });

    it('Deve retornar erro ao deletar um usuário inexistente', async () => {
        const response = await request.delete('/users/67c5b88c37f4ac866572de0a');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
});
