import {Request, Response, Router} from "express";
import {authenticationController} from "@controllers/AuthenticationController";
import {userController} from "@controllers/UserController";
const userRouter = Router();

userRouter.post("/api/authenticate", authenticationController.authenticate);
userRouter.get("/api/user/email/:email", userController.findByEmail);

userRouter.get("/api/user/me", (request: Request, response: Response) => {
    return response.status(200).json({
        ...request.loggedUser,
        password: undefined,
    });
})

export { userRouter };