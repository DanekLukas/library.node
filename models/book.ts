import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { book_object, book_objectId } from './book_object';
import type { document_type, document_typeId } from './document_type';

export interface bookAttributes {
  id: number;
  created_at: Date;
  id_created_by: number;
  id_document_type: number;
  name: string;
  authors: string;
  language: string;
  published: string;
  theme: string;
  metadata: string;
  isbn: string;
}

export type bookPk = "id";
export type bookId = book[bookPk];
export type bookOptionalAttributes = "id" | "created_at" | "id_document_type" | "name" | "authors" | "language" | "published" | "theme" | "metadata" | "isbn";
export type bookCreationAttributes = Optional<bookAttributes, bookOptionalAttributes>;

export class book extends Model<bookAttributes, bookCreationAttributes> implements bookAttributes {
  id!: number;
  created_at!: Date;
  id_created_by!: number;
  id_document_type!: number;
  name!: string;
  authors!: string;
  language!: string;
  published!: string;
  theme!: string;
  metadata!: string;
  isbn!: string;

  // book hasMany book_object via id_book
  book_objects!: book_object[];
  getBook_objects!: Sequelize.HasManyGetAssociationsMixin<book_object>;
  setBook_objects!: Sequelize.HasManySetAssociationsMixin<book_object, book_objectId>;
  addBook_object!: Sequelize.HasManyAddAssociationMixin<book_object, book_objectId>;
  addBook_objects!: Sequelize.HasManyAddAssociationsMixin<book_object, book_objectId>;
  createBook_object!: Sequelize.HasManyCreateAssociationMixin<book_object>;
  removeBook_object!: Sequelize.HasManyRemoveAssociationMixin<book_object, book_objectId>;
  removeBook_objects!: Sequelize.HasManyRemoveAssociationsMixin<book_object, book_objectId>;
  hasBook_object!: Sequelize.HasManyHasAssociationMixin<book_object, book_objectId>;
  hasBook_objects!: Sequelize.HasManyHasAssociationsMixin<book_object, book_objectId>;
  countBook_objects!: Sequelize.HasManyCountAssociationsMixin;
  // book belongsTo document_type via id_document_type
  id_document_type_document_type!: document_type;
  getId_document_type_document_type!: Sequelize.BelongsToGetAssociationMixin<document_type>;
  setId_document_type_document_type!: Sequelize.BelongsToSetAssociationMixin<document_type, document_typeId>;
  createId_document_type_document_type!: Sequelize.BelongsToCreateAssociationMixin<document_type>;

  static initModel(sequelize: Sequelize.Sequelize): typeof book {
    return book.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    id_created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    id_document_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'document_type',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    authors: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    published: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    theme: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    metadata: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    isbn: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'book',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "isbn",
        using: "BTREE",
        fields: [
          { name: "isbn" },
        ]
      },
      {
        name: "book_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "id_document_type" },
        ]
      },
    ]
  });
  }
}
