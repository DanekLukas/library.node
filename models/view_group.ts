import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { book_group, book_groupId } from './book_group'

export interface groupAttributes {
  id_group: number
  group_name: string
  created_by: number
  id_user: number
  email: string
  password: string
  id_user_type: number
  user_type_name: string
  id_group_actual: number
}

export type groupPk = 'id_user'
export type group = view_group[groupPk]
export type groupOptionalAttributes =
  | 'id_group'
  | 'group_name'
  | 'created_by'
  | 'id_user'
  | 'email'
  | 'password'
  | 'id_user_type'
  | 'user_type_name'
  | 'id_group_actual'
export type groupCreationAttributes = Optional<groupAttributes, groupOptionalAttributes>

export class view_group extends Model<groupAttributes, groupCreationAttributes>
  implements groupAttributes {
  // id_group!: number;
  group_name!: string
  created_by!: number
  id_user!: number
  email!: string
  password!: string
  id_user_typ!: number
  user_type_name!: string
  id_group_actual!: number

  // book belongsTo book_group via book_groupId
  id_group!: book_groupId
  getId_group!: Sequelize.BelongsToGetAssociationMixin<book_group>
  setId_group!: Sequelize.BelongsToSetAssociationMixin<book_group, book_groupId>
  createId_group!: Sequelize.BelongsToCreateAssociationMixin<book_group>

  static initModel(sequelize: Sequelize.Sequelize): typeof view_group {
    return view_group.init(
      {
        id_group: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'book_group',
            key: 'id_group',
          },
        },
        group_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        created_by: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        id_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        id_user_type: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'user_type',
            key: 'id',
          },
        },
        user_type_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        id_group_actual: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'group',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'view_group',
        timestamps: false,
        freezeTableName: true,
      }
    )
  }
}
