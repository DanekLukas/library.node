import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { book_group, book_groupId } from './book_group'

export interface memberAttributes {
  bind_id_user: number
  id_group: number
  group_name: string
  created_by: number
  id_user: number
  first_name: string
  surname: string
  email: string
}

export type clenPk = 'bind_id_user'
export type clen = view_member[clenPk]
export type memberOptionalAttributes =
  | 'bind_id_user'
  | 'id_group'
  | 'created_by'
  | 'group_name'
  | 'id_user'
  | 'first_name'
  | 'surname'
  | 'email'
export type memberCreationAttributes = Optional<memberAttributes, memberOptionalAttributes>

export class view_member extends Model<memberAttributes, memberCreationAttributes>
  implements memberAttributes {
  bind_id_user!: number
  // id_group!: number;
  group_name!: string
  created_by!: number
  id_user!: number
  first_name!: string
  surname!: string
  email!: string

  // book belongsTo book_group via book_groupId
  id_group!: book_groupId
  getId_group!: Sequelize.BelongsToGetAssociationMixin<book_group>
  setId_group!: Sequelize.BelongsToSetAssociationMixin<book_group, book_groupId>
  createId_group!: Sequelize.BelongsToCreateAssociationMixin<book_group>

  static initModel(sequelize: Sequelize.Sequelize): typeof view_member {
    return view_member.init(
      {
        bind_id_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
        },
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
        first_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        surname: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'view_member',
        timestamps: false,
        freezeTableName: true,
      }
    )
  }
}
