import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
export default class AuthController {

    public async login({ request, response, auth }: HttpContextContract) {
        const { email, password } = request.only(['email', 'password'])
        const token = await auth.use('api').attempt(email, password)
        return response.status(200).json({ token })
    }


    public async register({ request, response }: HttpContextContract) {
        await this.validation(request)
        let isuserexist = await User.findBy('email', request.body().email)
        if (isuserexist) {
            return response.json({ message: "email already exist" })
        }
        const newUser = request.all() as Partial<User>
        // const hashnewpwd = await Hash.make(newUser.password)
        let userobj = {
            email: newUser.email,
            password: newUser.password
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

    async validation(request) {
        let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/;

        const validationSchema = schema.create({
            email: schema.string([
                rules.email(),
                rules.required(),
            ]),
            password: schema.string([
                rules.regex(regex),
                rules.required(),
            ])
        });

        await request.validate({
            schema: validationSchema,
        });
    }
}
