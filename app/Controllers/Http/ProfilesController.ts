import { AuthenticationException } from '@adonisjs/auth/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from "App/Models/Profile";
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ProfilesController {
    async createprofile({ request, response, auth }: HttpContextContract) {
        let userprofile = await Profile.findBy('mobile', request.body().mobile)
        if (userprofile) {
            return response.json({ message: "mobile number already exist" })
        }
        await this.validation(request)
        const profile = request.all() as Partial<Profile>
        const userdetails = await auth.use('api')
        const userId = userdetails?.user.id;
        profile.user_id = userId;
        const newprofile = await Profile.create(profile)
        return newprofile;
    }

    async updateprofile({ request, response, auth }: HttpContextContract) {
        await this.validation(request)
        try {
            const userdetails = await auth.use('api')
            const userId = userdetails?.user.id;
            let profileData = await Profile.query().where('user_id', userId).update(request.body())
            if (profileData) {
                return {
                    message: "successfully updated",
                };
            }
        } catch (error) {
            throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED')
        }
    }

    async deleteprofile({ request, auth }: HttpContextContract) {
        try {
            const userdetails = await auth.use('api')
            const userId = userdetails?.user.id;
            let profileData = await Profile.query().where('user_id', userId).delete()
            if (profileData) {
                return {
                    message: "successfully deleted",
                };
            }
        } catch (error) {
            throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED')
        }
        return { message: "Profile Deleted Successfully" };
    }

    async viewprofile({ request, auth }: HttpContextContract) {
        try {
            const userdetails = await auth.use('api')
            const userId = userdetails?.user.id;
            let profileData = await Profile.query().where('user_id', userId)
            if (profileData) {
                return profileData.map((profile) => {
                    return {
                        name: profile?.name,
                        mobile: profile?.mobile,
                        gender: profile?.gender,
                        dob: profile?.dob,
                    }
                })
            }
        } catch (error) {
            throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED')
        }
    }

    async validation(request) {
        const validationSchema = schema.create({
            name: schema.string({}, [
                rules.trim(),
                rules.minLength(3),
                rules.maxLength(30),
                rules.required(),
            ]),
            dob: schema.string({}, [
                rules.regex(/^\d{2}-\d{2}-\d{4}$/),
            ]),
            mobile: schema.string({}, [
                rules.minLength(10),
                rules.minLength(10),
                rules.required(),
                rules.mobile()
            ]),
            gender: schema.string.optional({}, [
                rules.regex(/^(?:FEMALE|MALE)$/),
            ]),
        });

        await request.validate({
            schema: validationSchema,
        });
    }
}
