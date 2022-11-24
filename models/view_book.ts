import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { book_group, book_groupId } from './book_group'
import type { book_object, book_objectId } from './book_object'
import type { document_typId, document_type } from './document_type'

export interface bookAttributes {
  id: number
  created_at: Date
  id_created_by: number
  id_document_type: number
  name: string
  authors: string
  language: string
  published: string
  theme: string
  metadata: string
  isbn: string
  document_type_name: string
  group_name: string
  id_user: number
  id_group: number
  email: string
}

export type bookPk = 'id'
export type bookId = view_book[bookPk]
export type bookOptionalAttributes =
  | 'id'
  | 'created_at'
  | 'id_document_type'
  | 'name'
  | 'authors'
  | 'language'
  | 'published'
  | 'theme'
  | 'metadata'
  | 'isbn'
  | 'document_type_name'
  | 'group_name'
  | 'id_user'
  | 'id_group'
  | 'email'
export type bookCreationAttributes = Optional<bookAttributes, bookOptionalAttributes>

export class view_book extends Model<bookAttributes, bookCreationAttributes>
  implements bookAttributes {
  id!: number
  created_at!: Date
  created_by!: number
  id_created_by!: number
  id_document_type!: number
  name!: string
  authors!: string
  language!: string
  published!: string
  theme!: string
  metadata!: string
  isbn!: string
  document_type_name!: string
  group_name!: string
  id_user!: number
  id_group!: number
  email!: string

  // book belongsTo document_type via id_document_type
  id_document_typ_document_typ!: document_type
  getId_document_typ_document_typ!: Sequelize.BelongsToGetAssociationMixin<document_type>
  setId_document_typ_document_typ!: Sequelize.BelongsToSetAssociationMixin<
    document_type,
    document_typId
  >
  createId_document_typ_document_typ!: Sequelize.BelongsToCreateAssociationMixin<document_type>
  // book hasMany book_object via id_book
  book_objects!: book_object[]
  getbook_objects!: Sequelize.HasManyGetAssociationsMixin<book_object>
  setbook_objects!: Sequelize.HasManySetAssociationsMixin<book_object, book_objectId>
  addbook_object!: Sequelize.HasManyAddAssociationMixin<book_object, book_objectId>
  addbook_objects!: Sequelize.HasManyAddAssociationsMixin<book_object, book_objectId>
  createbook_object!: Sequelize.HasManyCreateAssociationMixin<book_object>
  removebook_object!: Sequelize.HasManyRemoveAssociationMixin<book_object, book_objectId>
  removebook_objects!: Sequelize.HasManyRemoveAssociationsMixin<book_object, book_objectId>
  hasbook_object!: Sequelize.HasManyHasAssociationMixin<book_object, book_objectId>
  hasbook_objects!: Sequelize.HasManyHasAssociationsMixin<book_object, book_objectId>
  countbook_objects!: Sequelize.HasManyCountAssociationsMixin
  book_group!: book_group[]
  getbook_group!: Sequelize.HasManyGetAssociationsMixin<book_group>

  static initModel(sequelize: Sequelize.Sequelize): typeof view_book {
    return view_book.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
        },
        id_created_by: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        id_document_type: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 1,
          references: {
            model: 'document_type',
            key: 'id',
          },
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        authors: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        language: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        published: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        theme: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        metadata: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        isbn: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        document_type_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        id_group: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        group_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        id_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        tableName: 'view_book',
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'isbn',
            using: 'BTREE',
            fields: [{ name: 'isbn' }],
          },
        ],
      }
    )
  }
}
