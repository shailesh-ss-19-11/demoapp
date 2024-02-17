import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import Joi from 'joi'
export default class AuthController {

    // public async login({ request, response ,auth}: HttpContextContract) {
    //     const { email, password } = request.only(['email', 'password'])
    //     let user = await User.findBy('email', email)
    //     if (!user) {
    //         response.abort('Invalid credentials')
    //     }
    //     await Hash.verify(user.password, password)

    // }

    public async login({ request, response, auth }: HttpContextContract) {
        const { email, password } = request.only(['email', 'password'])
        // Find the user by email

        const user = await User.findBy('email', email)

        // If user does not exist, return error
        if (!user) {
            return response.status(401).json({ error: 'Invalid credentials' })
        }

        // Verify password
        const isPasswordValid = await Hash.verify(user.password, password)

        // If password is not valid, return error
        if (!isPasswordValid) {
            return response.status(401).json({ error: 'Invalid credentials' })
        }

        // Generate token for the user
        const token = await auth.use('api').generate(user, {
            expiresIn: '7 days' // Set expiry for token
        })
        // return await auth.attempt(email, password)

        // Return token
        return response.status(200).json({ token })
    }


    public async register({ request, response }: HttpContextContract) {
        await this.validation(request.body())

        let isuserexist = await User.findBy('email', request.body().email)
        if (isuserexist) {
            return response.json({ message: "email already exist" })
        }

        const newUser = request.all() as Partial<User>
        const hashnewpwd = await Hash.make(newUser.password)
        let userobj = {
            email: newUser.email,
            password: hashnewpwd
        }
        const user = await User.create(userobj)
        return { email: user.email, message: "user created successfully" };
    }

    public async logout({ request, auth }: HttpContextContract) {
        await auth.logout();
        return {
            message: "Logged out successfully"
        }
    }

    async validation(data: any) {
        let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/;
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(regex).required()
                .messages({
                    'string.pattern.base': 'Password must be between 8 to 16 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
                })
        });

        // Example usage:
        const { error, value } =await schema.validateAsync(data);
        return value;
    }
}
