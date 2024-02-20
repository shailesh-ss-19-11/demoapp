import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column({ isPrimary: true })
  public user_id: number

  @column({ isPrimary: true })
  public mobile: number
  
  @column({ isPrimary: true })
  public name: number

  @column({ isPrimary: true })
  public gender: number

  @column({ isPrimary: true })
  public dob: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
