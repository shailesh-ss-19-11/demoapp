import { AuthenticationException } from '@adonisjs/auth/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from "App/Models/Profile";
import Joi from 'joi';
export default class ProfilesController {
    async createprofile({ request, response, auth }: HttpContextContract) {
        let userprofile = await Profile.findBy('mobile', request.body().mobile)
        if (userprofile) {
            return response.json({ message: "mobile number already exist" })
        }

        await this.validation(request.body())
        const profile = request.all() as Partial<Profile>
        const token = request.header('Authorization').replace('Bearer ', '')
        const user = await auth.use('api').authenticate(token)
        const userId = user.id
        profile.user_id = userId;
        const newprofile = await Profile.create(profile)
        return newprofile;
    }

    async updateprofile({ request, response, auth }: HttpContextContract) {
        const token = request.header('Authorization').replace('Bearer ', '')
        try {
            const user = await auth.use('api').authenticate(token)
            const userId = user.id
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
        const token = request.header('Authorization').replace('Bearer ', '')
        try {
            const user = await auth.use('api').authenticate(token)
            const userId = user.id
            // You can do further processing here or return the user ID
            let profileData = await Profile.query().where('user_id', userId).delete()
            // let profileData = await Profile.save(request.body());
            if (profileData) {
                return {
                    message: "successfully deleted",
                };
            }
        } catch (error) {
            // If authentication fails or token is invalid, handle the exception
            throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED')
        }
        return { message: "Profile Deleted Successfully" };
    }

    async viewprofile({ request,auth }: HttpContextContract) {
        // let profiles = await Profile.all()
        const token = request.header('Authorization').replace('Bearer ', '')
        console.log(token)
        try {
            const user = await auth.use('api').authenticate(token)
            const userId = user.id
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

    async validation(data: any) {
        const schema = Joi.object({
            name: Joi.string().trim().min(3).max(30).required(),
            dob: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/) // Validate format as dd-mm-yyyy
                .custom((value, helpers) => {
                    const date = value.split('-');
                    const parsedDate = new Date(`${date[2]}-${date[1]}-${date[0]}`);
                    if (isNaN(parsedDate.getTime())) {
                        return helpers.message({ custom: 'Invalid date format. Please use dd-mm-yyyy.' });
                    }
                    return parsedDate.toISOString().split('T')[0];
                }, 'custom date validation'),
            mobile: Joi.string().min(10).max(10).required(),
            gender: Joi.string().regex(/^(?:FEMALE|MALE)$/),
        });

        // const payload = dt.validate(data)
        // return payload;
        const value = await schema.validateAsync(data);
        return value;
    }
}
