import {assert, beforeEach, describe, expect, it, vi} from "vitest";
import {ApplicationUserBody, UserRepository} from "../../src/repositories/UserRepository";
import {MockUserRepository} from "../../src/repositories/mock/MockUserRepository";

describe("test for user repository create method!", () => {
    let userRepository: UserRepository;

    const JohnDoe: ApplicationUserBody = {
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "123456"
    }

    beforeEach(() => {
        userRepository = new MockUserRepository();
    })

    it("A user must be created!", async () => {
        const user = await userRepository.create(JohnDoe);

        assert(user != null, "User cannot be null!");

        expect(user.email).toBe("johndoe@gmail.com");
    });

    it("An error should occur when trying to create a user with the same email!", async () => {
        await userRepository.create(JohnDoe);

        const spy = vi.spyOn(userRepository, "create");

        const promiseSecondUser = userRepository.create({
            name: "Josh Drew",
            email: "johndoe@gmail.com",
            password: "654321"
        });

        await expect(promiseSecondUser).rejects.toThrowError(new Error(`User with email ${JohnDoe.email} already exists!`))

        expect(spy).toHaveBeenCalled();
    });

})