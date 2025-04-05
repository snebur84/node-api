import request from "supertest";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { createUser, getUsers } from "./userController.js";

jest.mock("../models/userModel.js");

describe("User Controller Tests", () => {
    describe("createUser", () => {
        it("deve lancar um erro em caso de falha na criacao do usuario", async () => {
            const mockUser = {
                name: "Rubens Lemos",
                email: "snebur84@gmail.com",
                password: "password123",
            };

            bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword123");
            User.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

            await expect(createUser(mockUser.name, mockUser.email, mockUser.password)).rejects.toThrow("Database error");
        });
    });

    describe("getUsers", () => {
        it("deve retornar uma lista de usuarios", async () => {
            const mockUsers = [
                { name: "Rubens Lemos", email: "snebur84@gmail.com" },
                { name: "Camila Lemos", email: "camila@example.com" },
            ];

            User.find = jest.fn().mockResolvedValue(mockUsers);

            const result = await getUsers();

            expect(User.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });

        it("deve retornar erro caso nao consiga listar usuarios", async () => {
            User.find = jest.fn().mockRejectedValue(new Error("Database error"));

            await expect(getUsers()).rejects.toThrow("Database error");
        });
    });
});