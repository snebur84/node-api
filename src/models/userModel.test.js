import { connectMemoryDB, closeMemoryDB, clearMemoryDB } from '../utils/memoryDb.js';
import User from "./userModel";

describe("User Model", () => {
    beforeAll(async () => {
            await connectMemoryDB();
        });
    
        beforeEach(async () => {
            await clearMemoryDB();
        });
    
        afterAll(async () => {
            await closeMemoryDB();
        });

    it("should validate a user with a valid email", async () => {
        const validUser = new User({
            name: "Rubens Lemos",
            email: "snebur84@gmail.com",
            password: "password123",
        });

        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe("snebur84@gmail.com");
    });

    it("Deve retornar um erro em caso de email invalido", async () => {
        const invalidUser = new User({
            name: "Rubens Lemos",
            email: "email-invalido",
            password: "password123",
        });

        let error;
        try {
            await invalidUser.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.email.message).toBe("email-invalido não é um e-mail válido!");
    });
});